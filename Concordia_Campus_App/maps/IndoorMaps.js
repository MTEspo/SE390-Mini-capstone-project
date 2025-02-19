import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const IndoorMaps = () => {
  // Available buildings and floors
  const floorPlans = {
    "Henry F.Hall Building": {
      1: require('../assets/floor_plans/Hall-1.png'),
      2: require('../assets/floor_plans/Hall-2.png'),
      8: require('../assets/floor_plans/Hall-8.png'),
      9: require('../assets/floor_plans/Hall-9.png'),
    },
    "John Molson School of Business": {
      S2: require('../assets/floor_plans/MB-S2.png'),
      1: require('../assets/floor_plans/MB-1.png'),
    },
    "Vanier Library Building": {
      1: require('../assets/floor_plans/VL-1.png'),
      2: require('../assets/floor_plans/VL-2.png'),
    },
    "Vanier Extension": {
      1: require('../assets/floor_plans/VE-1.png'),
      2: require('../assets/floor_plans/VE-2.png'),
    },
    "Central Building": {
      1: require('../assets/floor_plans/CC1.png'),
    },
  };

  // State to track selected building and floor
  const [selectedBuilding, setSelectedBuilding] = useState(Object.keys(floorPlans)[0]);
  const [selectedFloor, setSelectedFloor] = useState(Object.keys(floorPlans[Object.keys(floorPlans)[0]])[0]);

  // Update available floors whenever the selected building changes
  useEffect(() => {
    setSelectedFloor(Object.keys(floorPlans[selectedBuilding])[0]); // Reset to first floor of the new building
  }, [selectedBuilding]);

  // Get the floor plan image based on selection
  const floorPlan = floorPlans[selectedBuilding]?.[selectedFloor];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Display Floor Plan */}
      {floorPlan ? (
        <Image source={floorPlan} style={styles.image} />
      ) : (
        <Text style={styles.errorText}>Floor plan not available</Text>
      )}

      {/* Building Picker */}
      <Picker
        selectedValue={selectedBuilding}
        onValueChange={(itemValue) => setSelectedBuilding(itemValue)}
        style={styles.picker}
      >
        {Object.keys(floorPlans).map((building) => (
          <Picker.Item key={building} label={building} value={building} />
        ))}
      </Picker>

      {/* Floor Picker */}
      <Picker
        selectedValue={selectedFloor}
        onValueChange={(itemValue) => setSelectedFloor(itemValue)}
        style={[styles.picker, styles.floorPicker]}
      >
        {Object.keys(floorPlans[selectedBuilding]).map((floor) => (
          <Picker.Item key={floor} label={`Floor ${floor}`} value={floor} />
        ))}
      </Picker>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0', // Light background to improve readability
  },
  picker: {
    height: 50,
    width: 300,
    marginBottom: 20, // Space between pickers
  },
  floorPicker: {
    marginTop: 40, // Increased margin to create a bigger gap between building and floor pickers
  },
  image: {
    width: '100%',
    maxWidth: 600,
    height: undefined,
    aspectRatio: 1,
    marginBottom: 20, // Space between image and pickers
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default IndoorMaps;
