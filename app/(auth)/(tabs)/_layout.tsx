import { COLORS } from '@/styles/COLORS';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FAB } from '@rneui/themed';
import { Tabs, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function TabLayout() {
  const router = useRouter();
  return (
    <>
      <Tabs screenOptions={{
        tabBarActiveTintColor: COLORS.lightOrange,
        tabBarInactiveTintColor: 'white',
        tabBarStyle: { backgroundColor: COLORS.primaryBlue, paddingTop: 10 },
        headerShown: false
      }}>
        <Tabs.Screen
          name="list"
          options={{
            title: 'List',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="maps"
          options={{
            title: 'Map',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
          }}
        />
      </Tabs>
      <FAB
        onPress={() => router.push('/(auth)/(tabs)/list/new')}
        icon={{ name: 'add', color: 'white' }}
        size="small"
        style={styles.fabStyle}
        color={COLORS.primaryOrange}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fabStyle: {
    position: 'absolute',
    right: width * 0.04,
    bottom: height * 0.11,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  }
})
