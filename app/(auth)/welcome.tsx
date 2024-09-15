import { useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/styles/COLORS'; // Ensure this path is correct
import { Button } from '@rneui/themed';
import { BUTTON_TITLE, BUTTONS } from '@/styles/BUTTONS';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Notes Location</Text>
      <Text style={styles.messageText}>We're glad to have you here. Please choose where you'd like to proceed:</Text>
      <View style={styles.buttonGroup}>
        <Button
          title="Go to List"
          onPress={() => router.push('/(auth)/(tabs)/list')}
          color={COLORS.primaryBlue}
          buttonStyle={BUTTONS.primary}
          titleStyle={BUTTON_TITLE.primary}
        />
        <Button
          title="Go to Maps"
          onPress={() => router.push('/(auth)/(tabs)/maps')}
          color={COLORS.primaryBlue}
          buttonStyle={BUTTONS.secondary}
          titleStyle={BUTTON_TITLE.primary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.primaryBlue,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.lightBlack,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10
  }
});
