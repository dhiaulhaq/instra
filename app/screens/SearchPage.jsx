import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

const SearchPage = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([
    // Contoh data hasil pencarian
    {
      id: "1",
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: "2",
      name: "Jane Smith",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: "3",
      name: "Mark Johnson",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: "4",
      name: "Lucy Brown",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
  ]);

  const handleSearch = (text) => {
    setSearchText(text);
    // Lakukan filter dari hasil pencarian (simulasi)
    const filteredResults = searchResults.filter((user) =>
      user.name.toLowerCase().includes(text.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userContainer}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No results found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#999",
  },
});

export default SearchPage;
