import { BACKEND_PORT, BACKEND_URL } from '@env';
import { Alert } from 'react-native';
import useJwtUtils from './useJwtUtils';

const REQUEST_BASE_URL = `${BACKEND_URL}:${BACKEND_PORT}`;

export default function useAPI() {
    const {
        resolveTokensFromHeader,
        storeRefreshToken,
        storeAccessToken,
        getRefreshToken,
        getAccessToken
    } = useJwtUtils();

    const fetchAPI = async (route, requestInit = {}, accessToken = '', refreshToken = '') => {
        try {
            const { method = 'GET', body } = requestInit;

            const fetchOptions = {
                method,
                headers: {
                    'Accept': 'application/json;charset=UTF-8',
                    'Content-Type': 'application/json;charset=UTF-8',
                    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
                    ...requestInit.headers
                },
                ...(method !== 'GET' && body ? { body: JSON.stringify(body) } : {})
            };

            let response = await fetch(REQUEST_BASE_URL + route, fetchOptions);

            if (!response.ok && refreshToken) {
                fetchOptions.headers['Authorization'] = `Bearer ${refreshToken}`;
                response = await fetch(REQUEST_BASE_URL + route, fetchOptions);
            }

            if (response.ok) {
                const { accessToken, refreshToken } = resolveTokensFromHeader(response.headers);

                if (accessToken && refreshToken) {
                    storeAccessToken(accessToken);
                    storeRefreshToken(refreshToken);
                }
            }

            return response;
        } catch (ex) {
            console.error(ex);
            if (ex.message === 'Network request failed') {
                Alert.alert('오류', '서버에 연결할 수 없습니다.');
            }
        }
    }

    const getMyInfo = async () => {
        const accessToken = getAccessToken();
        const refreshToken = await getRefreshToken();

        const response = await fetchAPI('/@me', {
            method: 'GET'
        }, accessToken, refreshToken);

        return response;
    }

    const doLogin = async (idToken, authProvider) => {
        const response = await fetchAPI('/login', {
            method: 'POST',
            body: {
                idToken,
                authProvider
            }
        });
        return response;
    }

    const doRegister = async (registerData) => {
        const response = await fetchAPI('/register', {
            method: 'POST',
            body: registerData
        });
        return response;
    }


    const getRegistrationTerms = async () => {
        const response = await fetchAPI('/terms/registration', {
            method: 'GET'
        });
        return response;
    }

    return {
        doLogin,
        doRegister,
        getMyInfo,
        getRegistrationTerms,
        fetchAPI
    };
}