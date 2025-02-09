import React, { useState, useRef, useEffect } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Alert } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import styles from './styles/mapScreenStyles'; 
import buildingsData from './buildingCoordinates.js';
import BuildingPopup from './BuildingPopup'; 
import { getLocation } from './locationUtils';

const MapScreen = () => {
  
  return (
    <View></View>
  );
};

export default MapScreen;
