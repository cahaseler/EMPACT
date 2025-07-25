"use server"
import * as assessment from "@/app/utils/assessment"
import * as assessmentCollection from "@/app/utils/assessmentCollection"
import * as assessmentCollectionUser from "@/app/utils/assessmentCollectionUser"
import * as assessmentUser from "@/app/utils/assessmentUser"
import * as assessmentUserGroup from "@/app/utils/assessmentUserGroup"
import * as assessmentUserResponse from "@/app/utils/assessmentUserResponse"
import { db } from "@/lib/db"
import {
  Assessment,
  AssessmentAttribute,
  AssessmentCollection,
  AssessmentCollectionUser,
  AssessmentFinalizedDate,
  AssessmentPart,
  AssessmentPartFinalizedDate,
  AssessmentUser,
  AssessmentUserGroup,
  AssessmentUserResponse
} from "@/prisma/mssql/generated/client"

type idObject = { id: number }

type BatchPayload = {
  count: number
}

type NewAssessmentAttribute = {
  assessmentId: number
  attributeId: string
}

type NewAssessmentCollectionUser = {
  role: string
  assessmentCollectionId: number
  userId: number
}

type NewAssessmentUser = {
  role: string
  userId: number
  assessmentId: number
  assessmentUserGroupId: number | null
}

type NewScoreSummary = {
  score: number
  assessmentId: number
  assessmentPartId: number
  assessmentUserGroupId: number
}

export async function createAssessmentCollection(
  name: string,
  assessmentTypeId: number
): Promise<AssessmentCollection> {
  return await assessmentCollection.create({ data: { name, assessmentTypeId } })
}

export async function updateAssessmentCollection(
  collectionId: number,
  name: string,
  assessmentTypeId: number
): Promise<AssessmentCollection> {
  return await assessmentCollection.update({
    where: { id: collectionId },
    data: { name, assessmentTypeId },
  })
}

export async function deleteAssessmentCollection(
  collectionId: number
): Promise<AssessmentCollection> {
  return await assessmentCollection.delete_({ where: { id: collectionId } })
}

export async function createAssessmentCollectionUser(
  userId: number,
  assessmentCollectionId: number
): Promise<AssessmentCollectionUser> {
  return await assessmentCollectionUser.create({
    data: { userId, role: "Collection Manager", assessmentCollectionId },
  })
}

export async function createAssessmentCollectionUsers(
  newCollectionUsers: NewAssessmentCollectionUser[]
): Promise<BatchPayload> {
  return await assessmentCollectionUser.createMany({ data: newCollectionUsers })
}

export async function deleteAssessmentCollectionUser(
  userId: number
): Promise<AssessmentCollectionUser> {
  return await assessmentCollectionUser.delete_({ where: { id: userId } })
}

export async function createAssessment(
  projectId: string,
  collectionId: number | null,
  name: string,
  status: string,
  location: string,
  description: string
): Promise<Assessment> {
  return await assessment.create({
    data: {
      projectId,
      assessmentCollectionId: collectionId,
      name,
      status,
      completedDate: null,
      location,
      description,
    },
  })
}

export async function updateAssessment(
  assessmentId: number,
  projectId: string,
  collectionId: number | null,
  name: string,
  status: string,
  location: string,
  description: string,
  completedDate?: Date,
): Promise<Assessment> {
  const date = completedDate ? completedDate : null
  return await assessment.update({
    where: { id: assessmentId },
    data: {
      projectId,
      assessmentCollectionId: collectionId,
      name,
      status,
      location,
      description,
      completedDate: date
    },
  })
}

export async function deleteAssessment(
  assessmentId: number
): Promise<Assessment> {
  return await assessment.delete_({ where: { id: assessmentId } })
}

export async function createAssessmentPart(
  status: string,
  date: Date,
  assessmentId: number,
  partId: number
): Promise<AssessmentPart> {
  return await db.assessmentPart.create({
    data: { status, date, assessmentId, partId },
  })
}

export async function updateAssessmentPart(
  assessmentPartId: number,
  status: string,
  date: Date,
  assessmentId: number,
  partId: number
): Promise<AssessmentPart> {
  return await db.assessmentPart.update({
    where: { id: assessmentPartId },
    data: {
      status,
      date,
      assessmentId,
      partId,
    },
  })
}

export async function createAssessmentAttribute(
  assessmentId: number,
  attributeId: string
): Promise<AssessmentAttribute> {
  return await db.assessmentAttribute.create({ data: { assessmentId, attributeId } })
}

