import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import responsive from "../scripts/responsive";
import { useState } from "react";
import ScenarioCard from "../components/ScenarioCard";

export default function TrainListScreen() {
    const [trainDataList, setTrainDataList] = useState([
        {
            id: 1,
            icon: 'email',
            level: '초급',
            title: '이메일 피싱',
            description: '이메일을 통한 피싱 사기 수법을 학습하고 대응 방법을 훈련합니다.가짜 은행 이메일.결제 확인 등 다양한 시나리오를 체험해볼 수있습니다.'
        },
        {
            id: 2,
            icon: 'call',
            level: '중급',
            title: '보이스 피싱',
            description: '전화를통한 피싱 사기 수법과 대처 방법을 학습합니다.금융기관, 수사기관 사칭 등 실제 상황과 유사한시나리오로구성되어 있습니다.'
        },
        {
            id: 3,
            icon: 'comment',
            level: '초급',
            title: '스미싱',
            description: '문자메시지를통한 피싱 사기수법을 학습합니다. 택배, 결제 알림 등을 가장한 악성 링크 대응 방법을 훈련합니다.'
        },
        {
            id: 4,
            icon: 'qr-code',
            level: '고급',
            title: '큐싱',
            description: 'QR코드를 이용한 최신 피싱 사기 수법을 학습합니다.위조된 QR코드 식별법과 안전한 QR코드 스캔방법을 훈련합니다'
        }
    ]);

    return (
        <Animated.View key={'homeScreen'} entering={FadeIn.duration(600)} style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ gap: responsive(15), marginBottom: responsive(30) }}>
                    {
                        trainDataList.map((trainData, index) => {
                            return (
                                <ScenarioCard key={index} data={trainData} />
                            );
                        })
                    }
                </View>
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        paddingTop: responsive(63),
        alignItems: 'center'
    }
});