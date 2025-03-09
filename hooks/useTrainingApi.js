import useAPI from './useApi';
import useJwtUtils from './useJwtUtils';

export default function useTrainingApi() {
    const { fetchAPI } = useAPI();
    const { getAccessToken, getRefreshToken } = useJwtUtils();

    const getTrainings = async () => {
        const accessToken = getAccessToken();
        const refreshToken = await getRefreshToken();

        const response = await fetchAPI('/api/trainings', {
            method: 'GET'
        }, accessToken, refreshToken);

        if (response.ok) {
            const data = await response.json();
            return { ok: true, data };
        }
        return { ok: false, error: 'Failed to fetch trainings' };
    };

    const saveTrainingProgress = async (trainingId, scenarioId, score) => {
        const accessToken = getAccessToken();
        const refreshToken = await getRefreshToken();

        const response = await fetchAPI(`/api/trainings/${trainingId}/progress`, {
            method: 'POST',
            body: {
                scenarioId,
                score
            }
        }, accessToken, refreshToken);

        if (response.ok) {
            return { ok: true };
        }
        return { ok: false, error: 'Failed to save progress' };
    };

    const getTrainingProgress = async (trainingId) => {
        const accessToken = getAccessToken();
        const refreshToken = await getRefreshToken();

        const response = await fetchAPI(`/api/trainings/${trainingId}/progress`, {
            method: 'GET'
        }, accessToken, refreshToken);

        if (response.ok) {
            const data = await response.json();
            return { ok: true, data };
        }
        return { ok: false, error: 'Failed to fetch progress' };
    };

    const getProgressSummary = async () => {
        const accessToken = getAccessToken();
        const refreshToken = await getRefreshToken();

        const response = await fetchAPI('/api/trainings/progress/summary', {
            method: 'GET'
        }, accessToken, refreshToken);

        if (response.ok) {
            const data = await response.json();
            return { ok: true, data };
        }
        return { ok: false, error: 'Failed to fetch progress summary' };
    };

    const checkTrainingCompletion = async (trainingId) => {
        const accessToken = getAccessToken();
        const refreshToken = await getRefreshToken();

        const response = await fetchAPI(`/api/trainings/${trainingId}/completion`, {
            method: 'GET'
        }, accessToken, refreshToken);

        if (response.ok) {
            const data = await response.json();
            return { ok: true, data };
        }
        return { ok: false, error: 'Failed to check training completion' };
    };

    return {
        getTrainings,
        saveTrainingProgress,
        getTrainingProgress,
        getProgressSummary,
        checkTrainingCompletion
    };
}
