import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import Background from "../components/Background";
import Button from "../components/Button";
import Header from "../components/Header";
import Logo from "../components/Logo";
import Paragraph from "../components/Paragraph";

export default function Dashboard({ navigation }) {
  return (
    <Background>
      <Logo />
      <Header>Let’s start</Header>
      <Paragraph></Paragraph>
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
    </Background>
  );
}
