"use server"
import { db } from "@/lib/db"
import { 
    AssessmentCollection, 
    Assessment, 
    AssessmentPart, 
    AssessmentCollectionUser, 
    AssessmentUser,
    AssessmentUserResponse 
} from "@/prisma/mssql/generated/client"
import * as assessmentCollection from "@/app/utils/assessmentCollection"
import * as assessment from "@/app/utils/assessment"
import * as assessmentPart from "@/app/utils/assessmentPart"
import * as assessmentCollectionUser from "@/app/utils/assessmentCollectionUser"
import * as assessmentUser from "@/app/utils/assessmentUser"
import * as assessmentUserResponse from "@/app/utils/assessmentUserResponse"

type idObject = { id: number }

export async function createAssessmentCollection(name: string, assessmentTypeId: number): Promise<AssessmentCollection> {
    return await assessmentCollection.create({ data: { name, assessmentTypeId } })
}

export async function createAssessmentCollectionUser(userId: number, assessmentCollectionId: number): Promise<AssessmentCollectionUser> {
    return await assessmentCollectionUser.create({ data: { userId, role: "Collection Manager", assessmentCollectionId } })
}

export async function updateAssessmentCollection(collectionId: number, name: string, assessmentTypeId: number): Promise<AssessmentCollection> {
    return await assessmentCollection.update({ where: { id: collectionId }, data: { name, assessmentTypeId } })
}

export async function deleteAssessmentCollection(collectionId: number): Promise<AssessmentCollection> {
    return await assessmentCollection.delete_({ where: { id: collectionId } })
}

export async function createAssessment(
    projectId: string,
    collectionId: number | null, 
    name: string, 
    status: string,
    location: string,
    description: string
): Promise<Assessment> {
    return await assessment.create({ data: { 
        projectId,
        assessmentCollectionId: collectionId, 
        name,
        status,
        completedDate: "",
        location,
        description
    } })
}

export async function updateAssessment(
    assessmentId: number,
    projectId: string,
    collectionId: number | null, 
    name: string, 
    status: string,
    location: string,
    description: string
): Promise<Assessment> {
    return await assessment.update({ where: { id: assessmentId }, data: { 
        projectId,
        assessmentCollectionId: collectionId, 
        name,
        status,
        location,
        description
    } })
}

export async function deleteAssessment(assessmentId: number): Promise<Assessment> {
    return await assessment.delete_({ where: { id: assessmentId } })
}

export async function createAssessmentPart(
    status: string,
    date: Date,
    assessmentId: number,
    partId: number
): Promise<AssessmentPart> {
    return await db.assessmentPart.create({ data: { status, date, assessmentId, partId } })
}

export async function updateAssessmentPart(
    assessmentPartId: number,
    status: string,
    assessmentId: number,
    partId: number
): Promise<AssessmentPart> {
    return await assessmentPart.update({ where: { id: assessmentPartId }, data: { 
        status,
        assessmentId,
        partId
    } })
}

export async function createAssessmentUser(
    assessmentId: number,
    role: string,
    userId: number,
    assessmentUserGroupId: number | null,
): Promise<AssessmentUser> {
    return await assessmentUser.create({ data: { assessmentId, role, userId, assessmentUserGroupId } })
}

export async function updateAssessmentUser(
    assessmentUserId: number,
    role: string,
    assessmentUserGroupId: number | null,
    partIds: idObject[],
    permissionIds: idObject[],
): Promise<AssessmentUser> {
    return await assessmentUser.update({ where: { id: assessmentUserId }, data: { 
        role, 
        assessmentUserGroupId,
        participantParts: { set: partIds },
        permissions: { set: permissionIds }
    } })
}

export async function deleteAssessmentUser(assessmentUserId: number): Promise<AssessmentUser> {
    return await assessmentUser.delete_({ where: { id: assessmentUserId } })
}

export async function createAssessmentUserResponse(
    assessmentId: number,
    userId: number,
    attributeId: string,
    levelId: number,
    notes: string
): Promise<AssessmentUserResponse> {
    return await assessmentUserResponse.create({ data: { assessmentId, userId, attributeId, levelId, notes } })
}

export async function updateAssessmentUserResponse(response: AssessmentUserResponse): Promise<AssessmentUserResponse> {
    return await assessmentUserResponse.update({ where: { id: response.id }, data: { 
        assessmentId: response.assessmentId, 
        userId: response.userId, 
        attributeId: response.attributeId, 
        levelId: response.levelId, 
        notes: response.notes
    } })
}