import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "News",
        }}
      />

      <Stack.Screen
        name="article/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}