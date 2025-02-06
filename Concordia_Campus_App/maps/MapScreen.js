import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Alert } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import styles from './styles/mapScreenStyles'; 
import buildingsData from './buildingCoordinates.js';
import BuildingPopup from './BuildingPopup'; 

const MapScreen = () => {
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [startQuery, setStartQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [filteredStartBuildings, setFilteredStartBuildings] = useState([]);
  const [filteredDestinationBuildings, setFilteredDestinationBuildings] = useState([]);
  const [lastTappedBuilding, setLastTappedBuilding] = useState(null);
  const mapRef = useRef(null);

  const handleStartSearch = (query) => {
    setStartQuery(query);
    if (query.length === 0) {
      setFilteredStartBuildings([]);
      return;
    }
    const results = buildingsData.buildings.filter((b) =>
      b.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStartBuildings(results);
  };

  const handleDestinationSearch = (query) => {
    setDestinationQuery(query);
    if (query.length === 0) {
      setFilteredDestinationBuildings([]);
      return;
    }
    const results = buildingsData.buildings.filter((b) =>
      b.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDestinationBuildings(results);
  };

  const handleSelectBuilding = (building) => {
    Alert.alert(
      `Select Building`,
      `Do you want to set "${building.name}" as Start or Destination?`,
      [
        {
          text: "Start",
          onPress: () => {
            setSelectedStart(building);
            setStartQuery(building.name);
          },
        },
        {
          text: "Destination",
          onPress: () => {
            setSelectedDestination(building);
            setDestinationQuery(building.name);
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const moveToLocation = (latitude, longitude) => {
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      2000
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.searchContainer}>
        <View style={styles.searchBarWrapper}>
          <Text style={styles.label}>Start:</Text>
          <TextInput
            style={[styles.searchBar, { backgroundColor: '#800000', color: '#FFFFFF' }]}
            placeholder="Select Start Building..."
            placeholderTextColor="#FFFFFF"
            value={startQuery}
            onChangeText={handleStartSearch}
            onFocus={() => setFilteredStartBuildings([])}
          />
          {filteredStartBuildings.length > 0 && (
            <FlatList
              data={filteredStartBuildings}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  setSelectedStart(item);
                  setStartQuery(item.name);
                  setFilteredStartBuildings([]);
                }}>
                  <Text style={styles.searchResultItem}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <View style={styles.searchBarWrapper}>
          <Text style={styles.label}>Destination:</Text>
          <TextInput
            style={[styles.searchBar, { backgroundColor: '#800000', color: '#FFFFFF' }]}
            placeholder="Select Destination Building..."
            placeholderTextColor="#FFFFFF"
            value={destinationQuery}
            onChangeText={handleDestinationSearch}
            onFocus={() => setFilteredDestinationBuildings([])}
          />
          {filteredDestinationBuildings.length > 0 && (
            <FlatList
              data={filteredDestinationBuildings}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  setSelectedDestination(item);
                  setDestinationQuery(item.name);
                  setFilteredDestinationBuildings([]);
                }}>
                  <Text style={styles.searchResultItem}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 45.4953,
          longitude: -73.5786,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        {buildingsData.buildings.map((building) => {
          let fillColor = building.fillColor;
          if (building === selectedStart) fillColor = 'green';
          else if (building === selectedDestination) fillColor = 'blue';

          return (
            <Polygon
              key={building.name}
              coordinates={building.coordinates}
              fillColor={fillColor}
              strokeColor={building.strokeColor}
              strokeWidth={2}
              onPress={() => handleSelectBuilding(building)}
            />
          );
        })}
        {lastTappedBuilding && (
          <Marker
            coordinate={lastTappedBuilding.markerCoord}
            title={lastTappedBuilding.name}
          />
        )}
      </MapView>

      {selectedStart && selectedDestination && (
        <TouchableOpacity style={styles.getDirectionsButton}>
          <Text style={styles.getDirectionsText}>Get Directions</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default MapScreen;