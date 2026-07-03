import { useQuery } from "@apollo/client";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import NewsCard from "../components/NewsCard";
import { SEARCH_ARTICLES, SEARCH_NEWS } from "../graphql/queries";

const SearchIcon = ({ color = "#1A1D20" }: { color?: string }) => (
  <View style={{ width: 20, height: 20, justifyContent: "center", alignItems: "center" }}>
    <View style={{
      width: 14,
      height: 14,
      borderRadius: 7,
      borderWidth: 2,
      borderColor: color,
      position: "relative",
    }}>
      <View style={{
        width: 2,
        height: 6,
        backgroundColor: color,
        position: "absolute",
        bottom: -4,
        right: -2,
        transform: [{ rotate: "-45deg" }],
      }} />
    </View>
  </View>
);

const CloseIcon = ({ color = "#1A1D20" }: { color?: string }) => (
  <View style={{ width: 20, height: 20, justifyContent: "center", alignItems: "center" }}>
    <View style={{
      width: 14,
      height: 2,
      backgroundColor: color,
      transform: [{ rotate: "45deg" }],
      position: "absolute",
    }} />
    <View style={{
      width: 14,
      height: 2,
      backgroundColor: color,
      transform: [{ rotate: "-45deg" }],
      position: "absolute",
    }} />
  </View>
);

const FilterIcon = ({ color = "#1A1D20" }: { color?: string }) => (
  <View style={{ width: 20, height: 20, justifyContent: "center", alignItems: "center" }}>
    <View style={{
      width: 16,
      height: 2,
      backgroundColor: color,
      marginBottom: 3,
    }} />
    <View style={{
      width: 11,
      height: 2,
      backgroundColor: color,
      marginBottom: 3,
    }} />
    <View style={{
      width: 6,
      height: 2,
      backgroundColor: color,
    }} />
  </View>
);

