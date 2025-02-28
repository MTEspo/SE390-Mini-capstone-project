import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import indoorFloorData from "./indoorFloorCoordinates";

const FloorButtons = ({ onFloorSelect }) => {
    const hallBuilding = indoorFloorData.buildings[0];
    const floors = Object.keys(hallBuilding).filter(key => key.startsWith("floor-"));
  
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
        {floors.map((floor, index) => (
          <TouchableOpacity key={index} style={styles.button} onPress={() => onFloorSelect(parseInt(floor.replace("floor-", "")))}>
            <Text style={styles.buttonText}>{floor.replace("floor-", "Floor ")}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default FloorButtons;