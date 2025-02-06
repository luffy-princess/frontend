import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { setCustomText } from 'react-native-global-props';
import { ModalProvider } from './components/modals/ModalProvider';
import useAPI from './hooks/useApi';
import { usePhishmeStore } from './store';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoadingScreen from './screens/LoadingScreen';
import MainNavigator from './screens/MainNavigator';
import ViewTermScreen from './screens/ViewTermScreen';

SplashScreen.preventAutoHideAsync();
ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
const Stack = createNativeStackNavigator();

export default function App() {
  const { getMyInfo } = useAPI();
  const { setUserInfo } = usePhishmeStore();

  const [initScreen, setInitScreen] = useState(null);
  const [fontLoaded, fontError] = useFonts({
    'pretend-regular': require('./assets/fonts/Pretendard-Regular.otf'),
    'pretend-medium': require('./assets/fonts/Pretendard-Medium.otf'),
    'pretend-bold': require('./assets/fonts/Pretendard-Bold.otf'),
    'pretend-light': require('./assets/fonts/Pretendard-Light.otf'),
  });

  useEffect(() => {
    const setGlobalFontFamily = () => {
      const customTextProps = {
        style: {
          fontFamily: 'pretend-medium',
        },
      };

      setCustomText(customTextProps);
    }

    setGlobalFontFamily();
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      if (fontLoaded || fontError) {
        try {
          const response = await getMyInfo();
          if (response.ok) {
            const responseData = await response.json();

            setUserInfo(responseData);
            setInitScreen('Main');
          } else {
            setInitScreen('Login');
          }
        } catch (error) {
          setInitScreen('Login');
        } finally {
          SplashScreen.hideAsync();
        }
      }
    }

    setTimeout(() => {
      initializeApp();
    }, 1500)
  }, [fontLoaded]);

  if (!fontLoaded || initScreen === null) {
    return <LoadingScreen />;
  }

  return (
    <ModalProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: false
          }}
          initialRouteName={initScreen}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="ViewTerm" component={ViewTermScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ModalProvider>
  );
}