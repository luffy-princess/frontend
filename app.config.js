import { ExpoConfig, ConfigContext } from '@expo/config'
import * as dotenv from 'dotenv';

dotenv.config();

// 환경변수가 없을 경우 에러를 발생시키는 함수
const requireEnv = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

export default ({ config }) => ({
    ...config,
    plugins: [
        "expo-font",
        "expo-asset",
        "expo-localization",
        "expo-build-properties",
        "expo-apple-authentication",
        [
            "@react-native-seoul/kakao-login",
            {
                kakaoAppKey: requireEnv('KAKAO_APP_KEY'),
                kotlinVersion: "1.9.0"
            }
        ],
        [
            "@react-native-google-signin/google-signin",
            {
                iosUrlScheme: requireEnv('IOS_URL_SCHEME')
            }
        ],
        [
            "expo-build-properties",
            {
                android: {
                    extraMavenRepos: [
                        "https://devrepo.kakao.com/nexus/content/groups/public/"
                    ]
                }
            }
        ]
    ],
    extra: {
        eas: {
            projectId: requireEnv('EAS_PROJECT_ID')
        }
    }
});
