import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon, Card } from '@rneui/themed';

const Empty = ({ message }: { message?: string }) => {
  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <Icon
          name="info"
          type="material"
          color="#aaa"
          size={60}
          containerStyle={styles.icon}
        />
        <Card.Divider />
        <Text style={styles.message}>
          {message || 'No data available'}
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    color: '#888',
  },
});

export default Empty;
