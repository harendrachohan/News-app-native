import { useQuery } from "@apollo/client";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { GET_ARTICLE } from "../../graphql/queries";

export default function ArticleDetails() {
  const { id } = useLocalSearchParams();

  const { data, loading, error } = useQuery(GET_ARTICLE, {
    variables: {
      id,
    },
    skip: !id,
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    );
  }

  const article = data?.article;

  if (!article) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Article not found.</Text>
      </View>
    );
  }

  const handleOpenSource = () => {
    if (article?.url) {
      WebBrowser.openBrowserAsync(article.url).catch((err) =>
        console.error("Failed to open source URL:", err)
      );
    }
  };

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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Title */}
      <Text style={styles.title}>{article.title}</Text>

      {/* Image */}
      {article.imageUrl ? (
        <Image
          source={{ uri: article.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      ) : null}

      {/* Meta Container */}
      <View style={styles.metaContainer}>
        <View style={styles.metaRow}>
          {article.category ? (
            <View style={[styles.badge, { backgroundColor: catStyle.bg }]}>
              <Text style={[styles.badgeText, { color: catStyle.text }]}>
                {article.category.toUpperCase()}
              </Text>
            </View>
          ) : null}
          {article.sourceId ? (
            <Pressable onPress={handleOpenSource}>
              <Text style={styles.sourceTextLink}>
                Source: <Text style={styles.linkUnderline}>{article.sourceId}</Text>
              </Text>
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.dateText}>
          {new Date(article.publishedAt).toLocaleString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      {/* Summary Container */}
      {article.summary ? (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryHeader}>AI Key Summary</Text>
          <Text style={styles.summaryText}>{article.summary}</Text>
        </View>
      ) : null}

      {/* Content Container */}
      {article.content ? (
        <Text style={styles.content}>{article.content}</Text>
      ) : (
        <Text style={styles.noContentText}>No additional content available.</Text>
      )}

      {/* Bottom Go Back Button */}
      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.backButtonPressed
        ]}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Go Back</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 48,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#60646C",
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1D20",
    lineHeight: 32,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  image: {
    width: "92%",
    height: 240,
    alignSelf: "center",
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    marginBottom: 20,
  },
  metaContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
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
  sourceTextLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#60646C",
  },
  linkUnderline: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  dateText: {
    fontSize: 12,
    color: "#AEB2B7",
  },
  summaryContainer: {
    backgroundColor: "#F8F9FA",
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: "#007AFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 14,
    color: "#40444C",
    lineHeight: 22,
    fontWeight: "500",
  },
  content: {
    fontSize: 16,
    color: "#30343C",
    lineHeight: 26,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  noContentText: {
    fontSize: 14,
    color: "#AEB2B7",
    fontStyle: "italic",
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: "#007AFF",
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});