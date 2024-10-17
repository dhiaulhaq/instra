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

const CreatePage = () => {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = () => {
    if (!caption || !imageUrl || !tags) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    const postData = {
      caption,
      imageUrl,
      tags: tags.split(",").map((tag) => tag.trim()), // Memisahkan tag berdasarkan koma
    };

    console.log("Post Data:", postData);
    Alert.alert("Success", "Your post has been created!");
    // Lakukan proses penyimpanan data ke backend
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Post</Text>

      <Text style={styles.label}>Caption</Text>
      <TextInput
        style={styles.input}
        placeholder="Write a caption..."
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <Text style={styles.label}>Tags (comma separated)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. nature, travel, photography"
        value={tags}
        onChangeText={setTags}
      />

      <View style={styles.buttonContainer}>
        <Button
          color="tomato"
          style={styles.buttonCreate}
          title="Create Post"
          onPress={handleSubmit}
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
