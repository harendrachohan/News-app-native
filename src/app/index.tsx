import { useQuery } from "@apollo/client";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import NewsCard from "../components/NewsCard";
import { SEARCH_NEWS } from "../graphql/queries";

export default function Home() {
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);

  const { data, loading, error, fetchMore } = useQuery(SEARCH_NEWS, {
    variables: {
      page: 1,
      limit: 10,
      category: "",
    },
  });

  useEffect(() => {
    if (data?.articles) {
      const { data: articlesData, limit } = data.articles;
      if (articlesData.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  }, [data]);

  const loadMore = () => {
    if (loading || isFetchingRef.current || !hasMore) return;

    const currentPage = data?.articles?.page ?? 1;
    const currentLimit = data?.articles?.limit ?? 10;

    isFetchingRef.current = true;
    setIsFetchingMore(true);

    fetchMore({
      variables: {
        page: currentPage + 1,
        limit: currentLimit,
        category: "",
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        const incomingData = fetchMoreResult.articles?.data ?? [];
        if (incomingData.length < currentLimit) {
          setHasMore(false);
        }

        const existingData = prev.articles?.data ?? [];
        const existingIds = new Set(existingData.map((item: any) => item.id || item.url));
        const uniqueIncomingData = incomingData.filter(
          (item: any) => !existingIds.has(item.id || item.url)
        );

        return {
          ...prev,
          articles: {
            ...prev.articles,
            page: fetchMoreResult.articles.page,
            data: [...existingData, ...uniqueIncomingData],
          },
        };
      },
    })
      .catch((err) => {
        console.error("Error fetching more news:", err);
      })
      .finally(() => {
        isFetchingRef.current = false;
        setIsFetchingMore(false);
      });
  };

  const renderFooter = () => {
    if (isFetchingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      );
    }

    if (hasMore) {
      return (
        <View style={styles.footer}>
          <Pressable style={styles.button} onPress={loadMore}>
            <Text style={styles.buttonText}>Load More</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.footer}>
        <Text style={styles.noMoreText}>No more articles</Text>
      </View>
    );
  };

  if (loading && !data) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && !data) {
    return null;
  }

  return (
    <LinearGradient
      colors={["#EBF0F6", "#F4F7FA"]}
      style={styles.container}
    >
      <FlatList
        data={data?.articles?.data ?? []}
        keyExtractor={(item) => item.id || item.url}
        renderItem={({ item, index }) => (
          <NewsCard
            article={item}
            index={index}
            onPress={() =>
              router.push({
                pathname: "/article/[id]",
                params: {
                  id: encodeURIComponent(item.id)
                },
              })
            }
          />
        )}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        style={{ backgroundColor: "transparent" }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 12,
  },
  footer: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  noMoreText: {
    color: "#AEB2B7",
    fontSize: 14,
    fontWeight: "500",
  },
});