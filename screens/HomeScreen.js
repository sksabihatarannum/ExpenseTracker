import React, { useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { FAB, Card, Text, IconButton, Button } from "react-native-paper";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { Calendar } from "react-native-calendars";

const HomeScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [isCalendarVisible, setCalendarVisible] = useState(false);

  const handleOpenExpense = (expense) => {
    navigation.navigate("ExpenseEntry", { expense, setExpenses });
  };

  const deleteExpense = (date) => {
    setExpenses(expenses.filter((exp) => exp.date !== date));
  };

  const handleDateSelect = (date) => {
    setCalendarVisible(false); // Close the calendar
    const selectedDate = new Date(date.dateString).toDateString(); // Format: "Sat Feb 01 2025"

    // Check if an expense entry already exists for the selected date
    const existingExpense = expenses.find((exp) => exp.date === selectedDate);

    if (existingExpense) {
      // Navigate to the existing expense entry
      navigation.navigate("ExpenseEntry", { expense: existingExpense, setExpenses });
    } else {
      // Navigate to a new expense entry for the selected date
      navigation.navigate("ExpenseEntry", {
        expense: { date: selectedDate, total: 0, entries: [] },
        setExpenses,
      });
    }
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

      {/* Calendar Modal */}
      <Modal visible={isCalendarVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={expenses.reduce((acc, exp) => {
                acc[exp.date] = { marked: true, dotColor: "#00adf5" };
                return acc;
              }, {})}
            />
            <Button mode="outlined" onPress={() => setCalendarVisible(false)}>
              Close
            </Button>
          </View>
        </View>
      </Modal>

      {/* FAB to open calendar */}
      <FAB style={styles.fab} icon="plus" onPress={() => setCalendarVisible(true)} />
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  calendarContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    width: "90%",
  },
});

export default HomeScreen;