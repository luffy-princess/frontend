// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Expo
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as SplashScreen from 'expo-splash-screen';

// React
import { useEffect, useState } from 'react';
import { setCustomText } from 'react-native-global-props';

// Components & Hooks
import { ModalProvider } from './components/modals/ModalProvider';
import useAPI from './hooks/useApi';
import { usePhishmeStore } from './store';

// Assets
import { images } from './scripts/images';

// Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoadingScreen from './screens/LoadingScreen';
import MainNavigator from './screens/MainNavigator';
import ViewTermScreen from './screens/ViewTermScreen';
import TrainScreen from './screens/TrainScreen';

// Initialize app settings
SplashScreen.preventAutoHideAsync();
ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

// Navigation setup
const Stack = createNativeStackNavigator();

// Custom hooks
const useAppFonts = () => {
  return useFonts({
    'pretend-regular': require('./assets/fonts/Pretendard-Regular.otf'),
    'pretend-medium': require('./assets/fonts/Pretendard-Medium.otf'),
    'pretend-bold': require('./assets/fonts/Pretendard-Bold.otf'),
    'pretend-light': require('./assets/fonts/Pretendard-Light.otf'),
  });
};

const useImagePreload = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageAssets = Object.values(images).map(image =>
          Asset.fromModule(image).downloadAsync()
        );
        await Promise.all(imageAssets);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Failed to load images:', error);
        setImagesLoaded(true); // Proceed despite errors
      }
    };

    loadImages();
  }, []);

  return imagesLoaded;
};

const useGlobalFontFamily = () => {
  useEffect(() => {
    const customTextProps = {
      style: {
        fontFamily: 'pretend-medium',
      },
    };
    setCustomText(customTextProps);
  }, []);
};

export default function App() {
  // State & Hooks
  const [initScreen, setInitScreen] = useState(null);
  const [fontLoaded, fontError] = useAppFonts();
  const imagesLoaded = useImagePreload();
  const { getMyInfo } = useAPI();
  const { setUserInfo } = usePhishmeStore();

  // Set global font
  useGlobalFontFamily();

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      if (!((fontLoaded || fontError) && imagesLoaded)) return;

      try {
        const response = await getMyInfo();

        if (response.ok) {
          const userData = await response.json();
          setUserInfo(userData);
          setInitScreen('Main');
        } else {
          setInitScreen('Login');
        }
      } catch (error) {
        setInitScreen('Login');
      } finally {
        SplashScreen.hideAsync();
      }
    };

    // Add slight delay for smoother launch
    const timer = setTimeout(initializeApp, 1500);
    return () => clearTimeout(timer);
  }, [fontLoaded, imagesLoaded]);

  // Show loading screen while initializing
  if (!fontLoaded || !imagesLoaded || initScreen === null) {
    return <LoadingScreen />;
  }

  // Main app structure
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
          <Stack.Screen name="Train" component={TrainScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ModalProvider>
  );
}
