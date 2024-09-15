import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Empty from '@/components/Empty';
import { useGetAllNotes } from '@/hooks/useNotes';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS } from '@/styles/COLORS';

interface NoteItemProps {
  id: string
  title: string
  content?: string
  createdAt: Date | string
}

const NoteItem: React.FC<NoteItemProps> = ({ id, title }) => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push(`/list/${id}`)}>
      <View style={styles.itemWrapper}>
        <Text style={{ color: COLORS.lightBlack }}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
};

const ItemSeparator = () => <View style={styles.separator} />;

export default function NotesList() {
  const { notes, fetchNotes, loading } = useGetAllNotes();

  const onRefresh = useCallback(async () => {
    await fetchNotes();
  }, [fetchNotes]);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes])
  );

  if (loading) {
    return <ActivityIndicator />
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          <NoteItem
            id={item.id}
            title={item.title}
            createdAt={item.createdAt}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={<Empty />}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  itemWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
    backgroundColor: COLORS.lightBlue,
    borderColor: 'transparent',
    shadowColor: COLORS.lightBlack,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 5,
  },
  separator: {
    height: 10,
    backgroundColor: 'transparent',
  },
})
