import React, { useCallback, useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Chip } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Alert,
  Button,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import axios from "axios";
import { CalendarList } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cloneDeep, has } from "lodash";
import ParentScreen from "./ParentScreen";

const Water = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentWaterRate] = useState(20);
  const [totalAmountForMonth, setTotalAmountForMonth] = useState(0);
  const [totalQuantityForMonth, setTotalQuantityForMonth] = useState(0);
  const [waterDatesStyle] = useState({
    selected: true,
    marked: true,
    selectedColor: "#4ba4f4",
  });
  const [markedDates, setMarkedDates] = useState({
    [new Intl.DateTimeFormat("en-CA").format(new Date())]: waterDatesStyle,
  });
  const [waterBottleQuantity, setWaterBottleQuantity] = useState("1");
  const [monthName, setMonthName] = useState(
    new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(Date.now())
  );
  const [day, setDay] = useState(
    new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
    }).format(new Date())
  );
  const [month, setMonth] = useState(
    new Intl.DateTimeFormat("en-CA", {
      month: "2-digit",
    }).format(new Date())
  );
  const [year, setYear] = useState(
    new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
    }).format(new Date())
  );

  const dayPressHandler = (e) => {
    const newMarkedObject = cloneDeep(markedDates);
    if (!has(newMarkedObject, e.dateString)) {
      newMarkedObject[e.dateString] = waterDatesStyle;
    }
    const newObj = Object.keys(newMarkedObject).reduce((accum, index) => {
      if (e.dateString === index) {
        accum[e.dateString] = waterDatesStyle;
      } else {
        accum[index] = {
          marked: true,
          dotColor: "green",
        };
      }
      return accum;
    }, {});

    setMarkedDates(newObj);

    setDay(e.dateString.split("-")[2]);
    setMonth(e.dateString.split("-")[1]);
    setYear(e.dateString.split("-")[0]);

    fetchWaterDataForDay(e.dateString);
  };

  const fetchWaterDataForMonth = useCallback(async () => {
    setIsLoading(true);
    setTotalAmountForMonth(0);
    setTotalQuantityForMonth(0);
    const token = await AsyncStorage.getItem("userToken");
    try {
      const { data } = await axios.get(
        `https://hisabkitabapi.onrender.com/getWaterDataForMonth?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setTotalAmountForMonth(data?.totalAmount || 0);
      setTotalQuantityForMonth(data?.totalQuantity || 0);
      const days = data?.days || [];
      const obj = {};
      days.forEach((d) => {
        const dateString = new Intl.DateTimeFormat("en-CA").format(
          new Date(`${year}-${month}-${d.day}`)
        );

        if (d.day === day) {
          setWaterBottleQuantity("" + (d.quantity || "0"));
          obj[`${dateString}`] = {
            selected: true,
            marked: true,
            dotColor: "green",
          };
        } else {
          obj[`${dateString}`] = {
            marked: true,
            dotColor: "green",
          };
        }
      });

      setMarkedDates(obj);
      setIsLoading(false);
    } catch (error) {
      console.log("error occurred while fetching Water data ", error);
    }
  }, [month, year]);

  useEffect(() => {
    fetchWaterDataForMonth();
  }, [fetchWaterDataForMonth]);

  const fetchWaterDataForDay = async (dateString) => {
    const token = await AsyncStorage.getItem("userToken");
    const day = dateString.split("-")[2];
    const month = dateString.split("-")[1];
    const year = dateString.split("-")[0];
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `https://hisabkitabapi.onrender.com/getWaterDataForDay?day=${day}&month=${month}&year=${year}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setWaterBottleQuantity("" + (data.quantity || "0"));
      setIsLoading(false);
    } catch (error) {
      console.log("error occurred while fetching Water data ", error);
    }
  };

  const handleSubmit = async () => {
    if (waterBottleQuantity >= 0 && waterBottleQuantity <= 3) {
      const token = await AsyncStorage.getItem("userToken");
      setIsLoading(true);
      axios
        .post(
          "https://hisabkitabapi.onrender.com/updateWaterForDate",
          {
            day,
            month,
            year,
            waterBottleQuantity,
            currentWaterRate,
            totalAmount: currentWaterRate * waterBottleQuantity,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((response) => {
          fetchWaterDataForMonth();
        })
        .catch((error, res) => {
          setIsLoading(false);
          console.log("error ", error);
        });
    } else {
      Alert.alert("Too many water bottles");
    }
  };

  return (
    <ParentScreen>
      <ScrollView>
        <View
          style={{
            backgroundColor: "#4ba4f4",
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
          >
            <Text
              style={{
                fontWeight: "800",
                fontSize: 25,
              }}
            >
              Water
            </Text>
            <MaterialCommunityIcons
              name="tanker-truck"
              size={34}
              color={"#d5e8f9"}
            />
          </Pressable>
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <CalendarList
            horizontal
            pagingEnabled={true}
            contentContainerStyle={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
              width: 200,
            }}
            maxDate={new Date().toDateString()}
            futureScrollRange={0}
            pastScrollRange={12}
            onDayPress={dayPressHandler}
            calendarWidth={411}
            onVisibleMonthsChange={(months) => {
              setMonthName(
                new Intl.DateTimeFormat("en-US", {
                  month: "long",
                }).format(new Date(months[0].dateString))
              );
              setMonth(months[0].month);
              setYear(months[0].year);
              setDay(months[0].day);
            }}
            markingType="custom"
            markedDates={markedDates}
            showsHorizontalScrollIndicator={true}
          />
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
                borderWidth: 1,
                display: "flex",
                justifyContent: "center",
                margin: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: "#4ba4f4",
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
                  <Chip mode="outlined">{totalAmountForMonth}</Chip>
                </Text>
                <MaterialCommunityIcons
                  name="currency-inr"
                  size={24}
                  color="black"
                />
              </View>
              <View
                style={{
                  backgroundColor: "#4ba4f4",
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
                  Total Water Bottles in {monthName}
                </Text>
                <Text
                  style={{
                    marginLeft: 20,
                    fontSize: 22,
                  }}
                >
                  <Chip mode="outlined">{totalQuantityForMonth}</Chip>
                </Text>
                <MaterialCommunityIcons
                  name="fridge-industrial-outline"
                  size={24}
                  color="black"
                />
              </View>
              <View
                style={{
                  backgroundColor: "#4ba4f4",
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={styles.label}>Water Bottle</Text>
                <View
                  style={{
                    padding: 10,
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
                      setWaterBottleQuantity(
                        "" + (parseInt(waterBottleQuantity) + 1)
                      );
                    }}
                  >
                    <MaterialIcons name="add" size={32} color="black" />
                  </Text>
                  <Text
                    style={{
                      marginHorizontal: 20,
                      fontSize: 22,
                    }}
                  >
                    <Chip mode="outlined">{waterBottleQuantity}</Chip>
                  </Text>
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                    }}
                    onPress={() => {
                      const intQuantity = parseInt(waterBottleQuantity);
                      if (intQuantity < 1) {
                        setWaterBottleQuantity("" + waterBottleQuantity);
                      } else {
                        setWaterBottleQuantity("" + (intQuantity - 1));
                      }
                    }}
                  >
                    <MaterialIcons name="remove" size={32} color="black" />
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                margin: 20,
                marginTop: 2,
              }}
            >
              <Button title="Submit" onPress={handleSubmit} />
            </View>
          </>
        )}
      </ScrollView>
    </ParentScreen>
  );
};

export default Water;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 10,
    padding: 10,
  },
  input: {
    height: 40,
    width: 150,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});
