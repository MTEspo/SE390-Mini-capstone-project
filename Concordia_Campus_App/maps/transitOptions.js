import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import { API_KEY } from '@env';
import styles from './styles/mapScreenStyles';
import {  Marker } from 'react-native-maps';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const TransitScreen = ({showDirections, campus, routeData, origin, destination, strokeWidth, defaultMode}) => {
  const [mode, setMode] = useState(defaultMode);

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


  // If there origin location is null set the location to the current campus
  const location =  (origin == null) ? campusLocations[campus]: origin;

  // If there destination location is null set the destinatio to the other campus
  const destinationLocation = (destination == null) ? ((campus === 'SGW') ? campusLocations.Loyola : campusLocations.SGW) : destination;


  const handleDirections = (result) => {
    routeData(result.duration, result.distance);
  };

  return (
    <>
      {showDirections && (
        <View style={styles.container}>
          {mode === 'DRIVING' && (
            <View>
              <MapViewDirections
                origin={location}
                destination={destinationLocation}
                apikey={API_KEY}
                strokeWidth={5}
                strokeColor="blue"
                mode={mode}
                onReady={handleDirections}
                zIndex={10}
              />
              <Marker
                  testID={`driving-line`}
                  zIndex={10}
                  coordinate={location}
                >
                  <Text note style={{ color: "#800000", fontSize: 10 }}>
                  </Text>
                </Marker>
                </View>
          )}

          {mode === 'WALKING' && (
            <View>
              <MapViewDirections
                origin={location}
                destination={destinationLocation}
                apikey={API_KEY}
                strokeWidth={(strokeWidth) ? strokeWidth : 5}
                strokeColor="blue" 
                mode={mode}
                onReady={handleDirections}
                lineDashPattern={(strokeWidth) ? [5, 5] : [2, 10]} 
                zIndex={10}
              />
              <Marker
                  testID={`walking-line`}
                  zIndex={10}
                  coordinate={location}
                >
                  <Text note style={{ color: "#800000", fontSize: 10 }}>
                  </Text>
                </Marker>
              </View>
          )}

          {mode === 'TRANSIT' && (
            <View>
              <MapViewDirections
                origin={location}
                destination={destinationLocation}
                apikey={API_KEY}
                strokeWidth={5}
                strokeColor="green" 
                mode="TRANSIT"
                onReady={handleDirections}
                zIndex={10}
              />
            <Marker
                              testID={`transit-line`}
                              zIndex={10}
                              coordinate={location}
                            >
                              <Text note style={{ color: "#800000", fontSize: 10 }}>
                              </Text>
                </Marker>
                  </View>
          )}

          <View style={[styles.modeContainer, { zIndex: 1 }]}>
            <TouchableOpacity 
              testID="driving-button"
              onPress={() => setMode('DRIVING')} 
              style={[styles.modeButton,{ marginHorizontal: 30}, mode === 'DRIVING' && { backgroundColor: 'blue' }]}>
              <FontAwesome5 name="car" size={40} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              testID="walking-button"
              onPress={() => setMode('WALKING')} 
              style={[styles.modeButton,{ marginHorizontal: 35, paddingHorizontal:27}, mode === 'WALKING' && { backgroundColor: 'blue' }]}>
              <FontAwesome5 name="walking" size={40} color="white" />
            </TouchableOpacity>

            <TouchableOpacity 
              testID="transit-button"
              onPress={() => setMode('TRANSIT')} 
              style={[styles.modeButton,{ marginHorizontal: 30}, mode === 'TRANSIT' && { backgroundColor: 'green' }]}>
              <FontAwesome5 name="bus" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default TransitScreen;