import { Request, Response } from 'express';
import { addCandidate, findCandidateById, updateCandidateInterviewStep } from '../../application/services/candidateService';

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await addCandidate(candidateData);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};

export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const candidate = await findCandidateById(id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateCandidateStage = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id);
        
        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'Invalid candidate ID format' });
        }

        const { positionId, interviewStepId } = req.body;

        if (!positionId || !interviewStepId) {
            return res.status(400).json({ 
                error: 'Missing required fields: positionId and interviewStepId are required' 
            });
        }

        const positionIdNum = parseInt(positionId);
        const interviewStepIdNum = parseInt(interviewStepId);

        if (isNaN(positionIdNum) || isNaN(interviewStepIdNum)) {
            return res.status(400).json({ 
                error: 'Invalid format: positionId and interviewStepId must be valid numbers' 
            });
        }

        const updatedApplication = await updateCandidateInterviewStep(
            candidateId,
            positionIdNum,
            interviewStepIdNum
        );

        res.json({
            message: 'Candidate interview step updated successfully',
            data: {
                candidateId: candidateId,
                positionId: positionIdNum,
                interviewStepId: interviewStepIdNum,
                currentInterviewStep: updatedApplication.interviewStep.name,
                candidateName: `${updatedApplication.candidate.firstName} ${updatedApplication.candidate.lastName}`,
                positionTitle: updatedApplication.position.title
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Candidate not found') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === 'Position not found' || 
                error.message === 'Interview step not found' ||
                error.message === 'Application not found for this candidate and position') {
                return res.status(404).json({ error: error.message });
            }
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { addCandidate };