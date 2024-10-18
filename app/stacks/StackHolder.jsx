import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

import { LoginContext } from "../contexts/LoginContext";

import HomePage from "../screens/HomePage";
import SearchPage from "../screens/SearchPage";
import ProfilePage from "../screens/ProfilePage";
import CreatePage from "../screens/CreatePage";
import LoginPage from "../screens/LoginPage";
import RegisterPage from "../screens/RegisterPage";
import { TouchableOpacity } from "react-native-gesture-handler";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ProfileStackNavigation = ({ navigation }) => {
  const { setIsLoggedIn } = useContext(LoginContext); // Akses context di sini

  const logoutOnPressHandler = async () => {
    console.log("Logout Pressed");

    // ?? Remove token from SecureStore if needed
    // await SecureStore.deleteItemAsync("token");

    // Set isLoggedIn to false
    setIsLoggedIn(false);

    // No need to navigate explicitly, context will handle it
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          headerTitle: "Profile",
          headerRight: () => (
            <View>
              <TouchableOpacity
                onPress={logoutOnPressHandler}
                style={styles.logoutBtn}
              >
                <Ionicons name="log-out-outline" size={25} />
              </TouchableOpacity>
            </View>
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="CreatePost"
        component={CreatePage}
        options={{
          headerTitle: "New Post",
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

const MainNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "ProfileNavigation") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        // title: ''
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Search" component={SearchPage} />
      <Tab.Screen
        name="ProfileNavigation"
        component={ProfileStackNavigation}
        options={{
          headerShown: false,
          headerTitle: "Profile Tab",
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  logoutBtn: {
    marginRight: 10,
  },
});

const StackHolder = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainNavigation />
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Register" component={RegisterPage} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default StackHolder;
