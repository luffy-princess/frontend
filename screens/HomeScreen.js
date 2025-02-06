import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from 'react-native-reanimated';
import TrainProgress from "../components/TrainProgress";
import responsive from "../scripts/responsive";
import { useState } from "react";
import CautionPhishing from "../components/CautionPhishing";
import MiniScenarioCard from "../components/MiniScenarioCard";

export default function HomeScreen({ navigation }) {
    const [trainStats, setTrainStats] = useState({
        totalProgress: 0.85, // 85%
        completedTraining: 17,
        remainingTraining: 3,
        accuracy: 92,
        progressBarValue: 0.3,
    });
    const [currentPhishings, setCurrentPhishings] = useState([
        {
            icon: 'triangle-exclamation',
            iconColor: '#FAA400',
            title: '택배 배송 사칭 문자 주의',
            description: '최근 택배사를 사칭한 스미싱 문자가 증가하고 있습니다. 모바일 앱 설치 유도에 주의하세요.'
        },
        {
            icon: 'shield-halved',
            iconColor: '#1A9AF5',
            title: '금융기관 사칭 전화 증가',
            description: '금융기관을 사칭하여 개인정보와 계좌정보를 요구하는 사례가 급증하고 있습니다.'
        }
    ]);
    const [recommendedScenarios, setRecommendedScenarios] = useState([
        {
            id: 1,
            title: '이메일 피싱 대응',
            description: '기업 이메일을 통한 피싱 공격 대용 훈련'
        },
        {
            id: 2,
            title: '스미싱 식별',
            description: '악성 URL이 포함된SMS식별 훈련'
        },
        {
            id: 3,
            title: '보이스피싱 대처',
            description: '금융기관 사칭 전화 대용훈련'
        }
    ]);

    return (
        <Animated.View key={'homeScreen'} entering={FadeIn.duration(600)} style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.trainStatusContainer}>
                    <TrainProgress stats={trainStats} />
                    <TouchableOpacity activeOpacity={0.8} style={styles.startNewTrainButton}>
                        <Text style={styles.startNewTrainButtonText}>새로운 훈련 시작하기</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cautionCurrentPhishingContainer}>
                    <Text style={styles.cautionCurrentPhishingTitle}>최신 피싱 수법 알림</Text>
                    {
                        currentPhishings.map((currentPhishing, index) => {
                            return (
                                <CautionPhishing key={index} data={currentPhishing} />
                            );
                        })
                    }
                </View>
                <View style={styles.scenarioContainer}>
                    <Text style={styles.scenarioTitle}>추천 모의 훈련 시나리오</Text>
                    {
                        recommendedScenarios.map((recommendedScenario, index) => {
                            return (
                                <MiniScenarioCard key={index} data={recommendedScenario} />
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
        paddingTop: responsive(40)
    },
    trainStatusContainer: {
        padding: responsive(23),
        gap: responsive(20)
    },
    startNewTrainButton: {
        padding: responsive(15),
        borderRadius: 8,
        height: responsive(47),
        backgroundColor: '#1A9AF5'
    },
    startNewTrainButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: responsive(16),
        fontWeight: '600'
    },
    cautionCurrentPhishingContainer: {
        alignItems: 'center',
        gap: responsive(15)
    },
    cautionCurrentPhishingTitle: {
        fontFamily: 'pretend-medium',
        fontSize: responsive(17),
        alignSelf: 'flex-start',
        marginLeft: responsive(30)
    },
    scenarioContainer: {
        marginTop: responsive(20),
        marginBottom: responsive(30),
        alignItems: 'center',
        gap: responsive(15)
    },
    scenarioTitle: {
        fontFamily: 'pretend-medium',
        fontSize: responsive(17),
        alignSelf: 'flex-start',
        marginLeft: responsive(30)
    }
});