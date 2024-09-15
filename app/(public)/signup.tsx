// app/auth/signup.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Input } from '@rneui/themed';
import useAuth from '@/hooks/useAuth';
import { BUTTON_TITLE, BUTTONS } from '@/styles/BUTTONS';
import PasswordInput from '@/components/PasswordInput';
import CustomError from '@/components/CustomError';

export default function Signup() {
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const res = await signUp(email, password);
      console.log('res', res);
      if (res.success) {
        router.push('/(public)');
        return;
      }
      setError(res.message);
    } catch (error) {
      setError('Error creating account');
    }
  };

  return (
    <View style={styles.container}>
      {error ? <CustomError message={error} type="error" /> : null}
      <Input
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <PasswordInput value={password} onChangeText={setPassword} />
      <View style={styles.buttonGroup}>
        <Button
          title="Signup"
          onPress={handleSignup}
          buttonStyle={BUTTONS.secondary}
          titleStyle={BUTTON_TITLE.primary}
          loading={loading}
        />
        <Button
          title="Cancel"
          buttonStyle={BUTTONS.dark}
          titleStyle={BUTTON_TITLE.primary}
          onPress={() => router.push('/(public)')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  buttonGroup: {
    gap: 10
  }
})
