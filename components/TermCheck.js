import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import responsive from '../scripts/responsive';

function TermCheck({ terms, termAgreement, setTermAgreement, navigation, error, onFocus = () => { } }) {
    const [checkAll, setCheckAll] = useState(false);

    const updateCheckAllState = (updatedAgreements) => {
        const allChecked = updatedAgreements.every((term) => term.isChecked);
        setCheckAll(allChecked);
    };

    const handleCheckAll = () => {
        const updatedAgreements = terms.map((term) => ({
            termId: term.id,
            agreedVersion: term.version,
            isChecked: !checkAll,
        }));

        onFocus();
        setTermAgreement(updatedAgreements);
        setCheckAll(!checkAll);
    };

    const handleChecked = (termId, termVersion, isChecked) => {
        const updatedAgreements = termAgreement.map((agreement) =>
            agreement.termId === termId
                ? { ...agreement, isChecked }
                : agreement
        );

        onFocus();
        updateCheckAllState(updatedAgreements);
        setTermAgreement(updatedAgreements);
    };

    const getTermById = (termId) => terms.find((term) => term.id === termId);

    const handleViewTerm = (termId) => {
        const termContent = getTermById(termId)?.content;
        if (termContent) {
            navigation.navigate('ViewTerm', { termContent });
        }
    };

    const CheckBox = ({ term }) => (
        <View style={styles.section}>
            <BouncyCheckbox
                size={responsive(25)}
                iconImageStyle={styles.iconImageStyle}
                style={styles.checkbox}
                fillColor="#1A9AF5"
                innerIconStyle={{
                    borderRadius: 7
                }}
                iconStyle={{
                    borderRadius: 7
                }}
                isChecked={termAgreement.some((a) => a.termId === term.id && a.isChecked)}
                onPress={(isChecked) => handleChecked(term.id, term.version, isChecked)}
                textComponent={<Text style={styles.checkBoxText}>{`${term.title} ${term.required ? '(필수)' : ''}`}</Text>}
            />
            <TouchableOpacity onPress={() => handleViewTerm(term.id)}>
                <MaterialIcons name="arrow-forward-ios" size={responsive(23)} color="lightgrey" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <BouncyCheckbox
                    size={responsive(25)}
                    iconImageStyle={styles.iconImageStyle}
                    style={styles.checkbox}
                    fillColor="#1A9AF5"
                    innerIconStyle={{
                        borderRadius: 7
                    }}
                    iconStyle={{
                        borderRadius: 7
                    }}
                    isChecked={checkAll}
                    onPress={handleCheckAll}
                    textComponent={<Text style={styles.checkBoxText}>약관 전체 동의</Text>}
                />
            </View>

            <View style={styles.divider} />

            {terms.map((term) => (
                <CheckBox key={term.id} term={term} />
            ))}

            {error && <Text style={styles.errorLabel}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    checkbox: {
        margin: responsive(8)
    },
    checkBoxText: {
        marginLeft: responsive(10),
        fontSize: responsive(16),
        color: "#757575",
    },
    errorLabel: {
        color: 'red',
        fontSize: responsive(12),
        marginTop: responsive(10),
        marginLeft: responsive(9),
    },
    iconImageStyle: {
        width: responsive(11),
        height: responsive(11),
    },
    divider: {
        width: '95%',
        alignSelf: 'center',
        marginVertical: responsive(10),
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});

export default TermCheck;
