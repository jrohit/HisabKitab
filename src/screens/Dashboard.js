import React from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import Button from "../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Dashboard({ navigation }) {
  return (
    <Background>
      <Logo />
      <Header>Let’s start</Header>
      <Paragraph></Paragraph>
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
    </Background>
  );
}
