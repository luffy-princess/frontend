import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import responsive from "../scripts/responsive";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Badge from "./Badge";

export default function ScenarioCard({ data }) {

    const getBadgeColor = (level) => {
        if (level === '초급') {
            return '#DCFCE7';
        } else if (level === '중급') {
            return '#FEF9C3';
        } else if (level === '고급') {
            return '#FEE2E2';
        }
    }

    const getBadgeTextColor = (level) => {
        if (level === '초급') {
            return '#77AF8B';
        } else if (level === '중급') {
            return '#BB9A5F';
        } else if (level === '고급') {
            return '#C77676';
        }
    }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.headerLeftContainer}>
                    <MaterialIcons name={data.icon} size={responsive(30)} color="#1A9AF5" />
                    <Text style={styles.title}>{data.title}</Text>
                </View>
                <View style={styles.headerRightContainer}>
                    <Badge backgroundColor={getBadgeColor(data.level)} textColor={getBadgeTextColor(data.level)} text={data.level} />
                </View>
            </View>
            <Text style={styles.description}>{data.description}</Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.startButton}>
                <Text style={styles.startButtonText}>시작하기</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: responsive(344),
        backgroundColor: '#fff',
        borderRadius: 7,
        padding: responsive(25),
        gap: responsive(15)
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsive(10)
    },
    title: {
        fontFamily: 'pretend-bold',
        fontSize: responsive(19)
    },
    description: {
        fontFamily: 'pretend-light',
        fontSize: responsive(14)
    },
    startButton: {
        height: responsive(35),
        padding: responsive(10),
        borderRadius: 8,
        backgroundColor: '#1A9AF5'
    },
    startButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: responsive(13),
        fontWeight: '600'
    }
});