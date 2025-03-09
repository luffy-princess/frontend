import { Image } from "expo-image";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { images } from "../scripts/images";
import responsive from "../scripts/responsive";

export default function ChatMessage({ type, message, textColor = '#fff', backgroundColor = '#2AA0F5', isMine = false }) {
    return (
        <View style={[styles.container, { backgroundColor, alignSelf: isMine ? 'flex-end' : 'flex-start' }]}>
            {
                type === 'text' &&
                <Text style={[styles.messageText, { color: textColor }]}>{message}</Text>
            }
            {
                type === 'img' &&
                <Image source={images[message]} style={{ width: 150, height: 150 }} />
            }
        </View>
    );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        maxWidth: windowWidth * 0.75,
        borderRadius: responsive(7),
        padding: responsive(10)
    },
    messageText: {
        fontFamily: 'pretend-medium',
        fontSize: responsive(15),
        flexWrap: 'wrap'
    }
});
