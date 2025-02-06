import AsyncStorage from '@react-native-async-storage/async-storage';
import { useJwtStore } from '../store';

function useJwtUtils() {
    const { accessToken, refreshToken, setAccessToken, setRefreshToken } = useJwtStore();

    const authProviders = {
        KAKAO: 'KAKAO',
        APPLE: 'APPLE',
        GOOGLE: 'GOOGLE'
    }

    const resolveTokensFromHeader = (headers) => {
        const headerMap = headers?.map || {};
        const accessToken = headerMap['authorization']?.startsWith('Bearer ')
            ? headerMap['authorization'].slice('Bearer '.length)
            : null;
        const refreshToken = headerMap['x-refresh-token'];

        return { accessToken, refreshToken };
    }


    const storeAccessToken = (accessToken) => {
        setAccessToken(accessToken);
    }

    const getAccessToken = () => {
        return accessToken;
    }

    const storeRefreshToken = async (refreshToken) => {
        try {
            setRefreshToken(refreshToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);
        } catch (ex) {
            throw new Error('토큰 처리중 오류 발생');
        }
    }

    const getRefreshToken = async () => {
        if (refreshToken === '') {
            try {
                return await AsyncStorage.getItem("refreshToken");
            } catch (ex) {
                console.log(ex);
                return '';
            }
        }

        return refreshToken;
    }

    return {
        authProviders,
        resolveTokensFromHeader,
        storeAccessToken,
        getAccessToken,
        storeRefreshToken,
        getRefreshToken
    };
}

export default useJwtUtils;