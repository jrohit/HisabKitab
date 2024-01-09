import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Chip, TextInput } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
// import { REACT_APP_API_URL } from "@env";

const Milk = () => {
  const [monthName, setMonthName] = useState(
    new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(Date.now())
  );
  const [day, setDay] = useState(
    new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
    }).format(Date.now())
  );
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

  const [isLoading, setIsLoading] = useState(false);

  const [currentRate] = useState(58);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalAmountForMonth, setTotalAmountForMonth] = useState(0);
  const [totalLitresForMonth, setTotalLitresForMonth] = useState(0);

  const [formData, setFormData] = useState({
    morningQuantity: "0",
    eveningQuantity: "0",
    total: 0,
  });
  const navigation = useNavigation();
  useEffect(() => {
    const total =
      parseFloat(formData.morningQuantity || 0) +
      parseFloat(formData.eveningQuantity || 0);
    setFormData({ ...formData, total });
    setTotalAmount(total * currentRate);
  }, [formData.eveningQuantity, formData.morningQuantity]);

  const handleChangeDate = (dateCounter) => {
    setIsLoading(true);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + dateCounter);
    const updatedDate = new Intl.DateTimeFormat("en-GB")
      .format(date)
      .split("/");
    setDay(updatedDate[0]);
    setMonth(updatedDate[1]);
    setYear(updatedDate[2]);
    setMonthName(
      new Intl.DateTimeFormat("en-US", {
        month: "long",
      }).format(date)
    );
  };

  useEffect(() => {
    const fetchMilkDataForMonth = async () => {
      setTotalAmountForMonth(0);
      setTotalLitresForMonth(0);
      const token = await AsyncStorage.getItem("userToken");
      try {
        const { data } = await axios.get(
          `https://hisabkitabapi.onrender.com/getMilkDataForMonth?month=${month}&year=${year}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setTotalAmountForMonth(data?.totalAmount || 0);
        setTotalLitresForMonth(data?.totalLitres || 0);
      } catch (error) {
        console.log("error occurred while fetching milk data ", error);
      }
    };
    fetchMilkDataForMonth();
  }, [monthName]);

  useEffect(() => {
    const fetchMilkData = async () => {
      const token = await AsyncStorage.getItem("userToken");
      try {
        const { data } = await axios.get(
          `https://hisabkitabapi.onrender.com/getMilkDataForDay?day=${day}&month=${month}&year=${year}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        const fData = {
          total: data.total || 0,
          morningQuantity: "" + (data.morningQuantity || "0"),
          eveningQuantity: "" + (data.eveningQuantity || "0"),
        };
        setFormData(fData);
        setIsLoading(false);
      } catch (error) {
        console.log("error occurred while fetching milk data ", error);
      }
    };
    fetchMilkData();
  }, [day, month, year]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const payload = {
      ...formData,
      day,
      month,
      year,
      currentRate,
      totalAmount,
    };
    axios
      .post(
        "https://hisabkitabapi.onrender.com/addUpdateMilkQuantity",
        payload,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        setIsLoading(false);
        Alert.alert("Entry Saved", "Data Saved Successfully!");
        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: "Milk" }],
        // });
      })
      .catch((error, res) => {
        Alert.alert("Error", "Data Not Saved Successfully!");
        console.log("error ", { ...error }, res);
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
      <ScrollView>
        <View
          style={{
            backgroundColor: "#00CED1",
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
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
              Milk
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        ></View>
        <View
          style={{
            backgroundColor: "#AFEEEE",
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginLeft: 20,
              fontSize: 15,
            }}
          >
            Current Month
          </Text>
          <Text
            style={{
              marginLeft: 20,
              fontSize: 22,
            }}
          >
            <Chip mode="outlined" onPress={() => console.log("Pressed")}>
              {monthName}
            </Chip>
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#AFEEEE",
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginLeft: 20,
              fontSize: 15,
            }}
          >
            Current Rate
          </Text>
          <Text
            style={{
              marginLeft: 20,
              fontSize: 22,
            }}
          >
            <Chip mode="outlined" onPress={() => console.log("Pressed")}>
              {currentRate}
            </Chip>
          </Text>
          <MaterialCommunityIcons name="currency-inr" size={24} color="black" />
        </View>
        <View
          style={{
            backgroundColor: "#AFEEEE",
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginLeft: 20,
              fontSize: 15,
            }}
          >
            Total Amount in {monthName}
          </Text>
          <Text
            style={{
              marginLeft: 20,
              fontSize: 22,
            }}
          >
            <Chip mode="outlined" onPress={() => console.log("Pressed")}>
              {totalAmountForMonth}
            </Chip>
          </Text>
          <MaterialCommunityIcons name="currency-inr" size={24} color="black" />
        </View>
        <View
          style={{
            backgroundColor: "#AFEEEE",
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginLeft: 20,
              fontSize: 15,
            }}
          >
            Total Litres in {monthName}
          </Text>
          <Text
            style={{
              marginLeft: 20,
              fontSize: 22,
            }}
          >
            <Chip mode="outlined" onPress={() => console.log("Pressed")}>
              {totalLitresForMonth}
            </Chip>
          </Text>
          <MaterialCommunityIcons name="tea-outline" size={30} color="black" />
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
                day: "2-digit",
              }).format(new Date(year, month - 1, day))}
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
        {isLoading ? (
          <>
            <View
              style={{
                marginVertical: 10,
              }}
            >
              <ActivityIndicator />
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                margin: 20,
              }}
            >
              <Text style={styles.label}>Morning</Text>
              <TextInput
                style={styles.input}
                placeholder="Morning Quantity"
                value={formData.morningQuantity}
                onChangeText={(text) =>
                  handleInputChange("morningQuantity", text)
                }
                keyboardType="numeric"
              />

              <Text style={styles.label}>Evening</Text>
              <TextInput
                style={styles.input}
                placeholder="Evening Quantity"
                value={formData.eveningQuantity}
                onChangeText={(text) =>
                  handleInputChange("eveningQuantity", text)
                }
                keyboardType="numeric"
              />

              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 20,
                }}
              >
                <Text style={styles.label}>Total</Text>
                <Text
                  style={{
                    paddingVertical: 3,
                    marginHorizontal: 10,
                    fontWeight: "bold",
                  }}
                >
                  {formData.total} L || {totalAmount}
                </Text>
                <MaterialCommunityIcons
                  style={{
                    paddingVertical: 3,
                  }}
                  name="currency-inr"
                  size={24}
                  color="black"
                />
              </View>
              <Button title="Submit" onPress={handleSubmit} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default Milk;
