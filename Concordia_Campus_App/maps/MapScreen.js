// maps/MapScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = () => {
  // Coordinates for both campuses
  const [campus, setCampus] = useState('SGW'); // State to track the selected campus right now
  const campusLocations = {
    SGW: {
      latitude: 45.49532997441208, // Concordia University SGW campus
      longitude: -73.57859533082366,
      title: 'SGW Campus',
      description: 'A well-known university located in Montreal, Canada',
    },
    Loyola: {
      latitude: 45.458161998720556, // Concordia Loyola campus
      longitude: -73.63905090035233,
      title: 'Loyola Campus',
      description: 'Loyola Campus of Concordia University',
    },
  };

  // Current campus location
  const location = campusLocations[campus];

  return (
    <View style={styles.container}>
      {/* SEARCH BAR */}
      <View style={styles.searchBarContainer}>
        <TextInput
          placeholder="Search Building or Class..."
          style={styles.searchBar}
          onChangeText={(text) => console.log(`Searching for: ${text}`)} // Handle the searching input
        />
      </View>

      {/* TOGGLE BUTTON FOR CAMPUSES */}
      <View style={styles.toggleButtonContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setCampus(campus === 'SGW' ? 'Loyola' : 'SGW')} // Switch between campus locations
        >
          <Text style={styles.toggleButtonText}>
            <Text style={campus === 'SGW' ? styles.highlightedText : styles.normalText}>SGW</Text>
            {' | '}
            <Text style={campus === 'Loyola' ? styles.highlightedText : styles.normalText}>LOY</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map view */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude, // Center map at Concordia University
          longitude: location.longitude, // Center map at Concordia University
          latitudeDelta: 0.0001, // Zoom level for a closer view
          longitudeDelta: 0.0001, // Zoom level for a closer view
        }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0001,
          longitudeDelta: 0.0001,
        }}
      >
        {/* Marker for Concordia University */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={location.title}
          description={location.description}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchBarContainer: {
    position: 'absolute',
    top: 20,
    width: '70%',
    left: 20,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  searchBar: {
    height: 40,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  map: {
    width: '100%',
    height: '80%', // Adjust map height to fit below search bar
  },
  toggleButtonContainer: {
    position: 'absolute',
    top: 80, // Place it directly below the search bar
    left: 20, // Align the button to the left of the screen
    zIndex: 1, // Ensures it appears above the map
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#800000', // Concordia's color
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: 'auto', // Set width to auto for a smaller button
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  highlightedText: {
    color: 'white', // Highlight the active campus in yellow (or any color you prefer)
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  normalText: {
    color: 'grey',
    
  },
});

export default MapScreen;
