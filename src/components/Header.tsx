import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import Dropdown from "./Dropdown";
import RangePicker from "./RangePicker";

type HeaderProps = {
  onSelectHp: (hp: string) => void;
  onSelectRange: (range: string) => void;
};

export default function Header({ onSelectHp, onSelectRange }: HeaderProps) {
  const [selectedHp, setSelectedHp] = useState<string>('');

  const handleHpSelect = (hp: string) => {
    setSelectedHp(hp);
    onSelectHp(hp);
  };

  const handleRangeSelect = (range: string) => {
    setSelectedHp('');
    onSelectRange(range);
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Card Browser</Text>
      <View style={styles.filterContainer}>
        <Dropdown onSelect={handleHpSelect} selectedValue={selectedHp} />
        <RangePicker onRangeSelect={handleRangeSelect} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    backgroundColor: 'rgb(26 41 66)',
    borderBottomWidth: 1,
    borderBottomColor: "#FBBF24",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16, 
    flexWrap: "wrap", 
  },
});
