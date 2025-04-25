import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";
import React, { useEffect } from "react";
import { Alert, StyleSheet } from "react-native";
import { API_URL } from "../../config";
import BottomTabs from "./BottomTabs";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import StartScreen from "./StartScreen";

const StackNavigator = () => {
  const Stack = createStackNavigator();
  const navigation = useNavigation();
  useEffect(() => {
    const validateAtInterval = setInterval(async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          await axios.post(`${API_URL}/validateToken`, {
            token,
          });
        }
      } catch (err) {
        Alert.alert("Token Expired", "Logged out!");
        AsyncStorage.removeItem("userToken");
        navigation.reset({
          index: 0,
          routes: [{ name: "StartScreen" }],
        });
        clearInterval(validateAtInterval);
      }
    }, 1000 * 60);

    return () => {
      clearInterval(validateAtInterval);
    };
  }, []);
  return (
    <>
      <Stack.Navigator
        initialRouteName="StartScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="StartScreen"
          component={StartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
