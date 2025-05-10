import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type RangePickerProps = {
  onRangeSelect: (range: string) => void;
};

export default function RangePicker({ onRangeSelect }: RangePickerProps) {
  const [minHp, setMinHp] = useState<string>("");
  const [maxHp, setMaxHp] = useState<string>("");

  const handleRangeChange = () => {
    if (minHp && maxHp) {
      onRangeSelect(`${minHp}-${maxHp}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Min HP:</Text>
        <TextInput
          style={styles.input}
          value={minHp}
          onChangeText={setMinHp}
          placeholder="Min HP"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Max HP:</Text>
        <TextInput
          style={styles.input}
          value={maxHp}
          onChangeText={setMaxHp}
          placeholder="Max HP"
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRangeChange}>
        <Text style={styles.buttonText}>Set Range</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // Reduced gap
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EAB308",
  },
  input: {
    width: 80,
    height: 40,
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#FBBF24",
    borderRadius: 6,
    color: "#9CA3AF",
    backgroundColor: "transparent",
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#FBBF24",
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D97706",
  },
});
