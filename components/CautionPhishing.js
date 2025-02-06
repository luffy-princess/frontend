import { StyleSheet, Text, View } from "react-native";
import responsive from "../scripts/responsive";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function CautionPhishing({ data }) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <FontAwesome6 size={responsive(20)} name={data.icon} color={data.iconColor} />
                <Text style={styles.title}>{data.title}</Text>
            </View>
            <Text style={styles.description}>{data.description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: responsive(344),
        backgroundColor: '#fff',
        borderRadius: 7,
        padding: responsive(20),
        gap: responsive(10)
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsive(10)
    },
    title: {
        fontFamily: 'pretend-bold',
        fontSize: responsive(15),
        color: '#666B75'
    },
    description: {
        fontFamily: 'pretend-bold',
        fontSize: responsive(14),
        color: '#969BA4',
        marginLeft: responsive(30)
    }
});