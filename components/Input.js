import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import responsive from '../scripts/responsive';

const Input = ({ label, error, password, onFocus = () => { }, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const textInputRef = useRef();

    return (
        <View style={styles.conatiner}>
            <Text style={styles.label}>{label}</Text>

            <Pressable
                style={[styles.inputContainer, { borderColor: error ? 'red' : isFocused ? 'black' : 'white', alignItems: 'center' }]}
                onPress={() => textInputRef?.current?.focus()}
            >
                <TextInput
                    ref={textInputRef}
                    autoCorrect={false}
                    onFocus={() => {
                        onFocus();
                        setIsFocused(true);
                    }}
                    onBlur={() => setIsFocused(false)}
                    style={{ color: 'darkBlue', flex: 1, fontSize: responsive(14) }}
                    {...props}
                />
            </Pressable>

            {
                error && (
                    <Text style={styles.errorLabel}>
                        {error}
                    </Text>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    conatiner: {
        marginBottom: responsive(20)
    },
    label: {
        marginVertical: responsive(5),
        marginLeft: responsive(5),
        fontFamily: 'pretend-light',
        fontSize: responsive(14),
        color: 'grey'
    },
    inputContainer: {
        height: responsive(56),
        backgroundColor: '#E8E7EA',
        flexDirection: 'row',
        paddingHorizontal: responsive(15),
        borderWidth: responsive(1),
        borderRadius: responsive(7),
        alignItems: 'center'
    },
    errorLabel: {
        color: 'red',
        fontFamily: 'pretend-light',
        fontSize: responsive(12),
        marginTop: responsive(7),
        marginLeft: responsive(5),
    }
});

export default Input;