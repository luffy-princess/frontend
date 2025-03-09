import { StyleSheet, Text, View } from "react-native";
import responsive from "../scripts/responsive";

export default function Badge({ backgroundColor, textColor, text, width = responsive(41) }) {
    return (
        <View style={[styles.container, { backgroundColor, width }]}>
            <Text style={[styles.text, { color: textColor }]}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: responsive(27),
        borderRadius: responsive(3),
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontFamily: 'pretend-bold',
        fontSize: responsive(13)
    }
});