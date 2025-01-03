import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

import Card from "./Card";
import { searchCards, CardResponse } from "../api/api";

type CardData = {
  set: string;
  number: string;
  name: string;
  type: string;
  aspects: string[];
  traits: string[];
  arenas: string[];
  cost: number;
  power: number;
  hp: number;
  fronttext: string;
  doublesided: boolean;
  rarity: string;
  unique: boolean;
  artist: string;
  varianttype: string;
  marketprice: string;
  foilprice: string;
  frontArt: string;
  id: string;
};

type CardListProps = {
  hp?: string;
  range?: string;
};

const transformCardResponse = (
  card: CardResponse,
  index: number
): CardData => ({
  set: card.Set || "Unknown Set",
  number: card.Number || `Unknown Number ${index}`,
  name: card.Name || `Unnamed Card ${index}`,
  type: card.Type || "Unknown Type",
  aspects: card.Aspects || [],
  traits: card.Traits || [],
  arenas: card.Arenas || [],
  cost: parseInt(card.Cost || "0", 10),
  power: parseInt(card.Power || "0", 10),
  hp: parseInt(card.HP || "0", 10),
  fronttext: card.FrontText || "No description available.",
  doublesided: card.DoubleSided ?? false,
  rarity: card.Rarity || "Common",
  unique: card.Unique ?? false,
  artist: card.Artist || "Unknown Artist",
  varianttype: card.VariantType || "None",
  marketprice: card.MarketPrice || "N/A",
  foilprice: card.FoilPrice || "N/A",
  frontArt: card.FrontArt || "https://via.placeholder.com/150",
  id: `${card.Set || "unknown-set"}-${card.Number || `unknown-number-${index}`}`,
});

export default function CardList({ hp = "", range = "" }: CardListProps) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof CardData>("name");
  const [slideAnimation] = useState(new Animated.Value(0));
  const animatedValues = useRef<
    { translateX: Animated.Value; scale: Animated.Value }[]
  >([]).current;

  useEffect(() => {
    const fetchCardData = async () => {
      if (cards.length > 0) {
        animateSlideOut();
      }

      setLoading(true);
      setError(null);

      try {
        const result = await searchCards(hp);
        const formattedCards = result.map(transformCardResponse);

        let filteredCards = formattedCards;
        if (range) {
          const [minHp, maxHp] = range.split("-").map(Number);
          filteredCards = formattedCards.filter(
            (card) => card.hp >= minHp && card.hp <= maxHp
          );
        }

        animatedValues.length = filteredCards.length;
        filteredCards.forEach((_, index) => {
          animatedValues[index] = {
            translateX: new Animated.Value(0),
            scale: new Animated.Value(0.5),
          };
        });

        setCards(
          filteredCards.sort((a, b) =>
            a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0
          )
        );

        animateZoomIn();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cards");
      } finally {
        setLoading(false);
      }
    };

    fetchCardData();
  }, [hp, range, sortKey]);

  const animateZoomIn = () => {
    animatedValues.forEach(({ scale }, index) => {
      Animated.timing(scale, {
        toValue: 1,
        duration: 700,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  };

  const animateSlideOut = () => {
    Animated.timing(slideAnimation, {
      toValue: -1000, // Slide to the left
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      slideAnimation.setValue(0);
    });
  };

  const renderSortButton = (
    label: string,
    key: keyof CardData,
    color: string
  ) => (
    <TouchableOpacity
      style={[styles.sortButton, { borderColor: color }]}
      onPress={() => setSortKey(key)}
    >
      <Text style={styles.sortButtonText}>Sort by {label}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }: { item: CardData; index: number }) => {
    const { scale } = animatedValues[index];
    return (
      <Animated.View
        style={{
          transform: [{ translateX: slideAnimation }, { scale }],
        }}
      >
        <Card {...item} />
      </Animated.View>
    );
  };

  if (!hp && cards.length === 0 && !loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>
          Welcome to the Card Browser! Select an HP or Range of HP to start
          browsing.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Loading cards...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>No cards found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sortButtons}>
        {renderSortButton("Name", "name", "#3B82F6")}
        {renderSortButton("Set", "set", "#10B981")}
        {renderSortButton("Cost", "cost", "#8B5CF6")}
        {renderSortButton("Power", "power", "#EF4444")}
      </View>
      <FlatList
        data={cards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
  },
  sortButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    flexWrap: "wrap",
  },

  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    margin: 4,
  },

  sortButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  messageText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    padding: 16,
  },
  welcomeText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
    padding: 16,
    fontWeight: "bold",
  },
  errorText: {
    textAlign: "center",
    color: "#FF4C4C",
    fontSize: 16,
    padding: 16,
  },
});
