// app/notes/map.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect, useRouter } from 'expo-router';
import { useGetAllNotes } from '@/hooks/useNotes';
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';
import { StyleSheet } from 'react-native';

export default function NotesMap() {
  const [region, setRegion] = useState<any>(null);
  const [loadingInitialLocation, setLoadingInitialLocation] = useState<boolean>(true);
  const { notes, fetchNotes, loading: loadingNotes } = useGetAllNotes();
  const router = useRouter();

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        setLoadingInitialLocation(true);
        let { status } = await requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Please enable location permissions.');
          return;
        }

        let location = await getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

      } catch (error: any) {
        console.error(error);
      } finally {
        setLoadingInitialLocation(false);
      }
    };

    getCurrentLocation();
  }, []);

  // const onRefresh = useCallback(async () => {
  //   await fetchNotes();
  // }, [fetchNotes]);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes])
  );

  if (loadingNotes || loadingInitialLocation) {
    return <ActivityIndicator />
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
    >
      {notes.map((note: any, index: any) => (
        <Marker
          key={index}
          coordinate={{
            latitude: note.location.latitude,
            longitude: note.location.longitude,
          }}
          title={note.title}
          onPress={() => router.push(`/list/${note.id}`)}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});