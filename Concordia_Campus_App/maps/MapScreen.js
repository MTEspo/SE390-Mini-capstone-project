import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import styles from './styles/mapScreenStyles'; 
import buildingsData from './buildingCoordinates.js';
import BuildingPopup from './BuildingPopup'; 

const MapScreen = () => {
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const mapRef = useRef(null);

  const handleBuildingSearch = (query) => {
    setSearchQuery(query);
    if (query.length === 0) {
      setFilteredBuildings([]);
      return;
    }
    const results = buildingsData.buildings.filter((b) =>
      b.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBuildings(results);
  };

  const handleSelectBuilding = (building) => {
    if (!selectedStart) {
      setSelectedStart(building);
    } else if (!selectedDestination) {
      setSelectedDestination(building);
    } else {
      setSelectedStart(building);
      setSelectedDestination(null);
    }
    setSearchQuery('');
    setFilteredBuildings([]);
    moveToLocation(building.markerCoord.latitude, building.markerCoord.longitude);
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
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a building..."
          value={searchQuery}
          onChangeText={handleBuildingSearch}
        />
        {filteredBuildings.length > 0 && (
          <FlatList
            data={filteredBuildings}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectBuilding(item)}>
                <Text style={styles.searchResultItem}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
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
       {buildingsData.buildings.map((building) => (
  <Polygon
    key={building.name} 
    coordinates={building.coordinates}
    fillColor={building === selectedStart ? 'green' : building === selectedDestination ? 'blue' : building.fillColor}
    strokeColor={building.strokeColor}
    strokeWidth={2}
    onPress={() => handleSelectBuilding(building)}
  />
))}

      </MapView>

      {selectedStart && selectedDestination && (
        <TouchableOpacity style={styles.getDirectionsButton}>
          <Text style={styles.getDirectionsText}>Get Directions</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MapScreen;
