import React, { useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { FAB, Card, Text, IconButton } from "react-native-paper";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

const HomeScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);

  const handleOpenExpense = (expense) => {
    navigation.navigate("ExpenseEntry", { expense, setExpenses });
  };

  const deleteExpense = (date) => {
    setExpenses(expenses.filter((exp) => exp.date !== date));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <View style={styles.deleteButtonContainer}>
                <IconButton icon="delete" size={24} onPress={() => deleteExpense(item.date)} />
              </View>
            )}
          >
            <TouchableOpacity onPress={() => handleOpenExpense(item)}>
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="titleMedium">{item.date}</Text>
                  <Text variant="bodyMedium">Total: ₹{item.total}</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </Swipeable>
        )}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate("ExpenseEntry", { setExpenses })}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 10 },
  fab: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center", // Centers the button horizontally
  },
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff6a74",
    paddingHorizontal: 10,
  },
});

export default HomeScreen;
