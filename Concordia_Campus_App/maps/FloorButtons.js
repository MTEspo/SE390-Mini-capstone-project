import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import indoorFloorData from "./indoorFloorCoordinates";

const FloorButtons = ({ selectedFloor, onFloorSelect, startLocation }) => {


    const getBuildingByName = (name) => {
        return indoorFloorData.buildings.find(building => building.name === name);
    };

    const building = getBuildingByName(startLocation);
    const floors = Object.keys(building).filter(key => key.startsWith("floor-"));

    return (
        <View style={styles.wrapper}>
          <View style={styles.buttonContainer}>
            {floors.map((floor, index) => {
              const isSelected = selectedFloor === floor;
              return (
                <TouchableOpacity 
                  key={index} 
                  testID={`floor-button-${floor.replace("floor-", "")}-${startLocation}`} 
                  style={[styles.button, isSelected && styles.selectedButton]} 
                  onPress={() => onFloorSelect(parseInt(floor.replace("floor-", "")))}
                >
                  <Text style={styles.buttonText}>{floor.replace("floor-", " ")}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
};

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: 10,
        width: "100%",
        backgroundColor: "#1f1f1f",
        alignItems: "center",
        opacity:'.9',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: 1
    },
    button: {
        backgroundColor: "#708090",
        padding: 12,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    selectedButton: {
        backgroundColor: "green",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold"
    },
});

export default FloorButtons;
