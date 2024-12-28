import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';

type CardProps = {
  name: string;
  set: string;
  cost: number;
  power: number;
  hp: string | number;
  type: string;
  traits: string[];
  rarity: string;
  frontArt: string;
};

export default function Card({
  name,
  set,
  cost,
  power,
  hp,
  type,
  traits,
  rarity,
  frontArt,
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
    if (flipped) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setFlipped(false));
    } else {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setFlipped(true));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
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
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Set</Text>
                <Text style={styles.statValue}>{set}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Traits</Text>
                <Text style={styles.statValue}>{traits.join(', ')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Cost</Text>
                <Text style={styles.statValue}>{cost}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Power</Text>
                <Text style={styles.statValue}>{power}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>HP</Text>
                <Text style={styles.statValue}>{hp}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Rarity</Text>
                <Text style={styles.statValue}>{rarity}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 370,
    height: 513,
    margin: 16,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    overflow: 'hidden',
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
  },
  subtitle: {
    fontSize: 18,
    color: '#98C1D9',
    marginBottom: 16,
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.32)', 
    padding: 12,
    borderRadius: 8,
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
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E0E0E0', 
  },
  statValue: {
    fontSize: 14,
    color: '#FFFFFF', 
  },
});
