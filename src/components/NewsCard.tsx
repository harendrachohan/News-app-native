import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

export default function NewsCard({ article, index, onPress }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const serialNumber = String(index + 1).padStart(2, "0");

  const getCategoryStyles = (category: string) => {
    const cat = (category || "news").toLowerCase();
    switch (cat) {
      case "tech":
      case "technology":
        return { bg: "#E3F2FD", text: "#0D47A1" };
      case "politics":
        return { bg: "#FFEBEE", text: "#C62828" };
      case "business":
      case "finance":
        return { bg: "#E8F5E9", text: "#2E7D32" };
      case "science":
        return { bg: "#E0F7FA", text: "#00838F" };
      case "sports":
        return { bg: "#FFF3E0", text: "#EF6C00" };
      default:
        return { bg: "#F5F5F5", text: "#616161" };
    }
  };

  const catStyle = getCategoryStyles(article.category);

  return (
    <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed
        ]}
        onPress={onPress}
      >
        {article.imageUrl ? (
          <Image
            source={{ uri: article.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        ) : null}

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <View style={[styles.badge, { backgroundColor: catStyle.bg }]}>
              <Text style={[styles.badgeText, { color: catStyle.text }]}>
                {(article.category || "General").toUpperCase()}
              </Text>
            </View>
            <Text style={styles.serialText}>#{serialNumber}</Text>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>

          <Text numberOfLines={3} style={styles.summary}>
            {article.summary}
          </Text>

          <View style={styles.footer}>
            <Text style={styles.date}>
              {new Date(article.publishedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
            <View style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>Read More →</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.03)",
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: "#f0f0f0",
  },
  contentContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  serialText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#AEB2B7",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1D20",
    lineHeight: 24,
    marginBottom: 6,
  },
  summary: {
    fontSize: 14,
    color: "#60646C",
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#F2F3F5",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: "#AEB2B7",
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  readMoreText: {
    color: "#007AFF",
    fontSize: 12,
    fontWeight: "700",
  },
});