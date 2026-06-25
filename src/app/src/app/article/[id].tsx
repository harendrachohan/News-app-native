import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    View,
} from "react-native";

import { useQuery } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";

import { GET_ARTICLE } from "../../../../graphql/queries";

export default function ArticleDetails() {
  const { id } = useLocalSearchParams();

  const { data, loading } =
    useQuery(GET_ARTICLE, {
      variables: {
        id,
      },
    });

  if (loading) {
    return <ActivityIndicator />;
  }

  const article = data.article;

  return (
    <ScrollView>
      <Image
        source={{
          uri: article.image,
        }}
        style={{
          height: 250,
          width: "100%",
        }}
      />

      <View
        style={{
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          {article.title}
        </Text>

        <Text>
          {article.source}
        </Text>

        <Text>
          {article.category}
        </Text>

        <Text>
          {article.publishedAt}
        </Text>

        <Text
          style={{
            marginTop: 20,
            lineHeight: 28,
          }}
        >
          {article.content}
        </Text>
      </View>
    </ScrollView>
  );
}