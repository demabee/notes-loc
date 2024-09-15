// app/auth/login.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, CheckBox, Input } from '@rneui/themed';
import useAuth from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/useAuthStore';
import { COLORS } from '@/styles/COLORS';
import { BUTTON_TITLE, BUTTONS } from '@/styles/BUTTONS';
import CustomError from '@/components/CustomError';
import PasswordInput from '@/components/PasswordInput';

export default function Login() {
  const router = useRouter();
  const { signIn, autoSignIn, loading, autoSigninloading } = useAuth();
  const user = useAuthStore((state) => state.user);
  const checkStoredCredentials = useAuthStore((state) => state.checkStoredCredentials);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await signIn(email, password, rememberMe);
      if (res.success) {
        return;
      }
      setError(res.message);
    } catch (error) {
      console.error('error', error);
      setError('Invalid credentials');
    }
  };

  useEffect(() => {
    if (user !== null) {
      router.replace('/(auth)/welcome');
      return;
    }
  }, [user]);

  useEffect(() => {
    checkStoredCredentials(autoSignIn);
  }, []);

  if (autoSigninloading) {
    return <ActivityIndicator />
  }

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
      <CheckBox
        checked={rememberMe}
        onPress={() => setRememberMe(!rememberMe)}
        title="Remember me"
        iconType="material-community"
        checkedIcon="checkbox-marked"
        uncheckedIcon="checkbox-blank-outline"
        checkedColor={COLORS.primaryOrange}
      />
      <View style={styles.buttonGroup}>
        <Button
          title="Login"
          onPress={handleLogin}
          loading={loading}
          buttonStyle={BUTTONS.primary}
          titleStyle={BUTTON_TITLE.primary}
        />
        <Button
          title="Signup"
          onPress={() => router.push('/(public)/signup')}
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
    padding: 20
  },
  buttonGroup: {
    gap: 10,
    marginTop: 15
  }
});
