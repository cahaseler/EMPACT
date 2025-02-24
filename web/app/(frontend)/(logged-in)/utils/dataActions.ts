"use server"
import { AssessmentCollection, Assessment, AssessmentPart, AssessmentCollectionUser, AssessmentUserResponse } from "@/prisma/mssql/generated/client"
import * as assessmentCollection from "@/app/utils/assessmentCollection"
import * as assessment from "@/app/utils/assessment"
import * as assessmentPart from "@/app/utils/assessmentPart"
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

export async function updateAssessment(
    assessmentId: number,
    projectId: string,
    collectionId: number | null, 
    name: string, 
    status: string,
    location: string,
    date: Date,
    description: string
): Promise<Assessment> {
    return await assessment.update({ where: { id: assessmentId }, data: { 
        projectId,
        assessmentCollectionId: collectionId, 
        name,
        status,
        location,
        date,
        description
    } })
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