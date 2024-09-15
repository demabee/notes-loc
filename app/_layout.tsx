import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  return <Slot />;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <InitialLayout />
    </GestureHandlerRootView>
  );
}