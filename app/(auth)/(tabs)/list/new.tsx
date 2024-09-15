import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ScrollView, View } from 'react-native';
import { Input, Button, Image, Icon } from '@rneui/themed';
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useAddNote, useUpdateNote, useUploadImage } from '@/hooks/useNotes';
import CustomDatePicker from '@/components/CustomDatePicker';
import { COLORS } from '@/styles/COLORS';
import { BUTTON_TITLE, BUTTONS } from '@/styles/BUTTONS';

const NoteScreen = () => {
  const navigation = useNavigation();
  const { addNote, loading: loadingAddNote } = useAddNote();
  const { uploadImage, loading: loadingUploadImage } = useUploadImage();
  const { updateNote, loading: loadingUpdateNote } = useUpdateNote();
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const isFormValid = title.trim().length > 0 &&
    body.trim().length > 0 &&
    date !== null &&
    image !== null;

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const { coords } = await getCurrentPositionAsync();
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      }
    };

    getLocation();
  }, []);

  const handleSave = async () => {
    if (!title || !body) {
      Alert.alert('Validation Error', 'Title and body are required.');
      return;
    }
    try {
      const noteId = await addNote(title, body, date, location);
      const imageUri = await uploadImage(image as string, noteId as string);
      const result = await updateNote(noteId as string, { imageUri })
      if (result.success) {
        Alert.alert('Success', result.message);
        navigation.goBack();
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <Button
          title="Select Image"
          onPress={handleImagePicker}
          containerStyle={styles.selectImageButton}
          buttonStyle={BUTTONS.secondary}
          titleStyle={BUTTON_TITLE.primary}
          icon={<Icon name="image" color="white" size={18} />}
        />
      </View>
      <CustomDatePicker
        date={date}
        setDate={setDate}
      />
      <Input
        label="Title"
        value={title}
        onChangeText={setTitle}
        containerStyle={styles.inputContainer}
      />
      <Input
        label="Body"
        value={body}
        onChangeText={setBody}
        multiline
        numberOfLines={4}
        containerStyle={styles.inputContainer}
      />
      <Button
        title="Save"
        onPress={handleSave}
        containerStyle={styles.buttonContainer}
        buttonStyle={BUTTONS.primary}
        titleStyle={BUTTON_TITLE.primary}
        loading={loadingAddNote || loadingUploadImage || loadingUpdateNote}
        disabled={!isFormValid}
        disabledStyle={BUTTONS.primaryDisabled}
        disabledTitleStyle={BUTTON_TITLE.primaryDisabled}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
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
    gap: 10
  }
});

export default NoteScreen;
