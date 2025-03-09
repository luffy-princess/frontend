import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import responsive from "../../scripts/responsive";

export default function TrainingResultModal({
    title,
    score,
    description,
    improvements,
    visible,
    onClose
}) {
    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            animationType="fade"
        >
            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.score}>점수: {score}점</Text>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.description}>{description}</Text>
                    </View>

                    {improvements && improvements.length > 0 && (
                        <View style={styles.tipsContainer}>
                            <Text style={styles.tipsTitle}>개선 사항:</Text>
                            {improvements.map((tip, index) => (
                                <Text key={index} style={styles.tipText}>
                                    • {tip}
                                </Text>
                            ))}
                        </View>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.button,
                            {
                                width: "100%",
                                marginTop: 24,
                                backgroundColor: "rgba(0,0,0,0.1)",
                            },
                        ]}
                        onPress={async () => {
                            if (typeof onClose === "function") onClose();
                        }}
                    >
                        <Text style={[styles.text, { color: "black" }]}>{'확인'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    title: {
        fontWeight: "600",
        fontSize: responsive(18),
        marginBottom: responsive(12),
        textAlign: 'center'
    },
    score: {
        fontSize: responsive(16),
        fontWeight: "500",
        marginBottom: responsive(16),
        textAlign: 'center',
        color: '#2AA0F5'
    },
    descriptionContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: responsive(8),
        padding: responsive(15),
        marginBottom: responsive(20),
        borderWidth: 1,
        borderColor: '#E0E0E0'
    },
    description: {
        fontSize: responsive(14),
        lineHeight: responsive(22),
        color: '#444',
        textAlign: 'center',
        fontFamily: 'pretend-medium'
    },
    tipsContainer: {
        width: '100%',
        backgroundColor: '#F8F8F8',
        padding: responsive(15),
        borderRadius: responsive(8)
    },
    tipsTitle: {
        fontSize: responsive(14),
        fontWeight: "600",
        marginBottom: responsive(8),
        color: '#333'
    },
    tipText: {
        fontSize: responsive(13),
        lineHeight: responsive(18),
        color: '#666',
        marginBottom: responsive(4)
    },
    card: {
        width: "85%",
        padding: responsive(20),
        backgroundColor: "white",
        borderRadius: responsive(12),
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    text: {
        fontWeight: "600",
        fontSize: responsive(14),
        color: "white",
    },
    button: {
        width: "90%",
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        height: responsive(44),
        borderRadius: responsive(8),
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
