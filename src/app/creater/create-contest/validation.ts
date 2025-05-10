import * as yup from 'yup';

export interface Problem {
    name: string
    link: string
    points: string
    difficulty: string
    slug: string
    lcid: number
}

export interface ContestDetails {
    name: string
    startTime: string
    duration: string
    maxParticipants: string
    visibility: boolean
    problems: Problem[]
}

export interface ValidationErrors {
    contestDetails?: Record<string, string>
    newProblem?: Record<string, string>
}

// Validation schemas
export const problemSchema = yup.object().shape({
    name: yup.string().required('Problem name is required'),
    link: yup.string().url('Must be a valid URL').required('Problem link is required'),
    points: yup.string().required('Points are required'),
    difficulty: yup.string().required('Difficulty is required'),
    slug: yup.string().required('Slug is required'),
    lcid: yup.number().min(0, 'Valid LeetCode ID is required').required('LeetCode ID is required')
});

export const contestDetailsSchema = yup.object().shape({
    name: yup.string().required('Contest name is required'),
    startTime: yup.string().required('Start time is required'),
    duration: yup.string().required('Duration is required')
        .test('is-positive', 'Duration must be positive', value => parseInt(value) > 0),
    maxParticipants: yup.string().required('Max participants is required')
        .test('is-positive', 'Max participants must be positive', value => parseInt(value) > 0),
    visibility: yup.boolean(),
    problems: yup.array().of(problemSchema)
        .min(1, 'At least one problem is required')
});

// Validation helper functions
export const validateContestDetails = async (
    contestDetails: ContestDetails,
    setValidationErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
) => {
    try {
        await contestDetailsSchema.validate(contestDetails, { abortEarly: false });
        setValidationErrors(prev => ({ ...prev, contestDetails: {} }));
        return true;
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors: Record<string, string> = {};
            error.inner.forEach(err => {
                if (err.path) {
                    errors[err.path] = err.message;
                }
            });
            setValidationErrors(prev => ({ ...prev, contestDetails: errors }));
        }
        return false;
    }
};

export const validateNewProblem = async (
    problem: Problem,
    setValidationErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
) => {
    try {
        await problemSchema.validate(problem, { abortEarly: false });
        setValidationErrors(prev => ({ ...prev, newProblem: {} }));
        return true;
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors: Record<string, string> = {};
            error.inner.forEach(err => {
                if (err.path) {
                    errors[err.path] = err.message;
                }
            });
            setValidationErrors(prev => ({ ...prev, newProblem: errors }));
        }
        return false;
    }
};
