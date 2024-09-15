import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useDeleteNote, useGetNote, useUpdateNote, useUploadImage } from '@/hooks/useNotes';
import CustomDatePicker from '@/components/CustomDatePicker';
import { Button, Icon, Image, Input } from '@rneui/themed';
import { convertFirestoreTimestampToMoment } from '@/utils';
import { COLORS } from '@/styles/COLORS';
import { BUTTON_TITLE, BUTTONS } from '@/styles/BUTTONS';

const Note = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { note, loading } = useGetNote(id as string);
  const { updateNote, loading: loadingUpdateNote } = useUpdateNote();
  const { uploadImage, loading: loadingUploadImage } = useUploadImage();
  const { deleteNote, loading: loadingDeleteNote } = useDeleteNote();
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState(note?.title);
  const [body, setBody] = useState(note?.content);
  const [image, setImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleUpdate = async () => {
    if (!title || !body) {
      Alert.alert('Validation Error', 'Title and body are required.');
      return;
    }
    try {
      let imageUri = null;
      if (image !== note?.imageUri) {
        imageUri = await uploadImage(image as string, note?.id);
        const updates = { title, body, date, imageUri: imageUri as string }
        const res = await updateNote(id as string, updates);
        if (res.success) {
          Alert.alert('Success', res.message);
          navigation.goBack();
        }
        return;
      }
      const updates = { title, body, date }
      const res = await updateNote(id as string, updates);
      if (res.success) {
        Alert.alert('Success', res.message);
        navigation.goBack();
      }
    } catch (error) {
      console.error(error)
    } finally {
    }

  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK', onPress: async () => {
          try {
            await deleteNote(id as string);
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to delete note.');
          } finally {
            Alert.alert('Success', 'Note deleted successfully.');
            navigation.goBack();
          }
        }
      },
    ]);
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need permission to access your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result?.assets[0].uri);
    }
  };

  useEffect(() => {
    if (note) {
      setDate(convertFirestoreTimestampToMoment(note?.createdAt));
      setImage(note?.imageUri)
      setBody(note?.content)
      setTitle(note?.title)
    }
  }, [note]);

  if (loading) {
    return (
      <ActivityIndicator size="large" />
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <View style={styles.imageContainer}>
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <Button
            title="Select Image"
            onPress={handleImagePicker}
            containerStyle={styles.selectImageButton}
            buttonStyle={BUTTONS.secondary}
            titleStyle={BUTTON_TITLE.primary}
            icon={<Icon name="image" color={!isEditing ? 'hsl(208, 8%, 63%)' : 'white'} />}
            disabled={!isEditing}
          />
        </View>
        <CustomDatePicker
          date={date}
          setDate={setDate}
          disabled={!isEditing}
        />
        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          defaultValue={note?.title}
          containerStyle={styles.inputContainer}
          disabled={!isEditing}
        />
        <Input
          label="Body"
          value={body}
          defaultValue={note?.content}
          onChangeText={setBody}
          multiline
          numberOfLines={4}
          containerStyle={styles.inputContainer}
          disabled={!isEditing}
        />

      </View>
      <View>
        {!isEditing && (
          <View style={styles.buttonGroup}>
            <Button
              title="Delete"
              buttonStyle={BUTTONS.secondary}
              titleStyle={BUTTON_TITLE.primary}
              onPress={handleDelete}
              containerStyle={styles.buttonContainer}
              loading={loadingDeleteNote}
            />
            <Button
              title="Edit"
              buttonStyle={BUTTONS.primary}
              titleStyle={BUTTON_TITLE.primary}
              onPress={handleEdit}
              containerStyle={styles.buttonContainer}
            />
          </View>
        )}
        {isEditing && (
          <View style={styles.buttonGroup}>
            <Button
              title="Cancel"
              buttonStyle={BUTTONS.dark}
              titleStyle={BUTTON_TITLE.primary}
              onPress={handleCancel}
              containerStyle={styles.buttonContainer}
            />
            <Button
              title="Update"
              onPress={handleUpdate}
              buttonStyle={BUTTONS.primary}
              titleStyle={BUTTON_TITLE.primary}
              containerStyle={styles.buttonContainer}
              loading={loadingUpdateNote}
            />
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default Note;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 10,
    flex: 1
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    flex: 1
  },
  deleteButton: {
    backgroundColor: COLORS.primaryOrange,
  },
  editButton: {
    backgroundColor: COLORS.primaryBlue
  },
  cancelButton: {
    backgroundColor: COLORS.lightBlack
  },
  goBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  goBackText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'black',
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: 'center'
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectImageButton: {
    backgroundColor: COLORS.primaryOrange,
    borderRadius: 10,
    fontSize: 10
  }
})