import React from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import { theme } from "../core/theme";
import Paragraph from "../components/Paragraph";
import { Text, TouchableOpacity, View } from "react-native";

export default function StartScreen({ navigation }) {
  return (
    <Background>
      <Logo />
      <Header>Login to Hisab Kitab</Header>
      <Paragraph>The easiest way to manage Milk, Water Bills</Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("LoginScreen")}
      >
        Login
      </Button>

      <View
        style={{
          flexDirection: "row",
          marginTop: 4,
        }}
      >
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("RegisterScreen")}>
          <Text
            style={{
              fontWeight: "bold",
              color: theme.colors.primary,
            }}
          >
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}
