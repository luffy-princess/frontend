import Octicons from '@expo/vector-icons/Octicons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Keyboard,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Input from '../components/Input';
import Select from '../components/Select';
import TermCheck from '../components/TermCheck';
import responsive from '../scripts/responsive';
import useAPI from '../hooks/useApi';

export default function RegisterScreen({ navigation, route }) {
    const { doRegister, doLogin, getRegistrationTerms } = useAPI();
    const scrollViewRef = useRef(null);
    const fieldRefs = useRef({});

    const { params } = route;
    const { idToken, authProvider, userEmail } = params;

    const [inputs, setInputs] = useState({
        email: userEmail ?? '',
        nickname: '',
        gender: '',
        birthdate: '',
    });
    const [terms, setTerms] = useState([]);
    const [termAgreement, setTermAgreement] = useState([]);
    const [errors, setErrors] = useState({});

    const handleInput = (text, input) => {
        if (/[^\w\sㄱ-힣()0-9 ]/g.test(text)) return;
        if (/\s/g.test(text)) return;
        setInputs(prev => ({ ...prev, [input]: text }));
    };

    const handleErrors = (errorMessage, input) => {
        setErrors(prev => ({ ...prev, [input]: errorMessage }));
    };

    const scrollToField = (fieldName) => {
        const position = fieldRefs.current[fieldName];
        if (scrollViewRef.current && position) {
            scrollViewRef.current.scrollTo({ y: position, animated: true });
        }
    };

    const validateDateOfBirth = (date) => {
        const regex = /^\d{8}$/;
        if (!regex.test(date)) return false;
        const formattedDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
        const parsedDate = new Date(formattedDate);
        if (parsedDate.toString() === 'Invalid Date') return false;
        const [year, month, day] = formattedDate.split('-');
        const dateCheck = new Date(year, month - 1, day);
        return dateCheck.getFullYear() === parseInt(year) &&
            dateCheck.getMonth() + 1 === parseInt(month) &&
            dateCheck.getDate() === parseInt(day);
    };

    const validateField = (value, fieldName) => {
        if (value === '') {
            handleErrors('필수 입력 항목입니다', fieldName);
            scrollToField(fieldName);
            return false;
        }

        if (fieldName === 'birthdate' && !validateDateOfBirth(value)) {
            handleErrors('올바른 생년월일을 입력해주세요', fieldName);
            scrollToField(fieldName);
            return false;
        }

        if (fieldName === 'term') {
            const hasUncheckedTerms = terms.some(term =>
                !termAgreement.find(obj => obj.termId === term.id)?.isChecked
            );
            if (hasUncheckedTerms) {
                handleErrors('필수 항목은 체크 해주셔야 합니다', fieldName);
                scrollToField(fieldName);
                return false;
            }
        }

        return true;
    };

    const handleRegister = async () => {
        setErrors({});
        const isValid = Object.entries(inputs).every(([key, value]) => validateField(value, key)) && validateField(termAgreement, 'term');

        if (!isValid) return;

        navigation.navigate('Loading', {
            action: async () => {
                const response = await doRegister({
                    idToken,
                    authProvider,
                    ...inputs,
                    termAgreement
                });
                if (!response) {
                    navigation.goBack();
                    modalOpen({
                        modalType: 'alert',
                        title: '오류',
                        description: '회원가입중 오류가 발생했습니다'
                    });
                    return;
                }

                const { registerResult, errors } = await response.json();
                if (!registerResult) {
                    handleRegistrationErrors(errors);
                    return;
                }

                const loginSuccessful = await attemptLogin();
                if (loginSuccessful) {
                    navigation.navigate('Main');
                } else {
                    navigation.navigate('Login');
                    modalOpen({
                        modalType: 'alert',
                        title: '오류',
                        description: '로그인중 오류가 발생했습니다'
                    });
                }
            }
        });
    };

    const handleRegistrationErrors = (errors) => {
        let isScrolled = false;

        const translatedErrors = Object.entries(errors).reduce((acc, [key, errorValue]) => {
            acc[key] = errorValue;

            if (errorValue && !isScrolled) {
                scrollToField(key);
                isScrolled = true;
            }

            return acc;
        }, {});

        navigation.goBack();
        setErrors(translatedErrors);
    };

    const attemptLogin = async () => {
        const response = await doLogin(idToken, authProvider);
        if (!response) {
            return false;
        }

        const { code, message } = await response.json();
        if (!response.ok) {
            const errorMessage = code === 'USER-004'
                ? '이미 등록된 이메일입니다'
                : message;

            modalOpen({
                modalType: 'alert',
                title: '오류',
                description: errorMessage
            });
            return false;
        }
        return true;
    };

    useEffect(() => {
        const getTerms = async () => {
            const response = await getRegistrationTerms();

            if (!response) {
                return;
            }

            if (!response.ok) {
                navigation.navigate('Login');
                modalOpen({
                    modalType: 'alert',
                    title: '오류',
                    description: '회원가입 정보 로딩중 오류가 발생했습니다'
                });
                return;
            }

            const { terms } = await response.json();
            setTerms(terms);
        };

        navigation.setOptions({ gestureEnabled: true });
        getTerms();
    }, []);

    const formFields = [
        {
            key: 'email',
            Component: Input,
            props: {
                label: '이메일',
                placeholder: '이게 보인다면 뭔가 잘못된거에요!...',
                value: inputs.email,
                error: errors.email,
                editable: false,
                onFocus: () => handleErrors(null, 'email'),
            }
        },
        {
            key: 'nickname',
            Component: Input,
            props: {
                label: '닉네임',
                placeholder: '자신을 표현할 닉네임을 지어주세요!',
                value: inputs.nickname,
                error: errors.nickname,
                onFocus: () => handleErrors(null, 'nickname'),
                onChangeText: (text) => handleInput(text, 'nickname'),
                maxLength: 6,
            }
        },
        {
            key: 'birthdate',
            Component: Input,
            props: {
                label: '생년월일',
                placeholder: "YYYYMMDD",
                value: inputs.birthdate,
                error: errors.birthdate,
                onFocus: () => handleErrors(null, 'birthdate'),
                onChangeText: (text) => handleInput(text, 'birthdate'),
                keyboardType: "numeric",
                maxLength: 8,
            }
        },
        {
            key: 'gender',
            Component: Select,
            props: {
                label: '성별',
                placeholder: '당신의 성별은 무엇인가요?',
                value: inputs.gender,
                error: errors.gender,
                items: [
                    { label: '남자', value: 'MEN' },
                    { label: '여자', value: 'WOMAN' },
                ],
                onOpen: () => handleErrors(null, 'gender'),
                onSelectItem: (item) => handleInput(item.value, 'gender'),
            }
        },
        {
            key: 'term',
            Component: TermCheck,
            props: {
                terms,
                termAgreement,
                setTermAgreement,
                error: errors.term,
                navigation,
                onFocus: () => handleErrors(null, 'term'),
            }
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View key={'registerScreen'} entering={FadeIn.duration(600)} style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.previousButton}>
                        <Octicons name="arrow-left" size={responsive(25)} color="black" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="always"
                >
                    <Pressable style={styles.pressableContainer} onPress={Keyboard.dismiss}>
                        <Animated.View style={styles.innerContainer} entering={FadeIn}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>{'환영합니다'}</Text>
                                <Text style={styles.description}>{'회원가입 후 체험을 진행하실 수 있어요!'}</Text>
                            </View>

                            <View style={styles.formContainer}>
                                {formFields.map(({ key, Component, props }, index) => (
                                    <View
                                        key={index}
                                        onLayout={(event) => {
                                            const layout = event.nativeEvent.layout;
                                            fieldRefs.current[key] = layout.y;
                                        }}
                                    >
                                        <Component {...props} />
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity
                                style={styles.registerButton}
                                activeOpacity={0.8}
                                onPress={handleRegister}
                            >
                                <Text style={styles.registerButtonText}>
                                    {'체험 시작하기'}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </Pressable>
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsive(20),
        paddingTop: responsive(20),
        paddingBottom: responsive(10),
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: responsive(20)
    },
    pressableContainer: {
        flex: 1,
        minHeight: '100%',
    },
    innerContainer: {
        flex: 1,
    },
    titleContainer: {
        marginVertical: responsive(20),
    },
    title: {
        fontFamily: 'pretend-bold',
        fontSize: responsive(40),
    },
    description: {
        fontSize: responsive(18),
        color: 'grey',
        marginTop: responsive(10),
    },
    formContainer: {
        marginVertical: responsive(10),
        gap: responsive(10),
    },
    registerButton: {
        padding: responsive(15),
        borderRadius: 8,
        height: responsive(47),
        backgroundColor: '#1A9AF5',
        marginTop: responsive(25)
    },
    registerButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: responsive(16),
        fontWeight: '600',
    },
    previousButton: {
        width: responsive(35),
        padding: responsive(5),
    },
});