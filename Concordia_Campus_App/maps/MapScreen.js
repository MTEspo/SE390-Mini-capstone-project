// maps/MapScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = () => {
  //coordinates for both campuses
  const[campus, setCampus] = useState('SGW'); //state to track the selected campus right now
  const campusLocations = {
    SGW: {
      latitude: 45.49532997441208, //concordia university sgw campus
      longitude: -73.57859533082366,
      title: 'SGW Campus',
      description: 'A well-known university located in Montreal, Canada',
    },
    Loyola: {
      latitude: 45.458161998720556, //concordia loyola campus
      longitude: -73.63905090035233,
      title: 'Loyola Campus',
      description: 'Loyola Campus of Concordia University',
    },
  };

  //current campus location
  const location = campusLocations[campus];

  return (
    <View style={styles.container}>
      {/* SEARCH BAR */}
      <View style={styles.searchBarContainer}>
        <TextInput
        placeholder='Search Building or Class...'
        style = {styles.searchBar}
        onChangeText={(text) => console.log('Searching for: ${text}')} //handle the searching input
        />
      </View>

      {/* TOGGLE BUTTON FOR CAMPUSES */}
      <View style={styles.toggleButtonContainer}>
        <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setCampus(campus === 'SGW' ? 'Loyola' : 'SGW')} //switch between campus locations
        >
          <Text style={styles.toggleButtonText}>
            Switch to {campus === 'SGW' ? 'Loyola' : 'SGW'} Campus
          </Text>
        </TouchableOpacity>
      </View>
      

      {/* Map view */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,  // Center map at Concordia University
          longitude: location.longitude,  // Center map at Concordia University
          latitudeDelta: 0.0001,  // Zoom level for a closer view
          longitudeDelta: 0.0001,  // Zoom level for a closer view
        }}
        region={{
          latitude:location.latitude,
          longitude:location.longitude,
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
    width: '90%',
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
    top: 80, // place it directly below the search bar
    width: '90%',
    zIndex: 1, // Ensures it appears above the map
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#800000', // Concordia's  color
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapScreen;

