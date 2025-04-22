// Centralized type definitions related to assessments

export type AssessmentPartToAdd = {
  partId: number;
  status: string;
  date: Date; // Expecting a Date object as logic ensures this
};

// Add other assessment-related types here in the future if needed