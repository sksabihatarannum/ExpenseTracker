import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import HomeScreen from "./screens/HomeScreen";
import ExpenseEntryScreen from "./screens/ExpenseEntryScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ExpenseEntry" component={ExpenseEntryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
