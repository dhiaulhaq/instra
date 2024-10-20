import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { DO_CREATE_POST } from "../queries";

const CreatePage = () => {
  const [content, setcontent] = useState("");
  const [imgUrl, setimgUrl] = useState("");
  const [tags, setTags] = useState("");

  const navigation = useNavigation();

  const [createPost, { loading, error }] = useMutation(DO_CREATE_POST, {
    onCompleted: (data) => {
      Alert.alert("Success", "Your post has been created!");
      setcontent("");
      setimgUrl("");
      setTags("");

      navigation.navigate("Home", { reload: true });
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to create post");
      console.log(error);
    },
  });

  const handleSubmit = () => {
    if (!content || !imgUrl || !tags) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    const postData = {
      content,
      imgUrl,
      tags: tags.split(",").map((tag) => tag.trim()),
    };

    createPost({
      variables: {
        input: postData,
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Post</Text>
      <Text style={styles.label}>content</Text>
      <TextInput
        style={styles.input}
        placeholder="Write a content..."
        value={content}
        onChangeText={setcontent}
        multiline
      />
      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter image URL"
        value={imgUrl}
        onChangeText={setimgUrl}
      />
      <Text style={styles.label}>Tags (comma separated)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. nature, travel, photography"
        value={tags}
        onChangeText={setTags}
      />
      {loading && <Text>Creating post...</Text>}
      {error && <Text>Error creating post</Text>}

      <View style={styles.buttonContainer}>
        <Button
          color="tomato"
          style={styles.buttonCreate}
          title="Create Post"
          onPress={handleSubmit}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 24,
  },
  buttonCreate: {
    color: "#fff",
  },
});

export default CreatePage;
