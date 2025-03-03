import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import indoorFloorData from "./indoorFloorCoordinates";

const FloorButtons = ({ selectedFloor, onFloorSelect }) => {
    const hallBuilding = indoorFloorData.buildings[0];
    const floors = Object.keys(hallBuilding).filter(key => key.startsWith("floor-"));

    return (
        <View style={styles.wrapper}>
            <View style={styles.buttonContainer}>
                {floors.map((floor, index) => {
                    const isSelected = selectedFloor === floor;
                    
                    return (
                        <TouchableOpacity 
                            key={index} 
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
        bottom: 0,
        width: "100%",
        backgroundColor: "transparent",
        paddingVertical: 20,
        alignItems: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: 10
    },
    button: {
        backgroundColor: "#115dad",
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 5
    },
    selectedButton: {
        backgroundColor: "black",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold"
    },
});

export default FloorButtons;