export async function createAssessmentAttributes(
  assessmentAttributes: NewAssessmentAttribute[]
): Promise<BatchPayload> {
  return await db.assessmentAttribute.createMany({ data: assessmentAttributes })
}

export async function deleteAssessmentAttribute(
  assessmentId: number,
  attributeId: string
): Promise<AssessmentAttribute> {
  return await db.assessmentAttribute.delete({ where: { assessmentId_attributeId: { assessmentId, attributeId } } })
}

export async function deleteAssessmentAttributes(
  assessmentId: number,
  assessmentAttributeIds: string[]
): Promise<BatchPayload> {
  return await db.assessmentAttribute.deleteMany({
    where: {
      assessmentId,
      attributeId: {
        in: assessmentAttributeIds
      }
    }
  })
}

export async function createAssessmentUserGroup(
  name: string,
  status: string,
  assessmentId: number
): Promise<AssessmentUserGroup> {
  return await assessmentUserGroup.create({
    data: { name, status, assessmentId },
  })
}

export async function updateAssessmentUserGroup(
  assessmentUserGroupId: number,
  name: string,
  status: string
): Promise<AssessmentUserGroup> {
  return await assessmentUserGroup.update({
    where: { id: assessmentUserGroupId },
    data: { name, status },
  })
}

export async function deleteAssessmentUserGroup(
  assessmentUserGroupId: number
): Promise<AssessmentUserGroup> {
  return await assessmentUserGroup.delete_({
    where: { id: assessmentUserGroupId },
  })
}

export async function createAssessmentUser(
  assessmentId: number,
  role: string,
  userId: number,
  assessmentUserGroupId: number | null
): Promise<AssessmentUser> {
  return await assessmentUser.create({
    data: { assessmentId, role, userId, assessmentUserGroupId },
  })
}

export async function createAssessmentUsers(
  users: NewAssessmentUser[]
): Promise<BatchPayload> {
  return await assessmentUser.createMany({ data: users })
}

export async function updateAssessmentUser(
  assessmentUserId: number,
  role: string,
  assessmentUserGroupId: number | null,
  partIds: idObject[],
  permissionIds: idObject[]
): Promise<AssessmentUser> {
  return await assessmentUser.update({
    where: { id: assessmentUserId },
    data: {
      role,
      assessmentUserGroupId,
      participantParts: { set: partIds },
      permissions: { set: permissionIds },
    },
  })
}

export async function deleteAssessmentUser(
  assessmentUserId: number
): Promise<AssessmentUser> {
  return await assessmentUser.delete_({ where: { id: assessmentUserId } })
}

export async function updateAssessmentUserResponsesGroupId(
  assessmentId: number,
  userId: number,
  assessmentUserGroupId: number,
): Promise<BatchPayload> {
  return await db.assessmentUserResponse.updateMany({
    where: {
      AND: {
        assessmentId,
        userId
      }
    },
    data: { assessmentUserGroupId },
  })
}

export async function upsertAssessmentUserResponse(
  assessmentId: number,
  userId: number,
  assessmentUserGroupId: number,
  attributeId: string,
  levelId: number,
  notes: string
): Promise<AssessmentUserResponse> {
  return await assessmentUserResponse.upsert({
    where: {
      assessmentId_userId_assessmentUserGroupId_attributeId: {
        assessmentId,
        userId,
        assessmentUserGroupId,
        attributeId
      }
    },
    create: { assessmentId, userId, assessmentUserGroupId, attributeId, levelId, notes },
    update: { levelId, notes },
  })
}

export async function createScoreSummaries(
  scoreSummaries: NewScoreSummary[]
): Promise<BatchPayload> {
  return await db.scoreSummary.createMany({ data: scoreSummaries })
}

export async function deleteScoreSummaries(
  assessmentPartId: number
): Promise<BatchPayload> {
  return await db.scoreSummary.deleteMany({ where: { assessmentPartId } })
}

export async function createAssessmentFinalizedDate(
  assessmentId: number
): Promise<AssessmentFinalizedDate> {
  return await db.assessmentFinalizedDate.create({
    data: {
      assessmentId,
      date: new Date()
    }
  })
}

export async function createAssessmentPartFinalizedDate(
  assessmentPartId: number
): Promise<AssessmentPartFinalizedDate> {
  return await db.assessmentPartFinalizedDate.create({
    data: {
      assessmentPartId,
      date: new Date()
    }
  })
}