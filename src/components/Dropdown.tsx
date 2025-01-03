import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { fetchCatalog } from '../api/api';

type DropdownProps = {
  onSelect: (selectedValue: string) => void;
  selectedValue: string;
};

export default function Dropdown({ onSelect, selectedValue }: DropdownProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>HP:</Text>
      {loading && <Text style={styles.loadingText}>Loading options...</Text>}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
      {!loading && !error && (
        <Picker
          selectedValue={selectedValue}
          onValueChange={onSelect}
          style={styles.picker}
        >
          <Picker.Item label='Select HP' value='' />
          {options.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EAB308', 
  },
  picker: {
    width: 128, 
    height: 40,
    color: '#595e66', 
    borderWidth: 1,
    borderColor: '#FBBF24', 
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  loadingText: {
    fontSize: 14,
    color: '#4B5563',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444', 
  },
});
