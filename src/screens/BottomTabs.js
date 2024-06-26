import { StyleSheet } from "react-native";
import React from "react";
import Dashboard from "../screens/Dashboard";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Milk from "./Milk";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Water from "./Water";
import LogoutScreen from "./LogoutScreen";
import Transactions from "./TransactionScreen";

const BottomTabs = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Milk"
        component={Milk}
        options={{
          tabBarLabel: "Milk",
          headerShown: false,
          tabBarLabelStyle: { color: "#008E97" },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="bottle-tonic"
                size={24}
                color="black"
              />
            ) : (
              <MaterialCommunityIcons
                name="bottle-tonic-outline"
                size={24}
                color="black"
              />
            ),
        }}
      />

      <Tab.Screen
        name="Water"
        component={Water}
        options={{
          headerShown: false,
          tabBarLabelStyle: { color: "#008E97" },
          tabBarLabel: "Water",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="water" size={24} color="black" />
            ) : (
              <Ionicons name="water-outline" size={24} color="black" />
            ),
        }}
      />

      <Tab.Screen
        name="Stats"
        component={Transactions}
        options={{
          tabBarLabel: "Monthly View",
          headerShown: false,
          tabBarLabelStyle: { color: "#008E97" },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="pie-chart" size={24} color="black" />
            ) : (
              <Ionicons name="pie-chart-outline" size={24} color="black" />
            ),
        }}
      />

      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          tabBarLabelStyle: { color: "#008E97" },
          tabBarLabel: "Logout",
          headerShown: false,
          tabBarIcon: () => (
            <MaterialIcons name="logout" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({});
