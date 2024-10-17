import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

const posts = [
  {
    id: "1",
    user: "johndoe",
    imageUrl: "https://picsum.photos/200/300",
    likes: 120,
    caption: "Loving the vibes here!",
  },
  {
    id: "2",
    user: "janedoe",
    imageUrl: "https://picsum.photos/200/300",
    likes: 200,
    caption: "Another beautiful day.",
  },
  {
    id: "3",
    user: "janedoe",
    imageUrl: "https://picsum.photos/200/300",
    likes: 200,
    caption: "Another beautiful day.",
  },
  {
    id: "4",
    user: "janedoe",
    imageUrl: "https://picsum.photos/200/300",
    likes: 200,
    caption: "Another beautiful day.",
  },
];

export default function HomePage() {
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      {/* User Section */}
      <View style={styles.userSection}>
        <Text style={styles.username}>{item.user}</Text>
      </View>

      {/* Post Image */}
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />

      {/* Post Interaction Section */}
      <View style={styles.interactionSection}>
        <TouchableOpacity>
          <Text style={styles.likes}>{item.likes} Likes</Text>
        </TouchableOpacity>
        <Text style={styles.caption}>
          <Text style={styles.username}>{item.user}</Text> {item.caption}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
  },
  userSection: {
    padding: 10,
  },
  username: {
    fontWeight: "bold",
  },
  postImage: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  interactionSection: {
    padding: 10,
  },
  likes: {
    fontWeight: "bold",
  },
  caption: {
    marginTop: 5,
  },
});
