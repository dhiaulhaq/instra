import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { LoginContext } from "../contexts/LoginContext";
import { useMutation } from "@apollo/client";
import { DO_LOGIN } from "../queries";
import * as SecureStore from "expo-secure-store";

const LoginPage = ({ navigation }) => {
  const { setIsLoggedIn } = useContext(LoginContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [userLogin, { data, loading, error }] = useMutation(DO_LOGIN, {
    onCompleted: async (res) => {
      let token = null;
      let userId = null;

      if (
        res &&
        res.userLogin &&
        res.userLogin.data &&
        res.userLogin.data.token &&
        res.userLogin.data.userId
      ) {
        token = res.userLogin.data.token;
        userId = res.userLogin.data.userId;

        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("userId", userId);

        setIsLoggedIn(true);
        Alert.alert("Success", "Login successful!");
      } else {
        Alert.alert(
          "Error",
          "Login failed: " + (res.userLogin.message || "Unknown error")
        );
      }
    },
    onError: () => {
      Alert.alert("Error", "Invalid username or password.");
    },
  });

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in both username and password.");
      return;
    }

    await userLogin({
      variables: {
        username,
        password,
      },
    });
  };

  const handleNavigateToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Text style={styles.label}>Username</Text>
      {loading ? (
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          editable={false}
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />
      )}

      <Text style={styles.label}>Password</Text>
      {loading ? (
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          editable={false}
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      )}

      <View style={styles.buttonContainer}>
        {loading ? (
          <Button title="Loading..." disabled color={"tomato"} />
        ) : (
          <Button title="Login" onPress={handleLogin} color={"tomato"} />
        )}
      </View>

      <Text style={styles.registerText}>Don't have an account?</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Register Here"
          onPress={handleNavigateToRegister}
          color={"blue"}
        />
      </View>
    </View>
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
    marginTop: 12,
  },
  registerText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
    color: "#333",
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

export default LoginPage;
