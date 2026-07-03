import { client } from "@/lib/apollo";
import { ApolloProvider } from "@apollo/client";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
  <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Latest News",
        }}
      />

      <Stack.Screen
        name="article/[id]"
        options={{
          title: "Article",
        }}
      />
    </Stack>
    </ApolloProvider>
  );
}