import React, { useState } from "react";
import { View, StyleSheet, TextInput, FlatList } from "react-native";
import { Button, Text, Menu, IconButton } from "react-native-paper";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

const categories = ["Food", "Travel", "Family", "Treat"];

const ExpenseEntryScreen = ({ navigation, route }) => {
  const { expense, setExpenses } = route.params;
  const [entries, setEntries] = useState(expense?.entries || [{ id: 1, category: "", note: "", price: "" }]);
  const [visibleMenu, setVisibleMenu] = useState(null);

  const openMenu = (index) => setVisibleMenu(index);
  const closeMenu = () => setVisibleMenu(null);

  const updateEntry = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
  
    // Sort entries by price in descending order
    const sortedEntries = newEntries.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
  
    setEntries(sortedEntries);
  };

  const addRow = () => {
    setEntries([...entries, { id: Date.now(), category: "", note: "", price: "" }]);
  };

  const deleteRow = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
  };

  const calculateTotal = () =>
    entries.reduce((sum, entry) => sum + (parseFloat(entry.price) || 0), 0);

  const saveAndGoBack = () => {
    setExpenses((prev) => {
      const updatedExpenses = prev.filter((exp) => exp.date !== expense?.date);
      return [...updatedExpenses, { date: expense?.date || new Date().toDateString(), total: calculateTotal(), entries }];
    });
    navigation.goBack();
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <Swipeable
            renderRightActions={() => (
              <View style={styles.deleteButtonContainer}>
                <IconButton icon="delete" size={24} onPress={() => deleteRow(index)} />
              </View>
            )}
          >
            <View style={styles.row}>
              <Menu
                visible={visibleMenu === index}
                onDismiss={closeMenu}
                anchor={
                  <Button mode="outlined" onPress={() => openMenu(index)}>
                    {item.category || "Select Category"}
                  </Button>
                }
              >
                {categories.map((cat) => (
                  <Menu.Item
                    key={cat}
                    title={cat}
                    onPress={() => {
                      updateEntry(index, "category", cat);
                      closeMenu();
                    }}
                  />
                ))}
              </Menu>

              <TextInput
                style={styles.input}
                placeholder="Note"
                value={item.note}
                onChangeText={(text) => updateEntry(index, "note", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Price"
                keyboardType="numeric"
                value={item.price}
                onChangeText={(text) => updateEntry(index, "price", text)}
              />
            </View>
          </Swipeable>
        )}
        ListFooterComponent={
          <Button icon="plus" mode="contained" onPress={addRow} style={styles.addRowBtn}>
            Add Expense
          </Button>
        }
      />
      <Text variant="headlineSmall" style={styles.total}>
        Total: ₹{calculateTotal()}
      </Text>
      <Button mode="contained" onPress={saveAndGoBack} style={styles.saveBtn}>
        Save
      </Button>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  addRowBtn: { marginVertical: 10 },
  total: { textAlign: "right", marginVertical: 10 },
  saveBtn: { marginVertical: 10 },
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff6a74",
    paddingHorizontal: 10,
  },
});

export default ExpenseEntryScreen;
