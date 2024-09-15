import useAuth from '@/hooks/useAuth';
import { COLORS } from '@/styles/COLORS';
import { Icon } from '@rneui/themed';
import { Stack, useRouter } from 'expo-router';
import { Alert } from 'react-native';

export default function StackLayout() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert('Signout', 'Are you sure you want to signout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK', onPress: async () => {
          try {
            await signOut();
            router.push('/(public)');
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out.');
            console.error('Sign out error', error);
          }
        }
      },
    ]);
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerRight: () => (
          <Icon
            name="sign-out"
            type="font-awesome"
            size={24}
            color={COLORS.primaryOrange}
            style={{ marginRight: 15 }}
            onPress={handleSignOut}
          />
        ),
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Notes',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Note',
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: 'New note',
        }}
      />
    </Stack>
  )
};