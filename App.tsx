
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./Admin/HomeScreen";
import UserLoginScreen from "./screens/UserLogin";
import ChooseScreen from "./screens/Choose";
import Onboard from "./screens/Onboard";
import AdminLogin from "./screens/AdminLogin";

// Define RootStackParamList
export type RootStackParamList = {
  Onboard: undefined;
  HOME: undefined;
  UserLogin: undefined;
  Choose: undefined;
  AdminLogin: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Onboard"
      >
        <Stack.Screen name="Onboard" component={Onboard} />
        <Stack.Screen name="HOME" component={HomeScreen} />
        <Stack.Screen name="UserLogin" component={UserLoginScreen} />
        <Stack.Screen name="Choose" component={ChooseScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLogin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
