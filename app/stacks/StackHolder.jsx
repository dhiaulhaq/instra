import * as SecureStore from "expo-secure-store";
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
import DetailPage from "../screens/DetailPage";
import CreatePage from "../screens/CreatePage";
import LoginPage from "../screens/LoginPage";
import RegisterPage from "../screens/RegisterPage";
import UserPage from "../screens/UserPage";
import { TouchableOpacity } from "react-native-gesture-handler";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStackNavigation = ({ navigation }) => {
  const createOnPressHandler = () => {
    navigation.navigate("Create");
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{
          headerTitle: "Home",
          headerRight: () => (
            <View>
              <TouchableOpacity
                onPress={createOnPressHandler}
                style={styles.logoutBtn}
              >
                <Ionicons name="add-circle-outline" size={25} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailPage}
        options={{
          headerTitle: "Detail Post",
        }}
      />
      <Stack.Screen
        name="Create"
        component={CreatePage}
        options={{
          headerTitle: "New Post",
        }}
      />
    </Stack.Navigator>
  );
};

const SearchStackNavigation = ({ navigation, route }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={SearchPage}
        options={{
          headerTitle: "Search",
        }}
      />
      <Stack.Screen
        name="User"
        component={UserPage}
        options={{
          headerTitle: "User",
        }}
      />
      <Stack.Screen
        name="UserPostDetail"
        component={DetailPage}
        options={{
          headerTitle: "Detail Post",
        }}
      />
    </Stack.Navigator>
  );
};

const ProfileStackNavigation = ({ navigation, route }) => {
  const { setIsLoggedIn } = useContext(LoginContext);
  const userId = route?.params?.userId;

  const logoutOnPressHandler = async () => {
    console.log("Logout Pressed");

    await SecureStore.deleteItemAsync("token");

    setIsLoggedIn(false);
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfilePage}
        initialParams={{ userId: userId }}
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
      {/* <Stack.Screen
        name="CreatePost"
        component={CreatePage}
        options={{
          headerTitle: "New Post",
        }}
      ></Stack.Screen> */}
      <Stack.Screen
        name="PostDetail"
        component={DetailPage}
        options={{
          headerTitle: "Detail Post",
        }}
      />
    </Stack.Navigator>
  );
};

const MainNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeNavigation") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "SearchNavigation") {
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
      <Tab.Screen
        name="HomeNavigation"
        component={HomeStackNavigation}
        options={{
          headerShown: false,
          headerTitle: "Home Tab",
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="SearchNavigation"
        component={SearchStackNavigation}
        options={{
          headerShown: false,
          headerTitle: "Search Tab",
          tabBarLabel: "Search",
        }}
      />
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
  const { isLoggedIn } = useContext(LoginContext);

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
