import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import useAPI from "../hooks/useApi";
import responsive from "../scripts/responsive";
import { usePhishmeStore } from "../store";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingScreen() {
    const { userInfo, setUserInfo } = usePhishmeStore();
    const { doLogout } = useAPI();
    const navigation = useNavigation();

    const InfoItem = ({ label, value }) => (
        <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value || '-'}</Text>
        </View>
    );

    const handleLogout = () => {
        doLogout();
        AsyncStorage.clear();
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>내 정보</Text>
                </View>
                <View style={styles.infoContainer}>
                    <InfoItem label="이메일" value={userInfo.email} />
                    <InfoItem label="닉네임" value={userInfo.nickname} />
                    <InfoItem label="성별" value={userInfo.gender === 'MEN' ? '남자' : '여자'} />
                    <InfoItem label="생년월일" value={userInfo.birthDate} />
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>로그아웃</Text>
                </TouchableOpacity>
            </ScrollView>
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
    header: {
        padding: responsive(23),
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5'
    },
    headerTitle: {
        fontFamily: 'pretend-medium',
        fontSize: responsive(20),
        color: '#000'
    },
    infoContainer: {
        padding: responsive(23),
        gap: responsive(20)
    },
    infoItem: {
        backgroundColor: '#F8F8F8',
        borderRadius: responsive(8),
        padding: responsive(15)
    },
    infoLabel: {
        fontFamily: 'pretend-medium',
        fontSize: responsive(14),
        color: '#666',
        marginBottom: responsive(5)
    },
    infoValue: {
        fontFamily: 'pretend-medium',
        fontSize: responsive(16),
        color: '#000'
    },
    logoutButton: {
        marginHorizontal: responsive(23),
        padding: responsive(15),
        backgroundColor: '#FF4444',
        borderRadius: responsive(8),
        alignItems: 'center'
    },
    logoutText: {
        fontFamily: 'pretend-medium',
        fontSize: responsive(16),
        color: '#fff'
    }
});
