import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useQuery } from "@apollo/client";
import { router } from "expo-router";


import { SEARCH_NEWS } from "../graphql/queries";

export default function HomeScreen() {
  const [search, setSearch] = useState("");

  const { loading, error, data } = useQuery(
    SEARCH_NEWS,
    {
      variables: {
        search,
      },
    }
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <Text>
        Error: {error.message}
      </Text>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 50,
      }}
    >
      <TextInput
        placeholder="Search News..."
        value={search}
        onChangeText={setSearch}
        style={{
          margin: 15,
          padding: 12,
          borderWidth: 1,
          borderRadius: 10,
        }}
      />

      <FlatList
        data={data?.articles || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push(
                `/article/${item.id}`
              )
            }
            style={{
              marginHorizontal: 15,
              marginBottom: 20,
              backgroundColor: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              elevation: 3,
            }}
          >
            {item.image && (
              <Image
                source={{
                  uri: item.image,
                }}
                style={{
                  width: "100%",
                  height: 200,
                }}
              />
            )}

            <View
              style={{
                padding: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {item.title}
              </Text>

              <Text
                numberOfLines={2}
                style={{
                  marginTop: 5,
                }}
              >
                {item.description}
              </Text>

              <Text
                style={{
                  color: "gray",
                  marginTop: 10,
                }}
              >
                {item.source}
              </Text>

              <Text
                style={{
                  color: "gray",
                  fontSize: 12,
                  marginTop: 5,
                }}
              >
                {new Date(
                  item.publishedAt
                ).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}