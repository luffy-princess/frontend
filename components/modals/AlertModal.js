import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import responsive from "../../scripts/responsive";

function AlertModal({ title, description, action, visible, onClose }) {
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
                    <Text style={styles.description}>{description}</Text>
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
                            if (typeof action === "function") await action();
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
        fontSize: responsive(15),
        marginBottom: responsive(12),
        textAlign: 'center'
    },
    description: {
        fontSize: responsive(14),
        lineHeight: responsive(20),
        opacity: 0.7,
        textAlign: 'center'
    },
    card: {
        width: "80%",
        padding: responsive(20),
        backgroundColor: "white",
        borderRadius: responsive(10),
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

export default AlertModal;
