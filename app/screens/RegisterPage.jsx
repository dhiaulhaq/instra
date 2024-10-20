import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { LoginContext } from "../contexts/LoginContext";
import { useMutation } from "@apollo/client";
import { DO_REGISTER } from "../queries";
import { ScrollView } from "react-native-gesture-handler";

const RegisterPage = ({ navigation }) => {
  const { setIsLoggedIn } = useContext(LoginContext);
  const [fullname, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [dispatcher] = useMutation(DO_REGISTER, {
    onCompleted: (res) => {
      console.log("res", res);
      setLoading(false);
      Alert.alert("Success", "Registration successful!");
      navigation.goBack();
    },
    onError: (err) => {
      console.log(err);
      setLoading(false);
      Alert.alert("Error", "Registration failed.");
    },
  });

  const handleRegister = () => {
    if (!username || !password || !confirmPassword || !email || !fullname) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);

    dispatcher({
      variables: {
        input: {
          name: fullname,
          username,
          email,
          password,
        },
      },
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={fullname}
          onChangeText={setFullName}
          editable={!loading}
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          editable={!loading}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={!loading}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? "Loading..." : "Register"}
            onPress={handleRegister}
            color={"tomato"}
            disabled={loading}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
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
});

export default RegisterPage;
