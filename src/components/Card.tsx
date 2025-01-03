import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';

type CardProps = {
  name: string;
  set: string;
  cost: string | number;
  power: string | number;
  hp: string | number;
  type: string;
  traits: string[];
  rarity: string;
  frontArt: string;
};

export default function Card({
  name = 'Unknown Name',
  set = 'Unknown Set',
  cost = 0,
  power = 0,
  hp = 'N/A',
  type = 'Unknown Type',
  traits = [],
  rarity = 'Common',
  frontArt = 'https://via.placeholder.com/370x513',
}: CardProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const frontRotation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const flipCard = () => {
    Animated.timing(animatedValue, {
      toValue: flipped ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setFlipped(!flipped);
    });
  };

  return (
    <Pressable
      onPress={flipCard}
      accessible
      accessibilityLabel={`Flip card: ${name}`}
    >
      <View style={styles.cardContainer}>
        {/* Front Side */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ perspective: 1000 }, { rotateY: frontRotation }],
            },
          ]}
        >
          <Image source={{ uri: frontArt }} style={styles.image} />
        </Animated.View>

        {/* Back Side */}
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            {
              transform: [{ perspective: 1000 }, { rotateY: backRotation }],
            },
          ]}
        >
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>{type}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statsGrid}>
              {[
                { label: 'Set', value: set },
                { label: 'Traits', value: traits.join(', ') || 'None' },
                { label: 'Cost', value: cost.toString() },
                { label: 'Power', value: power.toString() },
                { label: 'HP', value: hp.toString() },
                { label: 'Rarity', value: rarity },
              ].map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Text style={styles.statValue}>{stat.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 375,
    height: 513,
    margin: 16,
  },
  card: {
    position: 'absolute',
    width: '100%',
    maxWidth: 370,
    height: '100%',
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardBack: {
    backgroundColor: '#1E2A38',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#98C1D9',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#98C1D9',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    padding: 12,
    borderRadius: 8,
    width: '90%',
    alignSelf: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    width: '30%',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E0E0E0',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 4,
  },
});
