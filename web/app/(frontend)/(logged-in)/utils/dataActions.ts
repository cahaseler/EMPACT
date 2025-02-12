"use server"
import { AssessmentCollection, AssessmentCollectionUser, AssessmentUserResponse } from "@/prisma/mssql/generated/client"
import * as assessmentCollection from "@/app/utils/assessmentCollection"
import * as assessmentCollectionUser from "@/app/utils/assessmentCollectionUser"
import * as assessmentUserResponse from "@/app/utils/assessmentUserResponse"

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