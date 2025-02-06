import { StyleSheet, View, Text } from "react-native";
import * as Progress from 'react-native-progress';
import responsive from '../scripts/responsive';

const PROGRESS_BAR_WIDTH = 300;
const PROGRESS_BAR_HEIGHT = 10;

export default function TrainProgress({ stats }) {

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>교육진행현황</Text>
                <Text style={styles.progressText}>{
                    stats?.totalProgress ? `${stats.totalProgress * 100}%` : '0%'
                }</Text>
            </View>

            <View style={styles.progressBarContainer}>
                <Progress.Bar
                    progress={stats?.progressBarValue ?? 0}
                    width={PROGRESS_BAR_WIDTH}
                    height={PROGRESS_BAR_HEIGHT}
                    color='#1B9AF5'
                    unfilledColor='#DEDEDE'
                    borderWidth={0}
                />
            </View>

            <View style={styles.statsContainer}>
                <StatItem
                    label="완료한 훈련"
                    value={stats?.completedTraining ?? '없음'}
                />

                <StatItem
                    label="정확도"
                    value={stats?.accuracy ? `${stats.accuracy}%` : '없음'}
                />

                <StatItem
                    label="남은 훈련"
                    value={stats?.remainingTraining ?? '없음'}
                />
            </View>
        </View>
    );
}

const StatItem = ({ label, value }) => (
    <View style={styles.statItem}>
        <View style={styles.statTextContainer}>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
        <View style={styles.statTextContainer}>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        width: responsive(344),
        backgroundColor: '#fff',
        borderRadius: 7,
        padding: responsive(20),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsive(15),
    },
    title: {
        fontFamily: 'pretend-medium',
        fontSize: responsive(18),
        color: '#5e636d',
    },
    progressText: {
        fontFamily: 'pretend-medium',
        fontSize: responsive(12),
        color: '#78c3f9',
    },
    progressBarContainer: {
        alignItems: 'center',
        marginBottom: responsive(15),
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: responsive(10),
    },
    statItem: {
        alignItems: 'center',
    },
    statTextContainer: {
        height: 23,
        justifyContent: 'center'
    },
    statLabel: {
        fontSize: responsive(13),
        color: '#959ba3',
        marginBottom: responsive(5),
    },
    statValue: {
        fontFamily: 'pretend-medium',
        fontSize: responsive(18),
        color: '#4a4f5a',
    },
});