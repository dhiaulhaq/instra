import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLazyQuery } from "@apollo/client";
import { GET_USERS_SEARCH } from "../queries";
import { useNavigation } from "@react-navigation/native";

const SearchPage = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  const [searchUsers, { loading, data, error }] =
    useLazyQuery(GET_USERS_SEARCH);

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim().length > 0) {
      searchUsers({ variables: { keyword: text } });
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (data && data.userSearch) {
      setSearchResults(data.userSearch);
    }
  }, [data]);

  const handleUserPress = (userId) => {
    navigation.navigate("User", { userId: userId });
  };

  if (error) {
    return <Text>Error loading data</Text>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchText}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="tomato" />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userContainer}
              onPress={() => handleUserPress(item._id)}
            >
              <Text style={styles.username}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            searchText.trim().length > 0 ? (
              <Text style={styles.emptyText}>No results found</Text>
            ) : null
          }
        />
      )}
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
