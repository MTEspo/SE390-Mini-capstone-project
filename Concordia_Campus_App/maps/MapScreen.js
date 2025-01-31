import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import styles from './styles/mapScreenStyles'; // Import styles here
import buildingsData from './buildingCoordinates.js';

const MapScreen = () => {
  const [campus, setCampus] = useState('SGW');
  const campusLocations = {
    SGW: {
      latitude: 45.49532997441208,
      longitude: -73.57859533082366,
      title: 'SGW Campus',
      description: 'A well-known university located in Montreal, Canada',
    },
    Loyola: {
      latitude: 45.458161998720556,
      longitude: -73.63905090035233,
      title: 'Loyola Campus',
      description: 'Loyola Campus of Concordia University',
    },
  };

  const location = campusLocations[campus];



  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          placeholder="Search Building or Class..."
          style={styles.searchBar}
          onChangeText={(text) => console.log(`Searching for: ${text}`)}
        />
      </View>

      <View style={styles.toggleButtonContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setCampus(campus === 'SGW' ? 'Loyola' : 'SGW')}
        >
          <Text style={styles.toggleButtonText}>
            <Text style={campus === 'SGW' ? styles.highlightedText : styles.normalText}>SGW</Text>
            {' | '}
            <Text style={campus === 'Loyola' ? styles.highlightedText : styles.normalText}>LOY</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0005,  // Zoomed out for better view of polyline
          longitudeDelta: 0.0005,
        }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0005,
          longitudeDelta: 0.0005,
        }}
      >
        {/* Marker for the campus */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={location.title}
          description={location.description}
        />

        {buildingsData.buildings.map((building, index) => (
          <Polygon
            key={index}
            coordinates={building.coordinates}
            fillColor={building.fillColor}
            strokeColor={building.strokeColor}
            strokeWidth={2}
          />
        ))}
      </MapView>
    </View>
  );
};

export default MapScreen;


