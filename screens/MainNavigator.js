import Entypo from '@expo/vector-icons/Entypo';

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from 'react-native';
import responsive from "../scripts/responsive";
import HomeScreen from "./HomeScreen";
import TrainListScreen from "./TrainListScreen";

const BottomTab = createBottomTabNavigator();

export default function MainNavigator() {
    return (
        <BottomTab.Navigator
            screenOptions={{
                tabBarActiveTintColor: "#1B9AF5",
                tabBarInactiveTintColor: "#404551",
                style: {
                    height: responsive(55),
                    borderTopWidth: responsive(0.5),
                    borderTopColor: "#E9E9E9",
                    backgroundColor: "#FFFFFF",
                },
                tabBarIconStyle: {
                    marginTop: responsive(2)
                },
                tabBarLabelStyle: {
                    fontFamily: "pretend-medium",
                    fontSize: responsive(11),
                },
                headerShown: false
            }}
        >
            <BottomTab.Screen
                name='Home'
                component={HomeScreen}
                options={{
                    tabBarLabel: '홈',
                    tabBarIcon: ({ focused }) => (
                        <Entypo name="home" size={responsive(20)} color={focused ? "#1B9AF5" : "#404551"} />
                    )
                }}
            />
            <BottomTab.Screen
                name='TrainList'
                component={TrainListScreen}
                options={{
                    tabBarLabel: '훈련목록',
                    tabBarIcon: ({ focused }) => (
                        <Entypo name="list" size={responsive(20)} color={focused ? "#1B9AF5" : "#404551"} />
                    )
                }}
            />
        </BottomTab.Navigator>
    );
}