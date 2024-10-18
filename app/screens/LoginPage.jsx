import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { LoginContext } from "../contexts/LoginContext";

const LoginPage = ({ navigation }) => {
  const { setIsLoggedIn } = useContext(LoginContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in both username and password.");
      return;
    }

    // Simulasi proses login
    if (username === "testuser" && password === "password123") {
      Alert.alert("Success", "Login successful!");
      setIsLoggedIn(true);
      // navigation.navigate("Home"); // Setelah login, pindah ke halaman Home
    } else {
      Alert.alert("Error", "Invalid username or password.");
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate("Register"); // Navigasi ke halaman Register
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color={"tomato"} />
      </View>

      <Text style={styles.registerText}>Don't have an account?</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Register Here"
          onPress={handleNavigateToRegister}
          color={"blue"} // Tombol berwarna biru untuk membuka halaman Register
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
});

export default LoginPage;
