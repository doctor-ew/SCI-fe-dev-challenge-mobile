import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Platform } from "react-native";

import CardList from "./src/components/CardList";
import Header from "./src/components/Header"; 
import ParallaxScrollView from "./src/components/ParallaxScrollView";

export default function App() {
  const [selectedHP, setSelectedHP] = useState<string>("");
  const [selectedRange, setSelectedRange] = useState<string>("");

  // Simple header image component could be added here
  const HeaderImage = () => null;

  const content = (
    <>
      <Header onSelectHp={setSelectedHP} onSelectRange={setSelectedRange} />
      <CardList hp={selectedHP} range={selectedRange} />
    </>
  );

  // Use ParallaxScrollView only on mobile platforms
  if (Platform.OS !== "web") {
    return (
      <SafeAreaView style={styles.container}>
        <ParallaxScrollView
          headerImage={<HeaderImage />}
          headerBackgroundColor={{ dark: "#1F2937", light: "#F3F4F6" }}
        >
          {content}
        </ParallaxScrollView>
      </SafeAreaView>
    );
  }

  // Simpler layout for web
  return <SafeAreaView style={styles.container}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
});
