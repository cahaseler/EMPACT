export {}

type SystemRole = {
  name: string
  id: number
}

type AssessmentUser = {
  id: number
  role: string
  assessmentId: number
  userId: number
  assessmentUserGroupId: number | null
  participantParts: {
    id: number
    status: string
    date: Date
    partId: number
    assessmentId: number
  }[]
  permissions: {
    id: number
    name: string
  }[]
}

type AssessmentCollectionUser = {
  id: number
  role: string
  assessmentCollectionId: number
  userId: number
}

// Keep your global interface for consistency
declare global {
  interface CustomJwtSessionClaims {
    user: {
      id: string
      email: string
      last_name?: string
      first_name?: string
      name: string
    }
    metadata: {
      systemRoles?: SystemRole[]
      assessmentUser?: AssessmentUser[]
      assessmentCollectionUser?: AssessmentCollectionUser[]
      databaseId?: number
    }
  }
}
