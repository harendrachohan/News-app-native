import { useQuery } from "@apollo/client";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Image,
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
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  const article = data?.article;

  if (!article) {
    return (
      <View style={styles.center}>
        <Text>Article not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      {article.imageUrl ? (
        <Image
          source={{ uri: article.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}

      <Text style={styles.title}>{article.title}</Text>

      <View style={styles.meta}>
        {article.sourceId ? <Text>{article.sourceId}</Text> : null}
        {article.category ? <Text>{article.category.toUpperCase()}</Text> : null}
      </View>

      <Text style={styles.date}>
        {new Date(article.publishedAt).toLocaleString()}
      </Text>

      <Text style={styles.content}>
        {article.content}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  back: {
    fontSize: 16,
    padding: 16,
    color: "#007AFF",
  },
  image: {
    width: "100%",
    height: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    padding: 16,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  date: {
    color: "#666",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    padding: 16,
  },
});