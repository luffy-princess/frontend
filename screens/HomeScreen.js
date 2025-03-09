import { useCallback, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import useTrainingApi from "../hooks/useTrainingApi";
import useAPI from "../hooks/useApi";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from "react-native";
import CautionPhishing from "../components/CautionPhishing";
import MiniScenarioCard from "../components/MiniScenarioCard";
import TrainProgress from "../components/TrainProgress";
import CautionPhishingCarousel from "../components/CautionPhishingCarousel";
import responsive from "../scripts/responsive";

export default function HomeScreen({ navigation }) {
    const { getProgressSummary, getTrainings } = useTrainingApi();
    const { getCurrentPhishingAlerts } = useAPI();
    const [currentPhishings, setCurrentPhishings] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [trainStats, setTrainStats] = useState({
        totalProgress: 0,
        completedTraining: 0,
        remainingTraining: 0,
        accuracy: 0,
        progressBarValue: 0,
    });

    useFocusEffect(
        useCallback(() => {
            fetchProgressSummary();
            fetchPhishingAlerts();
            fetchTrainings();
        }, [])
    );

    const fetchTrainings = async () => {
        setLoading(true);
        try {
            const { ok, data, error } = await getTrainings();
            if (!ok) {
                console.log(error);
                return;
            }

            // 모든 시나리오를 하나의 배열로 모음
            const allScenarios = data.map(training => { return { id: training.id, ...JSON.parse(training.trainingData) } }).reduce((acc, training) => {
                const scenarios = training.scenarios || [];
                return [...acc, ...scenarios.map(scenario => ({
                    ...scenario,
                    trainingId: training.id,
                    trainingData: training
                }))];
            }, []);

            // 시나리오를 랜덤하게 섞고 3개 선택
            const shuffledScenarios = [...allScenarios].sort(() => Math.random() - 0.5);
            const selectedScenarios = shuffledScenarios.slice(0, 3).map(scenario => ({
                id: scenario.trainingId,
                title: scenario.name,
                description: scenario.descriptionShort,
                trainingData: scenario.trainingData
            }));

            setRecommendedScenarios(selectedScenarios);
        } catch (error) {
            console.log('Failed to fetch trainings:', error);
        } finally {
            //setLoading(false);
        }
    };

    const fetchProgressSummary = async () => {
        try {
            const { ok, data, error } = await getProgressSummary();
            if (!ok) {
                console.log(error);
                return;
            }
            setTrainStats({
                totalProgress: data.totalProgress,
                completedTraining: data.completedTraining,
                remainingTraining: data.remainingTraining,
                accuracy: data.accuracy,
                progressBarValue: data.totalProgress,
            });
        } catch (error) {
            console.log('Failed to fetch progress summary:', error);
        }
    };

    const fetchPhishingAlerts = async () => {
        try {
            const response = await getCurrentPhishingAlerts();
            if (response.ok) {
                const data = await response.json();
                setCurrentPhishings(data);
            } else {
                console.log('Failed to fetch phishing alerts');
            }
        } catch (error) {
            console.log('Error fetching phishing alerts:', error);
        }
    };

    const [recommendedScenarios, setRecommendedScenarios] = useState([]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={async () => {
                            setRefreshing(true);
                            await fetchProgressSummary();
                            await fetchPhishingAlerts();
                            setRefreshing(false);
                        }}
                    />
                }
            >
                <View style={styles.trainStatusContainer}>
                    <TrainProgress stats={trainStats} />
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.startNewTrainButton}
                        onPress={() => navigation.navigate('TrainList')}
                    >
                        <Text style={styles.startNewTrainButtonText}>새로운 훈련 시작하기</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cautionCurrentPhishingContainer}>
                    <View style={styles.carouselWrapper}>
                        {
                            currentPhishings ?
                                <>
                                    <Text style={styles.cautionCurrentPhishingTitle}>최신 피싱 수법 알림</Text>
                                    <CautionPhishingCarousel
                                        data={currentPhishings}
                                        renderItem={({ item }) => <CautionPhishing data={item} />}
                                    />
                                </>
                                :
                                <View style={styles.noCurrentPhishingsContainer}>
                                    <Text style={styles.noCurrentPhishingsText}>알림이 없습니다</Text>
                                </View>
                        }
                    </View>
                </View>
                <View style={styles.scenarioContainer}>
                    <Text style={styles.scenarioTitle}>추천 모의 훈련 시나리오</Text>
                    {
                        recommendedScenarios.map((recommendedScenario, index) => {
                            return (
                                <MiniScenarioCard
                                    key={index}
                                    data={recommendedScenario}
                                    navigation={navigation}
                                />
                            );
                        })
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    noCurrentPhishingsContainer: {
        width: responsive(344),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: responsive(7),
        padding: responsive(20),
        alignSelf: 'center'
    },
    noCurrentPhishingsText: {
        fontFamily: 'pretend-medium',
        fontSize: responsive(15)
    },
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    trainStatusContainer: {
        padding: responsive(23),
        gap: responsive(20)
    },
    startNewTrainButton: {
        padding: responsive(15),
        borderRadius: responsive(8),
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
        gap: responsive(12),
        width: '100%'
    },
    cautionCurrentPhishingTitle: {
        fontFamily: 'pretend-medium',
        fontSize: responsive(17),
        alignSelf: 'flex-start',
        marginLeft: responsive(25)
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
        marginLeft: responsive(25)
    },
    carouselWrapper: {
        width: '100%'
    },
    skeletonCarousel: {
        alignItems: 'center',
        paddingHorizontal: responsive(23)
    },
    skeletonScenario: {
        alignItems: 'center',
        paddingHorizontal: responsive(23)
    }
});
