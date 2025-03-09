import { StyleSheet, Text, View } from "react-native";
import responsive from "../scripts/responsive";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function CautionPhishing({ data }) {
    return (
        <View style={styles.card}>
            <FontAwesome6 size={responsive(24)} name={data.icon} color={data.iconColor} />
            <View style={styles.content}>
                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.description}>{data.description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: responsive(7),
        padding: responsive(20),
        flexDirection: 'row',
        gap: responsive(15),
        alignItems: 'flex-start'
    },
    content: {
        flex: 1,
        gap: responsive(6)
    },
    title: {
        fontFamily: 'pretend-bold',
        fontSize: responsive(15),
        color: '#666B75',
    },
    description: {
        fontFamily: 'pretend-regular',
        fontSize: responsive(14),
        color: '#969BA4',
        lineHeight: responsive(20)
    }
});
