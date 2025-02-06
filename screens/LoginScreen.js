import { IOS_CLIENT_ID } from '@env';
import { GoogleSignin, isCancelledResponse } from '@react-native-google-signin/google-signin';
import * as KakaoLogins from '@react-native-seoul/kakao-login';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Image } from 'expo-image';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import phishmeIcon from '../assets/icon.png';
import appleIcon from '../assets/sns-icons/apple_icon.png';
import googleIcon from '../assets/sns-icons/google_icon.png';
import kakaoIcon from '../assets/sns-icons/kakao_icon.png';

import Animated, { FadeIn } from 'react-native-reanimated';
import { useModalDispatch } from '../components/modals/ModalProvider';
import useAPI from '../hooks/useApi';
import useJwtUtils from '../hooks/useJwtUtils';
import responsive from '../scripts/responsive';

GoogleSignin.configure({ iosClientId: IOS_CLIENT_ID });

export default function LoginScreen({ navigation }) {
    const { authProviders } = useJwtUtils();
    const { doLogin } = useAPI();
    const { modalOpen } = useModalDispatch();

    const sendLoginRequest = async (idToken, authProvider) => {
        const response = await doLogin(idToken, authProvider);
        if (!response) {
            return;
        }

        const responseData = await response.json();
        const { code, message, userEmail } = responseData;

        if (!response.ok) {
            const errorMessage = code === 'USER-004'
                ? '이미 회원가입된 이메일입니다.'
                : message;

            modalOpen({
                modalType: 'alert',
                title: '오류',
                description: errorMessage
            });
            return;
        }

        if (message === 'needRegistration') {
            navigation.navigate('Register', { userEmail, idToken, authProvider });
            return;
        }

        navigation.navigate('Main');
    }

    const loginWithProvider = async (provider, getToken) => {
        let token = null;

        try {
            token = await getToken();
        } catch (ex) {
            if (isCancelledResponse(ex)) {
                return;
            }

            if (ex.code === 'ERR_REQUEST_CANCELED') {
                return;
            }

            console.error(`${provider} 로그인 실패`, ex);
            modalOpen({
                modalType: 'alert',
                title: '오류',
                description: '로그인중 오류가 발생했습니다.'
            });
        }

        if (!token) {
            throw new Error('idToken이 비어있습니다');
        }
        await sendLoginRequest(token, provider);
    };

    const getKakaoToken = async () => {
        const token = await KakaoLogins.login();
        return token?.idToken;
    }

    const getAppleToken = async () => {
        const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
        });
        return credential?.identityToken;
    }

    const getGoogleToken = async () => {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const response = await GoogleSignin.signIn();
        const { idToken } = response?.data;
        return idToken;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View key={'loginScreen'} entering={FadeIn.duration(600)} style={styles.container}>
                <View style={styles.titleContainer}>
                    <Image style={styles.loginIcon} source={phishmeIcon} />
                    <Text style={styles.description}>{'피시미'}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.kakaoButton]}
                        activeOpacity={0.8}
                        onPress={() => loginWithProvider(authProviders.KAKAO, getKakaoToken)}
                    >
                        <Image style={styles.buttonImage} source={kakaoIcon} contentFit="cover" />
                        <Text style={styles.buttonTextBlack}>{'카카오톡으로 시작하기'}</Text>
                    </TouchableOpacity>

                    {
                        Platform.OS === 'ios' && (
                            <TouchableOpacity
                                style={[styles.button, styles.appleButton]}
                                activeOpacity={0.8}
                                onPress={() => loginWithProvider(authProviders.APPLE, getAppleToken)}
                            >
                                <Image style={styles.buttonImage} source={appleIcon} contentFit="cover" />
                                <Text style={styles.buttonTextWhite}>{'Apple로 시작하기'}</Text>
                            </TouchableOpacity>
                        )
                    }

                    <TouchableOpacity
                        style={[styles.button, styles.googleButton]}
                        activeOpacity={0.8}
                        onPress={() => loginWithProvider(authProviders.GOOGLE, getGoogleToken)}
                    >
                        <Image style={styles.buttonImage} source={googleIcon} contentFit="cover" />
                        <Text style={styles.buttonTextBlack}>{'Google로 시작하기'}</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginIcon: {
        height: responsive(150),
        width: responsive(150),
        marginBottom: responsive(5),
    },
    description: {
        fontFamily: 'pretend-bold',
        fontSize: responsive(20),
        color: '#A5A6A7',
        marginBottom: responsive(30),
    },
    buttonContainer: {
        paddingBottom: responsive(40),
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        width: responsive(300),
        padding: responsive(10),
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: responsive(10),
    },
    buttonImage: {
        width: responsive(20),
        height: responsive(20),
        marginLeft: responsive(5),
    },
    kakaoButton: {
        backgroundColor: '#FEE500',
    },
    appleButton: {
        backgroundColor: '#000',
    },
    googleButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    buttonTextBlack: {
        flex: 1,
        textAlign: 'center',
        fontSize: responsive(15),
        color: 'rgba(0, 0, 0, 0.85)',
    },
    buttonTextWhite: {
        flex: 1,
        textAlign: 'center',
        fontSize: responsive(15),
        color: '#fff',
    },
});
