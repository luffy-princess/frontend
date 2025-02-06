import Octicons from '@expo/vector-icons/Octicons';
import { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Markdown, { MarkdownIt } from "react-native-markdown-display";
import responsive from '../scripts/responsive';

function ViewTermScreen({ navigation, route }) {
    const { params } = route;
    const { termContent } = params;

    useEffect(() => {
        navigation.setOptions({ gestureEnabled: true });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.previousButton}>
                    <Octicons name="arrow-left" size={responsive(25)} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={{ height: '100%', fontFamily: 'pretend-bold' }}
            >
                <View style={styles.markdownContainer}>
                    <Markdown
                        style={markdownStyles}
                        markdownit={
                            MarkdownIt({ typographer: true }).disable(['link', 'image'])
                        }
                    >
                        {termContent}
                    </Markdown>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const markdownStyles = StyleSheet.create({
    heading2: {
        fontFamily: 'pretend-bold',
        fontSize: responsive(25),
        color: '#212020',
        marginBottom: responsive(10),
        lineHeight: responsive(40),
    },
    heading3: {
        fontFamily: 'pretend-bold',
        fontSize: responsive(20),
        color: '#404040',
        marginTop: responsive(10),
        marginBottom: responsive(5),
        lineHeight: responsive(30),
    },
    body: {
        fontFamily: 'pretend-thin',
        fontSize: responsive(16),
        lineHeight: responsive(24),
    },
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsive(20),
        paddingTop: responsive(20),
        paddingBottom: responsive(10),
        backgroundColor: '#fff',
    },
    markdownContainer: {
        marginBottom: responsive(80),
        padding: responsive(20)
    },
    previousButton: {
        width: responsive(35),
        padding: responsive(5),
    },
});

export default ViewTermScreen;