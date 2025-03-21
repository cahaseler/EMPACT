"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { db } from "@/lib/db"

// Schema for user update validation
const UserUpdateSchema = z.object({
  id: z.number(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  systemRoleIds: z.array(z.number()).optional(),
})

// Schema for bulk user creation validation
const CreateUsersSchema = z.object({
  emails: z.string().min(1, "At least one email is required"),
})

type UserUpdateInput = z.infer<typeof UserUpdateSchema>

/**
 * Update user information
 */
export async function updateUser(data: UserUpdateInput) {
  try {
    // Validate input data
    const validatedData = UserUpdateSchema.parse(data)

    const { id, systemRoleIds, ...userData } = validatedData

    // Update user basic information
    const updatedUser = await db.user.update({
      where: {
        id: id,
      },
      data: {
        ...userData,
        // If systemRoleIds are provided, update the user's roles
        ...(systemRoleIds && {
          systemRoles: {
            // Disconnect all existing roles
            set: [],
            // Connect to new roles
            connect: systemRoleIds.map((roleId) => ({ id: roleId })),
          },
        }),
      },
      include: {
        systemRoles: true,
      },
    })

    // Revalidate the admin page to reflect changes
    revalidatePath("/admin")
    return {
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation error",
        errors: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      }
    }

    console.error("Error updating user:", error)
    return { success: false, message: "Failed to update user" }
  }
}

/**
 * Create multiple users from a list of emails
 */
export async function createUsers(data: { emails: string }) {
  try {
    // Validate input data
    const validatedData = CreateUsersSchema.parse(data)

    // Split emails by comma or newline
    const emails = validatedData.emails
      .split(/[\s,\n]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0)

    // Validate each email
    const validEmails = emails.filter((email) => {
      try {
        z.string().email().parse(email)
        return true
      } catch {
        return false
      }
    })

    if (validEmails.length === 0) {
      return {
        success: false,
        message: "No valid emails provided",
      }
    }

    // Create users with empty names
    const createdUsers = await Promise.all(
      validEmails.map(async (email) => {
        try {
          // Check if user already exists
          const existingUser = await db.user.findUnique({
            where: { email },
          })

          if (existingUser) {
            return {
              email,
              success: false,
              message: "User already exists",
            }
          }

          // Create new user
          const newUser = await db.user.create({
            data: {
              email,
              firstName: "",
              lastName: "",
            },
          })

          return {
            email,
            success: true,
            message: "User created",
            user: newUser,
          }
        } catch (error) {
          console.error(`Error creating user ${email}:`, error)
          return {
            email,
            success: false,
            message: "Failed to create user",
          }
        }
      })
    )

    // Revalidate the admin page to reflect changes
    revalidatePath("/admin")

    // Calculate summary
    const successful = createdUsers.filter((result) => result.success).length
    const failed = createdUsers.filter((result) => !result.success).length

    return {
      success: successful > 0,
      message: `${successful} users created successfully. ${failed} failed.`,
      results: createdUsers,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation error",
        errors: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      }
    }

    console.error("Error creating users:", error)
    return { success: false, message: "Failed to create users" }
  }
}
