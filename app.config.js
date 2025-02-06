import { ExpoConfig, ConfigContext } from '@expo/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default ({ config }) => ({
    ...config,
    plugins: [
        "expo-font",
        "expo-localization",
        "expo-build-properties",
        "expo-apple-authentication",
        [
            "@react-native-seoul/kakao-login",
            {
                kakaoAppKey: process.env.KAKAO_APP_KEY,
                kotlinVersion: "1.9.0"
            }
        ],
        [
            "@react-native-google-signin/google-signin",
            {
                iosUrlScheme: process.env.IOS_URL_SCHEME
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
            projectId: "43bc9d91-05e3-42f2-8169-3e316143dece"
        }
    }
});