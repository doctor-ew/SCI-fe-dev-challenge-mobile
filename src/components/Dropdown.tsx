import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { fetchCatalog } from '../api/api';

type DropdownProps = {
  onSelect: (selectedValue: string) => void;
};

export default function Dropdown({ onSelect }: DropdownProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string>('');

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const result = await fetchCatalog();
        setOptions(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load options';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    void loadOptions();
  }, []);

  if (loading) {
    return <Text style={styles.loadingText}>Loading options...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Picker
        testID='picker'
        selectedValue={selectedValue}
        onValueChange={(itemValue: string) => {
          setSelectedValue(itemValue);
          onSelect(itemValue);
        }}
        style={styles.picker}
        dropdownIconColor='#3B82F6'
      >
        <Picker.Item label='Select a Category' value='' style={styles.pickerItem} />
        {options.map((option) => (
          <Picker.Item
            key={option}
            label={option}
            value={option}
            style={styles.pickerItem}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 8,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  picker: {
    color: '#3B82F6',
    fontSize: 16,
    height: 50,
    backgroundColor: 'transparent',
  },
  pickerItem: {
    color: '#3B82F6',
    backgroundColor: 'transparent',
  },
  loadingText: {
    textAlign: 'center',
    color: '#5FB3B3',
    padding: 10,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    color: '#E63946',
    padding: 10,
    fontSize: 16,
  },
});
