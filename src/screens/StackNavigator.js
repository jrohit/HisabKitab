import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StartScreen from "./StartScreen";
import LoginScreen from "./LoginScreen";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomTabs from "./BottomTabs";

const StackNavigator = () => {
  const Stack = createStackNavigator();
  const navigation = useNavigation();
  useEffect(() => {
    const validateAtInterval = setInterval(async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          await axios.post("https://hisabkitabapi.onrender.com/validateToken", {
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
