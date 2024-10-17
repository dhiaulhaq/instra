import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import client from './config/apollo';

import HomePage from './screens/HomePage';
import SearchPage from './screens/SearchPage';
import ProfilePage from './screens/ProfilePage';
import CreatePage from './screens/CreatePage';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ProfileStackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          headerTitle: "Profile"
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="CreatePost"
        component={CreatePage}
        options={{
          headerTitle: "New Post"
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  )
}

const MainNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused
              ? "home"
              : "home-outline";
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
      <Tab.Screen
        name="Home"
        component={HomePage}
      />
      <Tab.Screen
        name="Search"
        component={SearchPage}
      />
      <Tab.Screen
        name="ProfileNavigation"
        component={ProfileStackNavigation}
        options={{
          headerShown: false,
          headerTitle: "Profile Tab",
          tabBarLabel: "Profile"
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </ApolloProvider>
  );
}