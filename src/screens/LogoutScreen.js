import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Background from "../components/Background";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

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
            console.log(AsyncStorage.getItem("userToken"));
            AsyncStorage.removeItem("userToken");
            navigation.reset({
              index: 0,
              routes: [{ name: "StartScreen" }],
            });
            console.log(AsyncStorage.getItem("userToken"));
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
