import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const posts = [
  {
    id: "1",
    user: "johndoe",
    imageUrl: "https://picsum.photos/200/300",
    likes: 120,
    comments: 15,
    caption: "Loving the vibes here!",
  },
  {
    id: "2",
    user: "janedoe",
    imageUrl: "https://picsum.photos/200/300",
    likes: 200,
    comments: 5,
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
        <View style={styles.intercationContainer}>
          <View style={styles.likeSection}>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.interactionText}> {item.likes}</Text>
          </View>
          <View style={styles.commentSection}>
            <TouchableOpacity>
              <Ionicons name="chatbubble-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.interactionText}> {item.comments}</Text>
          </View>
        </View>
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
  intercationContainer: {
    flexDirection: "row",
  },
  likeSection: {
    flexDirection: "row",
  },
  commentSection: {
    flexDirection: "row",
    marginLeft: 10,
  },
  interactionText: {
    fontWeight: "bold",
    alignSelf: "center",
  },
  caption: {
    marginTop: 5,
  },
});
