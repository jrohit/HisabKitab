import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import Background from "../components/Background";

const LogoutScreen = () => {
  const navigation = useNavigation();
  return (
    <Background>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Are you sure want to Logout?</Text>
        <Button
          mode="outlined"
          onPress={() => {
            AsyncStorage.removeItem("userToken");
            navigation.reset({
              index: 0,
              routes: [{ name: "StartScreen" }],
            });
          }}
        >
          Logout
        </Button>
      </View>
    </Background>
  );
};

export default LogoutScreen;

const styles = StyleSheet.create({});
