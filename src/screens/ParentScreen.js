import React from "react";
import { SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ParentScreen = ({ children }) => {
  return (
    <SafeAreaView
      style={{
        // paddingTop: Platform.OS === "android" ? 20 : 0,
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <KeyboardAwareScrollView>{children}</KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ParentScreen;
