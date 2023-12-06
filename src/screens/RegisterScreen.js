import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
  SafeAreaView,
} from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import {
  emailValidator,
  nameValidator,
  passwordValidator,
} from "../helpers/validators";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen({}) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [name, setName] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const onSignUp = () => {
    setIsLoading(true);
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError || nameError) {
      setIsLoading(false);
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setName({ ...name, error: nameError });
      return;
    }

    axios
      .post("http://192.168.29.57:8000/registerUser", {
        email: email.value,
        name: name.value,
        password: password.value,
      })
      .then((response) => {
        setIsLoading(false);
        Alert.alert("User Registered", "Email sent for verification");
        navigation.reset({
          index: 0,
          routes: [{ name: "StartScreen" }],
        });
      })
      .catch((error, res) => {
        setIsLoading(false);
        console.log("error ", error, res);
      });
  };

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? 70 : 0,
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Background>
        <BackButton goBack={navigation.goBack} />
        <Logo />
        <Header>Welcome</Header>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            <TextInput
              label="Name"
              returnKeyType="next"
              value={name.value}
              onChangeText={(text) => setName({ value: text, error: "" })}
              error={!!name.error}
              errorText={name.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
            />
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
              secureTextEntry
            />

            <Button mode="contained" onPress={onSignUp}>
              Sign Up
            </Button>
            <View style={styles.forgotPassword}>
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginScreen")}
              >
                <Text style={styles.forgot}>
                  Already Registered. Login Here
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Background>
    </SafeAreaView>
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
