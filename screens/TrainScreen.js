import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import responsive from "../scripts/responsive";
import ChatMessage from "../components/ChatMessage";
import { useCallback, useEffect, useRef, useState } from "react";
import { useModalDispatch } from "../components/modals/ModalProvider";
import Animated, {
    FadeIn,
    FadeOut,
    Layout,
    runOnJS
} from "react-native-reanimated";
import Ionicons from '@expo/vector-icons/Ionicons';
import useTrainingApi from "../hooks/useTrainingApi";

const SCENARIO_SELECTION = 'scenario_selection';
const TRAINING_ON_PROGRESS = 'training_on_progress';

const MESSAGE_DELAYS = {
    INITIAL: 4500,
    NARRATION: 800,
    RESPONSE: 600,
    BETWEEN: 600
};

export default function TrainScreen({ navigation, route }) {
    // State Management
    const [mode, setMode] = useState(SCENARIO_SELECTION);
    const [score, setScore] = useState(100);
    const [currentScreen, setCurrentScreen] = useState(null);
    const [chatList, setChatList] = useState([]);
    const [selectionList, setSelectionList] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const scrollViewRef = useRef(null);
    const currentScenarioRef = useRef(null);

    // Route Validation
    if (!route.params?.trainingId || !route.params?.trainingData) {
        navigation.goBack();
        return null;
    }

    const { trainingId, trainingName, trainingData } = route.params;
    const { saveTrainingProgress, checkTrainingCompletion } = useTrainingApi();
    const { modalOpen } = useModalDispatch();

    // Message Handling Functions
    const addMessage = (type, message, isMine = false, isNarration = false) => {
        setChatList(oldArray => [...oldArray, { type, message, isMine, isNarration }]);
    };

    const addMessagesWithDelay = async (messages) => {
        for (const msg of messages) {
            await new Promise(resolve => setTimeout(resolve, MESSAGE_DELAYS.BETWEEN));
            addMessage(msg.type, msg.content, false, msg.narration);
        }
    };

    // Selection Handling Functions
    const disableSelections = async () => {
        const oldSelections = [...selectionList];
        setSelectionList(oldSelections.map(sel => ({ ...sel, disabled: true })));
        await new Promise(resolve => setTimeout(resolve, 300));
        setSelectionList([]);
    };

    const updateScore = useCallback((scoreChange, currentScenario) => {
        setScore(prevScore => Math.max(0, Math.min(100, prevScore + scoreChange)));
    }, []);

    const saveScore = useCallback(async (currentScenario, finalScore) => {
        try {
            await saveTrainingProgress(trainingId, currentScenario.scenarioId, finalScore);
        } catch (error) {
            console.log('Failed to save progress:', error);
        }
    }, [trainingId, saveTrainingProgress]);

    // Navigation Functions
    const navigateToScenarioSelection = () => {
        setChatList([]);
        setMode(SCENARIO_SELECTION);
        setCurrentScreen(null);
        currentScenarioRef.current = null;
        checkCompletion();

        const selectionsData = trainingData.scenarios.map(scenario => ({
            text: scenario.name,
            action: () => startScenario(scenario, true),
        }));
        setSelectionList(selectionsData);
    };

    const handleScreenNavigation = async (selection, currentScenario, nextScreen, parentScreen) => {
        if (!nextScreen) return;

        // Clear chat if navigating from start screen
        if (parentScreen?.screenId === 'start') {
            setChatList([]);
        }

        setCurrentScreen(nextScreen);

        // Handle messages
        if (nextScreen.chatMessges) {
            await addMessagesWithDelay(nextScreen.chatMessges);
        }

        // Set up new selections or auto-navigate if no selections
        if (nextScreen.selections) {
            const selections = nextScreen.selections.map(sel => ({
                text: sel.text,
                action: () => handleSelection(sel, currentScenario)
            }));
            setSelectionList(selections);
        } else {
            // Find next screen in sequence
            const currentIndex = currentScenario.screens.findIndex(screen => screen.screenId === nextScreen.screenId);
            if (currentIndex < currentScenario.screens.length - 1) {
                const autoNextScreen = currentScenario.screens[currentIndex + 1];
                setTimeout(() => {
                    handleScreenNavigation(selection, currentScenario, autoNextScreen, nextScreen);
                }, 1000);
            }
        }
    };

    const handleTrainingEnd = useCallback(async (selection, currentScenario) => {
        const result = selection.target === 'training_success' ?
            currentScenario.training_success : currentScenario.training_failed;

        if (!result) return;

        setChatList([]);

        // Get current score value
        const finalScore = score;

        // Save score first
        await saveScore(currentScenario, finalScore);

        // Show modal with current score
        modalOpen({
            modalType: 'training_result',
            title: result.title,
            description: result.description,
            score: finalScore,
            improvements: currentScenario.success_tips,
        });

        setSelectionList([
            {
                text: "다른 시나리오 선택하기",
                action: navigateToScenarioSelection
            },
            {
                text: "다시 도전하기",
                action: () => startScenario(currentScenario, false)
            }
        ]);
    }, [score, saveScore, modalOpen]);

    const handleSelection = async (selection, currentScenario) => {
        if (!currentScenario || isProcessing) return;

        setIsProcessing(true);
        try {
            await disableSelections();
            addMessage('text', selection.text, true);
            await new Promise(resolve => setTimeout(resolve, MESSAGE_DELAYS.RESPONSE));

            if (selection.score_change) {
                updateScore(selection.score_change, currentScenario);
            }

            if (selection.action === 'navigate' && currentScenario.screens) {
                if (selection.target === 'scenario_selection') {
                    navigateToScenarioSelection();
                    return;
                }

                const nextScreen = currentScenario.screens.find(screen => screen.screenId === selection.target);
                const parentScreen = currentScenario.screens.find(screen =>
                    screen.selections?.some(sel => sel.target === selection.target)
                );

                await handleScreenNavigation(selection, currentScenario, nextScreen, parentScreen);
            } else if (selection.action === 'training_end') {
                await handleTrainingEnd(selection, currentScenario);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const startScenario = async (selectedScenario, resetScore = true) => {
        if (isProcessing) return;

        setIsProcessing(true);
        try {
            setMode(TRAINING_ON_PROGRESS);
            setCurrentScreen(selectedScenario.screens[0]);
            currentScenarioRef.current = selectedScenario;
            if (resetScore) {
                setScore(100);
            }
            setChatList([]);

            if (selectedScenario.screens[0].chatMessges) {
                await addMessagesWithDelay(selectedScenario.screens[0].chatMessges);
            }

            const selections = selectedScenario.screens[0].selections.map(selection => ({
                text: selection.text,
                action: () => handleSelection(selection, selectedScenario)
            }));
            setSelectionList(selections);
        } finally {
            setIsProcessing(false);
        }
    };

    // Completion Check
    const checkCompletion = async () => {
        try {
            const { ok, data } = await checkTrainingCompletion(trainingId);
            if (ok && data.completed) {
                addMessage('text', `이미 모든 시나리오를 완료한 훈련입니다.\n(평균 정확도: ${data.accuracy}%)`, false, true);
            } else {
                addMessage('text', "진행할 훈련 시나리오를 선택해주세요.", false, true);
            }
        } catch (error) {
            console.log('Failed to check training completion:', error);
            addMessage('text', "진행할 훈련 시나리오를 선택해주세요.", false, true);
        }
    };

    // Effects
    useEffect(() => {
        checkCompletion();
    }, []);

    useEffect(() => {
        if (mode === SCENARIO_SELECTION) {
            const selectionsData = trainingData.scenarios.map((scenario) => ({
                text: scenario.name,
                action: () => startScenario(scenario, true)
            }));
            setSelectionList(selectionsData);
        }
    }, [mode]);

    // Scroll Handling
    const scrollToEnd = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const scrollViewSizeChanged = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    // Render Functions
    const renderChatMessages = () => {
        return chatList.map((data, index) => (
            <Animated.View
                key={index}
                entering={FadeIn.duration(200).withCallback((finished) => {
                    if (finished) {
                        runOnJS(scrollToEnd)();
                    }
                })}
                style={[
                    styles.chatRow,
                    data.isMine ? styles.myChatRow : styles.otherChatRow
                ]}
            >
                <ChatMessage
                    type={data.type}
                    message={data.message}
                    isMine={data.isMine}
                    backgroundColor={data.isNarration ? '#FFE4B5' : (data.isMine ? '#DEDEDE' : '#2AA0F5')}
                    textColor={data.isNarration ? '#8B4513' : (data.isMine ? '#79808B' : '#fff')}
                />
            </Animated.View>
        ));
    };

    const renderSelections = () => {
        return selectionList.map((data, index) => (
            <Animated.View
                key={`${data.text}-${index}`}
                entering={FadeIn.duration(300).delay(index * 100)}
                exiting={FadeOut.duration(300)}
                layout={Layout.springify()}
            >
                <TouchableOpacity
                    onPress={data.action}
                    style={[
                        styles.selection,
                        isProcessing && styles.selectionDisabled
                    ]}
                    activeOpacity={0.8}
                    disabled={isProcessing}
                >
                    <Text
                        style={[
                            styles.selectionText,
                            isProcessing && styles.selectionTextDisabled
                        ]}
                    >
                        {data.text}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        ));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    disabled={isProcessing}
                >
                    <Ionicons name="arrow-back" size={24} color={isProcessing ? "#999" : "black"} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerText}>{trainingName}</Text>
                </View>
            </View>
            <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={scrollViewSizeChanged}
                style={styles.chatContainer}
                showsVerticalScrollIndicator={false}
            >
                {renderChatMessages()}
            </ScrollView>
            <View style={styles.selectionContainer}>
                {renderSelections()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff'
    },
    headerContainer: {
        height: responsive(40),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    backButton: {
        position: 'absolute',
        left: responsive(15),
        paddingBottom: responsive(10)
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: responsive(10)
    },
    headerText: {
        fontSize: responsive(17),
        fontFamily: 'pretend-medium'
    },
    chatContainer: {
        flex: 1,
        backgroundColor: '#f6f6f6',
        paddingTop: responsive(10)
    },
    chatRow: {
        width: '100%',
        paddingVertical: responsive(5),
        paddingHorizontal: responsive(15)
    },
    myChatRow: {
        alignItems: 'flex-end'
    },
    otherChatRow: {
        alignItems: 'flex-start'
    },
    selectionContainer: {
        backgroundColor: '#fff',
        minHeight: responsive(150),
        maxHeight: responsive(250),
        padding: responsive(20),
        gap: responsive(10),
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0'
    },
    selection: {
        height: responsive(45),
        backgroundColor: '#DEDEDE',
        borderRadius: responsive(7),
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectionDisabled: {
        opacity: 0.5
    },
    selectionText: {
        fontFamily: 'pretend-bold',
        color: '#79808B'
    },
    selectionTextDisabled: {
        color: '#A0A0A0'
    }
});
