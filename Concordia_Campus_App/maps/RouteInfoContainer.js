import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles/mapScreenStyles'; 

export default RouteInfoContainer = ({eta, distance}) => {
    return (
      <>
        {eta !== null && distance !== null && (
          <View testID="route-info-container" style={[styles.routeInfoContainer, { flexDirection: 'row'}]}>
            <Text style={styles.routeInfoText}>Distance: {(distance >= 1) ? Math.round(distance) + " km" : Math.round(distance*1000) + " m"}</Text>
            <Text style={styles.routeInfoText}>      ETA: {Math.round(eta)} mins</Text>
          </View>
        )}
      </>
        
    );
};