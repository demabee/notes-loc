import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Icon } from '@rneui/themed';

const PasswordInput = ({ value, onChangeText }: { value: string; onChangeText: (text: string) => void }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Input
        placeholder="Password"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        rightIcon={
          <TouchableOpacity
            onPress={() => setShowPassword(prevState => !prevState)}
          >
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              type='feather'
              size={24}
              color='gray'
            />
          </TouchableOpacity>
        }
        inputStyle={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  input: {
    fontSize: 16,
  },
});

export default PasswordInput;
