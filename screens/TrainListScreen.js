import { useState, useEffect, useCallback } from "react";
import useTrainingApi from "../hooks/useTrainingApi";
import { SafeAreaView, ScrollView, StyleSheet, View, RefreshControl, Dimensions } from "react-native";
import { FadeIn } from "react-native-reanimated";
import ScenarioCard from "../components/ScenarioCard";
import responsive from "../scripts/responsive";
import { useFocusEffect } from "@react-navigation/native";

export default function TrainListScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [trainDataList, setTrainDataList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getTrainings } = useTrainingApi();

    useFocusEffect(
        useCallback(() => {
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
            const trainings = data.map(training => {
                const trainingData = JSON.parse(training.trainingData);
                return {
                    id: training.id,
                    icon: trainingData.trainIcon,
                    level: trainingData.difficulty || '초급',
                    title: training.name,
                    description: trainingData.trainDescription,
                    trainingData: trainingData
                };
            });
            setTrainDataList(trainings);
        } catch (error) {
            console.log('Failed to fetch trainings:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView key={'homeScreen'} entering={FadeIn.duration(600)} style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={async () => {
                            setRefreshing(true);
                            await fetchTrainings();
                            setRefreshing(false);
                        }}
                    />
                }
            >
                <View style={styles.listContainer}>
                    {
                        trainDataList.map(async (trainData, index) => {
                            return (
                                <ScenarioCard
                                    key={index}
                                    data={trainData}
                                    isComplete={trainData.isComplete}
                                    trainingId={trainData.id}
                                    trainingData={trainData.trainingData}
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
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    listContainer: {
        gap: responsive(15),
        marginTop: responsive(23),
        marginBottom: responsive(30)
    },
    skeletonCard: {
        alignItems: 'center',
        paddingHorizontal: responsive(23)
    }
});
