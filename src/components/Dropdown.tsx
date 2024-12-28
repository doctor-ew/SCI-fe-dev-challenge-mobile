/* eslint-disable no-console */
import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { fetchCatalog } from '../api/api';

type DropdownProps = {
  onSelect: (selectedValue: string) => void;
};

export default function Dropdown({ onSelect }: DropdownProps) {
  const [options, setOptions] = useState<string[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string>('');

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const result = await fetchCatalog(); 
        console.log('Fetched options:', result);
        setOptions(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load options';
        console.error('Error fetching catalog:', err);
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
        dropdownIconColor='#98C1D9' 
      >
        <Picker.Item label='Select an Option' value='' />
        {options.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#3A506B', 
    borderRadius: 12, 
    backgroundColor: '#1C2541', 
    overflow: 'hidden', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, 
  },
  picker: {
    color: '#98C1D9', 
    fontSize: 16,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: '#1C2541', 
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
