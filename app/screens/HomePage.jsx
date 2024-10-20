import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useMutation, useQuery } from "@apollo/client";
import { GET_POSTS, DO_LIKE_POST } from "../queries";
import { useFocusEffect } from "@react-navigation/native";

export default function HomePage({ route, navigation }) {
  const { loading, error, data, refetch } = useQuery(GET_POSTS);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (route.params?.reload) {
      refetch();
    }
  }, [route.params?.reload]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error fetching posts!</Text>
      </View>
    );
  }

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.userSection}>
        <Text style={styles.username}>
          {item.Author?.username || "Unknown Author"}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Detail", { postId: item._id })}
      >
        <Image source={{ uri: item.imgUrl }} style={styles.postImage} />
      </TouchableOpacity>

      <View style={styles.interactionSection}>
        <View style={styles.intercationContainer}>
          <View style={styles.likeSection}>
            <Ionicons name={"heart-outline"} size={24} />
            <TouchableOpacity
              onPress={() => handleLikePress(item._id)}
            ></TouchableOpacity>
          </View>
          <View style={styles.commentSection}>
            <Ionicons name="chatbubble-outline" size={24} color="black" />
          </View>
        </View>
        <Text style={styles.caption}>
          <Text style={styles.username}>
            {item.Author?.username || "Unknown Author"}
          </Text>{" "}
          {item.content}
        </Text>
        <Text style={styles.seeMore}>Click image to see more...</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={data?.postFetchAll || []}
      renderItem={renderPost}
      keyExtractor={(item) => item._id}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
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
  seeMore: {
    color: "#888",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
