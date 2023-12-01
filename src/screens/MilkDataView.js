import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { DataTable, TextInput } from "react-native-paper";

const MilkDataView = () => {
  const numberOfDays = new Date(
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
    }).format(Date.now()),
    new Intl.DateTimeFormat("en-US", {
      month: "numeric",
    }).format(Date.now()),
    0
  ).getDate();

  const items = [];

  for (let i = 1; i <= numberOfDays; i++) {
    items.push({
      key: i,
      date: i,
      morning: 0,
      evening: 0,
      total: 0,
    });
  }
  return (
    <View>
      <View>
        <DataTable
          style={{
            paddingHorizontal: 15,
            width: 400,
          }}
        >
          <DataTable.Header>
            <DataTable.Title>Date</DataTable.Title>
            <DataTable.Title>Morning</DataTable.Title>
            <DataTable.Title>Evening</DataTable.Title>
            <DataTable.Title>Total</DataTable.Title>
          </DataTable.Header>
          <ScrollView horizontal>
            <View>
              {items.map((item) => (
                <DataTable.Row key={item.key}>
                  <DataTable.Cell
                    style={{
                      width: 75,
                    }}
                  >
                    {item.date}
                  </DataTable.Cell>
                  <DataTable.Cell
                    style={{
                      width: 90,
                    }}
                  >
                    <TextInput
                      type="outlined"
                      label="Morning"
                      value={"" + item.morning}
                      onChangeText={() => {}}
                    />
                  </DataTable.Cell>
                  <DataTable.Cell
                    style={{
                      width: 90,
                    }}
                  >
                    <TextInput
                      label="Evening"
                      value={"" + item.evening}
                      onChangeText={() => {}}
                    />
                  </DataTable.Cell>
                  <DataTable.Cell
                    style={{
                      width: 50,
                    }}
                  >
                    {item.total}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </View>
          </ScrollView>
        </DataTable>
      </View>
    </View>
  );
};

export default MilkDataView;

const styles = StyleSheet.create({});
