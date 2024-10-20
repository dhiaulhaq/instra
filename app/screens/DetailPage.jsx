import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useMutation, useQuery } from "@apollo/client";
import { GET_POST_DETAIL, DO_COMMENT_POST, DO_LIKE_POST } from "../queries";
import { useFocusEffect } from "@react-navigation/native";

const DetailPage = ({ route }) => {
  const { postId } = route.params;
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likePost] = useMutation(DO_LIKE_POST);

  const { loading, error, data, refetch } = useQuery(GET_POST_DETAIL, {
    variables: { postDetailId: postId },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const [doCommentPost] = useMutation(DO_COMMENT_POST, {
    refetchQueries: [
      { query: GET_POST_DETAIL, variables: { postDetailId: postId } },
    ],
  });

  const handleLikePress = async (postId) => {
    try {
      setLikeLoading(true);
      console.log("Liking post:", { postId });
      await likePost({
        variables: { input: { postId } },
      });
      refetch();
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim() === "") {
      return;
    }

    try {
      setCommentLoading(true);
      await doCommentPost({
        variables: {
          input: {
            postId: postId,
            content: commentText,
          },
        },
      });
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="tomato" />;
  if (error) return <Text>Error loading post details</Text>;

  const post = data?.postDetail;

  return (
    <View style={styles.container}>
      <Image source={{ uri: post.imgUrl }} style={styles.image} />
      <View style={styles.containerLike}>
        <Text style={styles.content}>{post.content}</Text>
        <TouchableOpacity onPress={() => handleLikePress(post._id)}>
          {likeLoading ? (
            <ActivityIndicator size="small" color="tomato" />
          ) : (
            <Ionicons name="heart" size={25} />
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.likes}>{post.likes.length} likes</Text>
      <Text style={styles.tags}>Tags: {post.tags.join(", ")}</Text>
      <Text style={styles.author}>Posted by: {post.Author.username}</Text>

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity
          style={styles.commentButton}
          onPress={handleCommentSubmit}
          disabled={commentLoading}
        >
          {commentLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.commentButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.commentsTitle}>Comments:</Text>

      <FlatList
        style={{ flex: 1 }}
        data={post.comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Text style={styles.commentAuthor}>{item.username}</Text>
            <Text style={styles.commentText}>{item.content}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noComments}>No comments yet</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  containerLike: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 5,
    marginBottom: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  content: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tags: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  likes: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  createdAt: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 16,
  },
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  commentAuthor: {
    fontWeight: "bold",
    fontSize: 14,
  },
  commentText: {
    fontSize: 14,
    marginTop: 5,
  },
  noComments: {
    textAlign: "center",
    marginVertical: 20,
    color: "#888",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  commentButton: {
    backgroundColor: "tomato",
    borderRadius: 10,
    padding: 10,
  },
  commentButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  commentsTitle: {
    marginVertical: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DetailPage;
