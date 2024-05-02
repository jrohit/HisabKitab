import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { DataTable, Modal, Text } from "react-native-paper";

const TransactionTableView = ({ transactions }) => {
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([31]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, transactions.length);

  let cumulativeTotal = 0;

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  return (
    <>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>
            <Text variant="titleSmall">Day</Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text variant="titleSmall">Morning</Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text variant="titleSmall">Evening</Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text variant="titleSmall">Day Total </Text>
          </DataTable.Title>
          <DataTable.Title
            style={{
              left: 20,
            }}
          >
            <Text variant="titleSmall">Monthly</Text>
          </DataTable.Title>
        </DataTable.Header>

        {transactions.slice(from, to).map((item, index) => {
          cumulativeTotal = cumulativeTotal + item.total;
          return (
            <DataTable.Row
              key={index}
              onPress={() => {}}
              style={{
                backgroundColor: "#cdfafa",
                marginBottom: 10,
                padding: 10,
              }}
            >
              <DataTable.Cell>
                <Text
                  variant="titleMedium"
                  style={{
                    color: "grey",
                  }}
                >
                  {item.day}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text
                  variant="titleMedium"
                  style={{
                    color: "#0e5421",
                  }}
                >
                  {item.morningQuantity}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text
                  variant="titleMedium"
                  style={{
                    color: "#0e5421",
                  }}
                >
                  {item.eveningQuantity}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text
                  variant="titleMedium"
                  style={{
                    color: "#0e5421",
                  }}
                >
                  {item.total}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell
                style={{
                  left: 20,
                }}
              >
                <Text
                  variant="titleMedium"
                  style={{
                    color: "grey",
                  }}
                >
                  {cumulativeTotal}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          );
        })}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(transactions.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${transactions.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={"Rows per page"}
        />
      </DataTable>
    </>
  );
};

export default TransactionTableView;
