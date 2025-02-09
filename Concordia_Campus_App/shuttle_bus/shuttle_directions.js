import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import { getLocation } from '../maps/locationUtils';
import styles from './styles/shuttle_directions_styles';
import { API_KEY } from '@env';

const DirectionsDisplay = ({ stop }) => {
  const [location, setLocation] = useState(null);
  const [directions, setDirections] = useState([]);

  const fetchDirections = async (origin, destination) => {
    const originCoords = origin.latitude + ',' + origin.longitude;
    const destCoords = destination.latitude + ',' + destination.longitude;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originCoords}&destination=${destCoords}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes.length) {
        const steps = data.routes[0].legs[0].steps.map((step, index) => ({
          id: index,
          instruction: step.html_instructions
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim(),
          distance: step.distance.text,
        }));
        setDirections(steps);
      }
    } catch (error) {
      console.log("Error fetching directions:", error);
    }
  };

  useEffect(() => {
    const fetchUserLocation = async () => {
      const location = await getLocation();
      if (location) {
        setLocation(location);
      }
    };
    fetchUserLocation();
  }, []);

  useEffect(() => {
    if (location && stop) {
      fetchDirections(location, stop);
    }
  }, [location]);

  return (
    <View style={{ flex: 1 }}>
      {location && stop && (
          <MapViewDirections
            origin={{ latitude: location.latitude, longitude: location.longitude }}
            destination={{ latitude: stop.latitude, longitude: stop.longitude }}
            apikey={API_KEY}
            strokeWidth={4}
            strokeColor="blue"
          />
      )}

      <View style={styles.container}>
        <Text style={styles.title}>Directions</Text>
        <ScrollView style={styles.directionsContainer}>
          {directions.length > 0 ? (
            directions.map((step, index) => (
              <View
                key={step.id}
                style={[styles.step, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
              >
                <Text style={styles.instruction}>{step.instruction}</Text>
                <Text style={styles.distance}>{step.distance}</Text>
              </View>
            ))
          ) : (
            <Text>Please enable location sharing.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};


export default DirectionsDisplay;
