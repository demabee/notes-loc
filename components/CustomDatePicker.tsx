import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, Icon, Input } from '@rneui/themed';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';
import { COLORS } from '@/styles/COLORS';

interface CustomDatePickerProps {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  disabled?: boolean
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ date, setDate, disabled }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // Only show modal for iOS
    setDate(currentDate);
  };

  const showAndroidDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: onChangeDate,
      mode: 'date',
      is24Hour: true,
    });
  };

  const handleIconPress = () => {
    if (Platform.OS === 'android') {
      showAndroidDatePicker();
    } else {
      setShowDatePicker(true);
    }
  };

  return (
    <View>
      <Input
        disabled
        label="Date"
        value={moment(date).format('YYYY-MM-DD')}
        inputStyle={{ color: 'black', fontSize: 18 }}
        disabledInputStyle={{ color: COLORS.primaryBlack, fontSize: 18 }}
        containerStyle={styles.inputContainer}
        rightIcon={
          <TouchableOpacity onPress={handleIconPress} disabled={disabled}>
            <Icon
              name='calendar'
              type='font-awesome'
              size={18}
              color={disabled ? 'hsl(208, 8%, 63%)' : COLORS.primaryBlue}
            />
          </TouchableOpacity>
        }
      />

      {Platform.OS === 'ios' && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={date}
                mode="date"
                display="inline"
                onChange={onChangeDate}
              />
              <Button title="Confirm" onPress={() => setShowDatePicker(false)} containerStyle={styles.confirmButton} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  confirmButton: {
    marginTop: 20,
    width: '100%',
  },
});
