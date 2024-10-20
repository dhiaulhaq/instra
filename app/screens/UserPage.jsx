import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_DETAIL } from "../queries";
import { DO_FOLLOW } from "../queries";
import { useFocusEffect, useRoute } from "@react-navigation/native";

const UserPage = ({ navigation }) => {
  const route = useRoute();
  const { userId } = route.params;

  const { loading, error, data, refetch } = useQuery(GET_USER_DETAIL, {
    variables: { userDetailId: userId },
    skip: !userId,
  });

  const [followUser, { loading: followLoading, error: followError }] =
    useMutation(DO_FOLLOW, {
      onCompleted: () => {
        refetch();
      },
    });

  const handleFollow = async () => {
    try {
      await followUser({
        variables: {
          input: {
            followingId: userId,
          },
        },
      });
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
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
      onPress={() =>
        navigation.navigate("UserPostDetail", { postId: item._id })
      }
    >
      <Image source={{ uri: item.imgUrl }} style={styles.postImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {user && (
        <>
          <View style={styles.headerContainer}>
            <Image
              source={{
                uri: `https://randomuser.me/api/portraits/lego/1.jpg`,
              }}
              style={styles.avatar}
            />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>@{user.username}</Text>

            {followLoading ? (
              <ActivityIndicator size="medium" color="tomato" />
            ) : (
              <>
                <TouchableOpacity
                  onPress={handleFollow}
                  disabled={followLoading}
                >
                  <Ionicons name="person-add-outline" size={30} />
                </TouchableOpacity>
                <Text>Follow/Unfollow</Text>
              </>
            )}
            {followError && (
              <Text style={styles.errorText}>Error following user</Text>
            )}
          </View>

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
              <Text style={styles.statNumber}>{user.Followings.length}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <FlatList
            data={user.Posts}
            keyExtractor={(item) => item._id}
            numColumns={3}
            renderItem={renderPost}
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
  headerContainer: {
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    color: "#888",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
  },
  postImage: {
    width: 120,
    height: 120,
    margin: 2,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default UserPage;