export default function Home() {
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeState, setActiveState] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const isFetchingRef = useRef(false);

  const isSearching = searchQuery.trim().length > 0;

  const handleToggleSearch = () => {
    const nextSearch = !showSearch;
    setShowSearch(nextSearch);
    if (nextSearch) {
      setShowFilters(false);
      setSearchQuery("");
    } else {
      setShowFilters(true);
      setSearchQuery("");
    }
  };

  const handleToggleFilters = () => {
    const nextFilters = !showFilters;
    setShowFilters(nextFilters);
    if (nextFilters) {
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const categories = [
    { label: "All News", value: "" },
    { label: "Tech 💻", value: "technology" },
    { label: "Politics 🏛️", value: "politics" },
    { label: "Business 💼", value: "business" },
    { label: "Science 🔬", value: "science" },
    { label: "Sports ⚽", value: "sports" },
  ];

  const states = [
    { label: "All States", value: "" },
    { label: "Uttarakhand 🏔️", value: "uttarakhand" },
    { label: "Delhi 🏛️", value: "delhi" },
    { label: "Goa 🏖️", value: "goa" },
  ];

  // Query 1: Normal news feed
  const { data: newsData, loading: newsLoading, error: newsError, fetchMore: fetchMoreNews } = useQuery(SEARCH_NEWS, {
    variables: {
      page: 1,
      limit: 10,
      category: activeCategory,
      state: activeState || undefined,
    },
    skip: isSearching,
  });

  // Query 2: Search results
  const { data: searchData, loading: searchLoading, error: searchError, fetchMore: fetchMoreSearch } = useQuery(SEARCH_ARTICLES, {
    variables: {
      q: searchQuery,
      page: 1,
      limit: 10,
    },
    skip: !isSearching,
  });

  const activeData = isSearching ? searchData : newsData;
  const activeLoading = isSearching ? searchLoading : newsLoading;
  const activeError = isSearching ? searchError : newsError;
  const activeFetchMore = isSearching ? fetchMoreSearch : fetchMoreNews;

  const articlesList = isSearching
    ? searchData?.searchArticles?.data ?? []
    : newsData?.articles?.data ?? [];

  // Track hasMore state based on query data
  useEffect(() => {
    const activeArticles = isSearching ? searchData?.searchArticles : newsData?.articles;
    if (activeArticles) {
      const { data: articlesData, limit } = activeArticles;
      if (articlesData.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  }, [newsData, searchData, isSearching]);

  // Reset pagination state when filters or search change
  useEffect(() => {
    setHasMore(true);
  }, [activeCategory, activeState, searchQuery]);

  const selectCategory = (cat: string) => {
    setActiveCategory(cat);
    setActiveState("");
  };

  const selectState = (st: string) => {
    setActiveState(st);
    setActiveCategory("");
  };

  const loadMore = () => {
    if (activeLoading || isFetchingRef.current || !hasMore) return;

    const activeArticles = isSearching ? activeData?.searchArticles : activeData?.articles;
    const currentPage = activeArticles?.page ?? 1;
    const currentLimit = activeArticles?.limit ?? 10;

    isFetchingRef.current = true;
    setIsFetchingMore(true);

    activeFetchMore({
      variables: {
        page: currentPage + 1,
        limit: currentLimit,
        q: isSearching ? searchQuery : undefined,
        category: isSearching ? undefined : activeCategory,
        state: isSearching ? undefined : (activeState || undefined),
      },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        if (!fetchMoreResult) return prev;

        const incomingArticles = isSearching ? fetchMoreResult.searchArticles : fetchMoreResult.articles;
        const prevArticles = isSearching ? prev.searchArticles : prev.articles;

        const incomingData = incomingArticles?.data ?? [];
        if (incomingData.length < currentLimit) {
          setHasMore(false);
        }

        const existingData = prevArticles?.data ?? [];
        const existingIds = new Set(existingData.map((item: any) => item.id || item.url));
        const uniqueIncomingData = incomingData.filter(
          (item: any) => !existingIds.has(item.id || item.url)
        );

        const mergedField = {
          ...prevArticles,
          page: incomingArticles.page,
          data: [...existingData, ...uniqueIncomingData],
        };

        return isSearching
          ? { ...prev, searchArticles: mergedField }
          : { ...prev, articles: mergedField };
      },
    })
      .catch((err: any) => {
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

  if (activeLoading && !activeData) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (activeError && !activeData) {
    return null;
  }

  return (
    <LinearGradient colors={["#EBF0F6", "#F4F7FA"]} style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerShadowVisible: true,
          headerTitle: showSearch ? () => (
            <View style={styles.headerSearchContainer}>
              <TextInput
                style={styles.headerSearchInput}
                placeholder="Search articles..."
                placeholderTextColor="#AEB2B7"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                autoFocus
              />
              {searchQuery ? (
                <Pressable style={styles.headerClearButton} onPress={() => setSearchQuery("")}>
                  <CloseIcon color="#60646C" />
                </Pressable>
              ) : null}
            </View>
          ) : "Latest News",
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center", marginRight: 8 }}>
              {/* Filter Toggle Button */}
              <Pressable
                style={{ padding: 8 }}
                onPress={handleToggleFilters}
              >
                <FilterIcon color={showFilters ? "#007AFF" : "#1A1D20"} />
              </Pressable>

              {/* Search Toggle Button */}
              <Pressable
                style={{ padding: 8 }}
                onPress={handleToggleSearch}
              >
                {showSearch ? <CloseIcon /> : <SearchIcon />}
              </Pressable>
            </View>
          ),
        }}
      />

      {!isSearching && showFilters ? (
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
            style={styles.scrollWrapper}
          >
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.value && activeState === "";
              return (
                <Pressable
                  key={cat.label}
                  style={[styles.tab, isSelected && styles.tabSelected]}
                  onPress={() => selectCategory(cat.value)}
                >
                  <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
            style={styles.scrollWrapperLast}
          >
            {states.map((st) => {
              const isSelected = activeState === st.value && activeCategory === "";
              return (
                <Pressable
                  key={st.label}
                  style={[styles.tab, isSelected && styles.tabSelected]}
                  onPress={() => selectState(st.value)}
                >
                  <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
                    {st.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}

      <FlatList
        data={articlesList}
        keyExtractor={(item) => item.id || item.url}
        renderItem={({ item, index }) => (
          <NewsCard
            article={item}
            index={index}
            onPress={() =>
              router.push({
                pathname: "/article/[id]",
                params: {
                  id: encodeURIComponent(item.id),
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
  headerSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 240,
    position: "relative",
  },
  headerSearchInput: {
    flex: 1,
    height: 36,
    backgroundColor: "#F2F3F5",
    borderRadius: 18,
    paddingLeft: 16,
    paddingRight: 32,
    fontSize: 14,
    color: "#1A1D20",
  },
  headerClearButton: {
    position: "absolute",
    right: 8,
    padding: 4,
  },
  filterSection: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EBF0F6",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  scrollWrapper: {
    marginBottom: 8,
  },
  scrollWrapperLast: {
    marginBottom: 0,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F3F5",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.02)",
  },
  tabSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#60646C",
  },
  tabTextSelected: {
    color: "#ffffff",
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