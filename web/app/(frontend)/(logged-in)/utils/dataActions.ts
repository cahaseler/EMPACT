"use server"
import { AssessmentUserResponse } from "@/prisma/mssql/generated/client"
import * as assessmentUserResponse from "@/app/utils/assessmentUserResponse"

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