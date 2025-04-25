import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { ActivityIndicator, Chip, Text } from "react-native-paper";
import { API_URL } from "../../config";
import ParentScreen from "./ParentScreen";
import TransactionTableView from "./TransactionTableView";

const Transactions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  const [month, setMonth] = useState(
    new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
    }).format(Date.now())
  );
  const [year, setYear] = useState(
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
    }).format(Date.now())
  );

  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const token = await AsyncStorage.getItem("userToken");
    axios
      .get(
        `${API_URL}/fetchMilkTransactionsForMonth?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        setIsLoading(false);
        setTransactions(response?.data ?? []);
      })
      .catch((error, res) => {
        setIsLoading(false);
        Alert.alert("Error", "Error occurred while fetching Data");
        setTransactions([]);
        console.log("error ", { ...error }, res);
      });
  };

  useEffect(() => {
    if (!isFocused) {
      setIsLoading(true);
      setMonth(
        new Intl.DateTimeFormat("en-US", {
          month: "2-digit",
        }).format(Date.now())
      );
      setYear(
        new Intl.DateTimeFormat("en-US", {
          year: "numeric",
        }).format(Date.now())
      );
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      fetchTransactions();
    } else {
      setIsLoading(true);
    }
  }, [isFocused, month, year]);

  const handleChangeDate = (dateCounter) => {
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() + dateCounter);
    const updatedDate = new Intl.DateTimeFormat("en-GB")
      .format(date)
      .split("/");
    setIsLoading(true);
    setMonth(updatedDate[1]);
    setYear(updatedDate[2]);
  };

  return (
    <ParentScreen>
      <ScrollView>
        <View
          style={{
            backgroundColor: "#00CED1",
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: 7,
              gap: 10,
              borderRadius: 3,
              height: 40,
              flex: 1,
            }}
            onPress={() => {
              console.log("Header pressed");
            }}
          >
            <Text
              style={{
                fontWeight: "800",
                fontSize: 25,
              }}
            >
              View Monthly Records
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            backgroundColor: "#AFEEEE",
            padding: 10,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              marginLeft: 20,
            }}
            variant="titleMedium"
          >
            Showing Transactions for Month
          </Text>
          <Text
            style={{
              marginLeft: 40,
            }}
          ></Text>
        </View>
        <View
          style={{
            backgroundColor: "#AFEEEE",
            padding: 5,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginLeft: 15,
              fontSize: 15,
            }}
            onPress={() => {
              handleChangeDate(-1);
            }}
          >
            <MaterialIcons name="skip-previous" size={24} color="black" />
          </Text>
          <Text
            style={{
              marginHorizontal: 20,
              fontSize: 22,
            }}
          >
            <Chip mode="outlined" onPress={() => console.log("Pressed")}>
              {new Intl.DateTimeFormat("en-GB", {
                month: "long",
                year: "numeric",
              }).format(new Date(year, month - 1))}
            </Chip>
          </Text>
          <Text
            style={{
              marginLeft: 20,
              fontSize: 15,
            }}
            onPress={() => {
              handleChangeDate(1);
            }}
          >
            <MaterialIcons name="skip-next" size={24} color="black" />
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#AFEEEE",
            padding: 10,
            flexDirection: "row",
          }}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <TransactionTableView transactions={transactions} />
          )}
        </View>
      </ScrollView>
    </ParentScreen>
  );
};

export default Transactions;
