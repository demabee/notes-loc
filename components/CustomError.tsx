import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '@/styles/COLORS';

interface CustomErrorProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomError: React.FC<CustomErrorProps> = ({
  message,
  type = 'error',
  containerStyle,
  textStyle
}) => {
  let backgroundColor: string;
  let textColor: string;
  let borderColor: string;

  switch (type) {
    case 'warning':
      backgroundColor = COLORS.lightOrange;
      textColor = COLORS.primaryBlack;
      borderColor = COLORS.primaryOrange;
      break;
    case 'info':
      backgroundColor = COLORS.lightBlue;
      textColor = COLORS.primaryBlack;
      borderColor = COLORS.primaryBlue;
      break;
    default:
      backgroundColor = COLORS.lightRed;
      borderColor = COLORS.primaryRed;
      textColor = COLORS.primaryBlack;
  }

  return (
    <View style={[styles.container, { backgroundColor, borderColor }, containerStyle]}>
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 2,
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  text: {
    fontSize: 14,
  },
});

export default CustomError;
