import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles/mapScreenStyles'; 

export default RouteInfoContainer = props => {
    return (
      <>
        {props.eta !== null && props.distance !== null && (
          <View style={[styles.routeInfoContainer, { flexDirection: 'row'}]}>
            <Text style={styles.routeInfoText}>Distance: {Math.round(props.distance)} km</Text>
            <Text style={styles.routeInfoText}>      ETA: {Math.round(props.eta)} mins</Text>
          </View>
        )}
      </>
        
    );
};