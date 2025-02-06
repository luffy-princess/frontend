import { StyleSheet, Text, View } from "react-native";
import responsive from "../scripts/responsive";

export default function Badge({ backgroundColor, textColor, text }) {
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={[styles.text, { color: textColor }]}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: responsive(41),
        height: responsive(27),
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontFamily: 'pretend-bold',
        fontSize: responsive(13)
    }
});