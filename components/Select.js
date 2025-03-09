//부모 요소들중 가장 하단에 있어서는 안됨
//드랍다운 요소에 터치가 안먹기 때문

import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import responsive from '../scripts/responsive';

const customTheme = require('../scripts/select-theme/custom-theme');

const Select = ({ label, placeholder, error, zIndex, ...props }) => {
    const [open, setOpen] = useState(false);

    DropDownPicker.addTheme('CustomTheme', customTheme);
    DropDownPicker.setTheme('CustomTheme');
    DropDownPicker.setListMode('SCROLLVIEW');

    return (
        <View style={styles.conatiner}>
            <Text style={styles.label}>{label}</Text>

            <View style={{
                position: 'relative',
                zIndex: open ? 9999 : -1
            }}>
                <DropDownPicker
                    open={open}
                    setOpen={setOpen}
                    placeholder={placeholder}
                    autoScroll={true}
                    placeholderStyle={{
                        fontFamily: 'pretend-regular',
                        color: 'rgba(0, 0, 0, 0.2)'
                    }}
                    style={{
                        borderColor: error ? 'red' : open ? 'black' : 'white', alignItems: 'center'
                    }}
                    {...props}
                />
            </View>

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
        height: responsive(55),
        backgroundColor: '#E8E7EA',
        flexDirection: 'row',
        paddingHorizontal: responsive(15),
        borderWidth: 1,
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

export default Select;
