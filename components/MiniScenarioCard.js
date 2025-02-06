import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import responsive from "../scripts/responsive";

export default function MiniScenarioCard({ data }) {
    return (
        <View style={styles.card}>
            <View style={styles.leftContainer}>
                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.description}>{data.description}</Text>
            </View>
            <View style={styles.rightContiner}>
                <TouchableOpacity activeOpacity={0.8} style={styles.startButton}>
                    <Text style={styles.startButtonText}>시작하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: responsive(344),
        backgroundColor: '#fff',
        borderRadius: 7,
        padding: responsive(20),
        gap: responsive(10),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    leftContainer: {
        alignItems: 'flex-start',
        gap: responsive(5)
    },
    rightContiner: {
        alignItems: 'flex-end'
    },
    title: {
        fontFamily: 'pretend-bold',
        fontSize: responsive(14),
        color: '#666B75'
    },
    description: {
        fontFamily: 'pretend-bold',
        fontSize: responsive(14),
        color: '#969BA4'
    },
    startButton: {
        padding: responsive(10),
        borderRadius: 8,
        height: responsive(35),
        backgroundColor: '#1A9AF5'
    },
    startButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: responsive(13),
        fontWeight: '600'
    }
});