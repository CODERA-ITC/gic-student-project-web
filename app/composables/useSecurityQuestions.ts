/**
 * Composable for security questions API
 * Handles fetching questions and submitting answers
 */

export interface SecurityQuestion {
    id: string;
    questions: string;
}

export interface SecurityQuestionAnswer {
    questionId: string;
    answer: string;
}

export const useSecurityQuestions = () => {
    /**
     * Fetch all available security questions
     * No auth required
     */
    const fetchSecurityQuestions = async (): Promise<SecurityQuestion[]> => {
        try {
            const response = await fetch('/api/security-questions', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch security questions');
            }

            const questions: SecurityQuestion[] = await response.json();
            return questions;
        } catch (error) {
            console.error('Error fetching security questions:', error);
            throw error;
        }
    };

    /**
     * Submit security question answers
     * Requires authentication
     */
    const submitSecurityAnswers = async (
        answers: SecurityQuestionAnswer[],
        token: string
    ): Promise<any> => {
        try {
            // Validate answers
            for (const answer of answers) {
                if (!answer.answer || answer.answer.trim().length < 2) {
                    throw new Error('Each answer must be at least 2 characters long');
                }
                if (answer.answer.trim().length > 100) {
                    throw new Error('Each answer must be less than 100 characters');
                }
            }

            const response = await fetch('/api/security-questions/answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ answers }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to submit security answers');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error submitting security answers:', error);
            throw error;
        }
    };

    return {
        fetchSecurityQuestions,
        submitSecurityAnswers,
    };
};
