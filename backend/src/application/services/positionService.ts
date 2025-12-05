import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PositionCandidateInfo {
  completeName: string;
  currentInterviewStep: string;
  averagePoints: number | null;
  positionId: number;
}

export const getCandidatesByPositionId = async (positionId: number): Promise<PositionCandidateInfo[]> => {
  try {
    // Verify position exists
    const position = await prisma.position.findUnique({
      where: { id: positionId }
    });

    if (!position) {
      throw new Error('Position not found');
    }

    // Get all applications for this position with related data
    const applications = await prisma.application.findMany({
      where: { positionId: positionId },
      include: {
        candidate: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        interviewStep: {
          select: {
            name: true
          }
        },
        interviews: {
          select: {
            score: true
          }
        }
      }
    });

    // Transform the data to match the required format
    const candidatesInfo: PositionCandidateInfo[] = applications.map(application => {
      // Calculate average points from interviews
      const scores = application.interviews
        .map(interview => interview.score)
        .filter((score): score is number => score !== null);
      
      const averagePoints = scores.length > 0
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length
        : null;

      return {
        completeName: `${application.candidate.firstName} ${application.candidate.lastName}`,
        currentInterviewStep: application.interviewStep.name,
        averagePoints: averagePoints,
        positionId: positionId
      };
    });

    return candidatesInfo;
  } catch (error) {
    console.error('Error fetching candidates for position:', error);
    throw error;
  }
};


