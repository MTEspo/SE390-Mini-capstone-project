import React from 'react';
import MapViewDirections from 'react-native-maps-directions';
import { Marker } from 'react-native-maps';
import { API_KEY } from '@env';

const MapDirections = ({userLocation, destinationLocation}) => {

    if(!userLocation || !destinationLocation){
        return null;
    }

    return(
        <>
            <Marker
                coordinate={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                }}
                testID="marker"/>
            
            <MapViewDirections 
                testID="map-view-directions"
                key={userLocation.latitude + userLocation.longitude}
                origin={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                }}
                destination={{
                    latitude: destinationLocation.latitude,
                    longitude: destinationLocation.longitude,
                }}
                apikey={API_KEY}
                strokeWidth={4}
                strokeColor="orange" />
        </>
    );

};

export default MapDirections;