import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import CreatePage from "./CreatePage";

const Stack = createStackNavigator();

const { width } = Dimensions.get("window"); // Mengambil ukuran layar untuk membuat grid

const ProfilePage = ({ navigation }) => {
  const user = {
    name: "John Doe",
    username: "@johndoe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    followers: 200,
    following: 150,
    posts: 75,
  };

  const posts = [
    // Data dummy untuk postingan (gambar-gambar)
    { id: "1", imgUrl: "https://source.unsplash.com/random/1" },
    { id: "2", imgUrl: "https://source.unsplash.com/random/2" },
    { id: "3", imgUrl: "https://source.unsplash.com/random/3" },
    { id: "4", imgUrl: "https://source.unsplash.com/random/4" },
    { id: "5", imgUrl: "https://source.unsplash.com/random/5" },
    { id: "6", imgUrl: "https://source.unsplash.com/random/6" },
  ];

  const renderPost = ({ item }) => (
    <Image source={{ uri: item.imgUrl }} style={styles.postImage} />
  );

  const createPostButtonOnPressHandler = () => {
    navigation.navigate("CreatePost");
  };

  return (
    <View style={styles.container}>
      {/* Bagian Header Profile */}
      <View style={styles.headerContainer}>
        <View>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username}</Text>
        </View>
        <View style={styles.userInfoContainer}>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{user.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{user.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{user.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.profileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => createPostButtonOnPressHandler()}
            >
              <Text style={styles.newPostText}>New Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bagian Grid Postingan */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        numColumns={3} // Menampilkan grid dengan 3 kolom
        style={styles.postsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfoContainer: {
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  username: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  stat: {
    alignItems: "center",
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
  },
  buttonContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
  profileButton: {
    marginTop: 16,
    marginHorizontal: 5,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignSelf: "center",
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  newPostText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  postsContainer: {
    marginTop: 16,
  },
  postImage: {
    width: width / 3, // Membagi layar menjadi 3 kolom
    height: width / 3, // Membuat ukuran kotak sama dengan lebar
    margin: 1, // Jarak antar gambar
  },
});

export default ProfilePage;
