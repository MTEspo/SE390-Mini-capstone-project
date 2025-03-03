import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import { API_KEY } from '@env';
import styles from './styles/mapScreenStyles';
import {  Marker } from 'react-native-maps';

const TransitScreen = ({ showDirections, campus, routeData }) => {
  const [mode, setMode] = useState('DRIVING');

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
  const destinationLocation = campus === 'SGW' ? campusLocations.Loyola : campusLocations.SGW;

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
                strokeWidth={5}
                strokeColor="blue" 
                mode={mode}
                onReady={handleDirections}
                lineDashPattern={[2, 10]} 
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
              style={[styles.modeButton, mode === 'DRIVING' && { backgroundColor: 'blue' }]}>
              <Text style={styles.modeText}>Driving</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="walking-button"
              onPress={() => setMode('WALKING')} 
              style={[styles.modeButton, mode === 'WALKING' && { backgroundColor: 'blue' }]}>
              <Text style={styles.modeText}>Walking</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              testID="transit-button"
              onPress={() => setMode('TRANSIT')} 
              style={[styles.modeButton, mode === 'TRANSIT' && { backgroundColor: 'green' }]}>
              <Text style={styles.modeText}>Transit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default TransitScreen;