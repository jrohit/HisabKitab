import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Text,
  TextInput as PaperTextInput,
} from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { emailValidator, passwordValidator } from "../helpers/validators";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen({}) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const onLoginPressed = () => {
    setIsLoading(true);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setIsLoading(false);
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    axios
      .post("https://hisabkitabapi.onrender.com/login", {
        email: email.value,
        password: password.value,
      })
      .then((response) => {
        setIsLoading(false);
        AsyncStorage.setItem("userToken", response.data.token);
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      })
      .catch((error, res) => {
        setIsLoading(false);
        console.log("error ", error, res);
      });
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome</Header>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <TextInput
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <TextInput
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry={secureTextEntry}
            right={
              <PaperTextInput.Icon
                icon={secureTextEntry ? "eye-off" : "eye"}
                onPress={togglePasswordVisibility}
              />
            }
          />
          <Button mode="contained" onPress={onLoginPressed}>
            Login
          </Button>
          <View style={styles.forgotPassword}>
            <TouchableOpacity
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              <Text style={styles.forgot}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
