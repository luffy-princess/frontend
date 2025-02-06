import { useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Swing } from "react-native-animated-spinkit";
import responsive from '../scripts/responsive';

export default function LoadingScreen({ navigation, route }) {
    useEffect(() => {
        async function doAction() {
            if (route?.params?.action && typeof (route?.params?.action) === 'function') {
                await route.params.action();
            }
        }

        doAction();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Swing size={responsive(60)} color="#1A9AF5" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});