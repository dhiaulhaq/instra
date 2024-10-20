import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { GET_USER_DETAIL } from "../queries/index";

const { width } = Dimensions.get("window");

const ProfilePage = ({ route, navigation }) => {
  const [userId, setUserId] = useState(null);
  const { searchId } = route.params;

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await SecureStore.getItemAsync("userId");
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const { loading, error, data, refetch } = useQuery(GET_USER_DETAIL, {
    variables: { userDetailId: userId },
    skip: !userId,
  });

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        console.log(route);
        refetch();
      }
    }, [userId])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading profile</Text>
      </View>
    );
  }

  const user = data?.userDetail;

  const renderPost = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("PostDetail", { postId: item._id })}
    >
      <Image source={{ uri: item.imgUrl }} style={styles.postImage} />
    </TouchableOpacity>
  );

  // const createPostButtonOnPressHandler = () => {
  //   navigation.navigate("CreatePost");
  // };

  return (
    <View style={styles.container}>
      {user && (
        <>
          <View style={styles.headerContainer}>
            <View>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/lego/1.jpg",
                }}
                style={styles.avatar}
              />

              <Text style={styles.username}>@{user.username}</Text>
            </View>
            <View style={styles.userInfoContainer}>
              <Text style={styles.name}>{user.name}</Text>
              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{user.Posts.length}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{user.Followers.length}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>
                    {user.Followings.length}
                  </Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>
              {/* <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.profileButton}
                  onPress={createPostButtonOnPressHandler}
                >
                  <Text style={styles.newPostText}>New Post</Text>
                </TouchableOpacity>
              </View> */}
            </View>
          </View>

          <FlatList
            data={user.Posts}
            renderItem={renderPost}
            keyExtractor={(item) => item._id}
            numColumns={3}
            style={styles.postsContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No posts available</Text>
            }
          />
        </>
      )}
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
    textAlign: "center",
    marginTop: 10,
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
    width: width / 3,
    height: width / 3,
    margin: 1,
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
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
});

export default ProfilePage;
