import React, { useEffect, useState } from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { theme } from "./src/core/theme";
import StackNavigator from "./src/screens/StackNavigator";

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </Provider>
  );
}
