import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Callout, Marker } from "react-native-maps";
import shuttleStopCoordinates from './shuttleBusInfo.js';
import BottomSheetComponent from '../shuttle_bus/bottom_sheet';

const ShuttleBusMarker = ({ setToggleMapDirections, setShuttleStop}) => {
    const [selectedStop, setSelectedStop] = useState(null);
    const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);


    const handleToggleMapDirections = ( state ) => {
        setToggleMapDirections(state);
    }

    const handleSheetChanges = (index) => {
        if(index === -1){
            closeBottomSheet();
        }
        else{
            setBottomSheetIndex(index);
        }
    };

    const openBottomSheet = (stop) => {
        if(selectedStop?.keyID === stop.keyID){
            return;
        }
        setBottomSheetIndex(-1);
        setSelectedStop(null);
        setShuttleStop(null);
        
        setTimeout(() => {
            setSelectedStop(stop);
            setShuttleStop(stop);
            setBottomSheetIndex(1);
        }, 100);
    };
    
    const closeBottomSheet = () => {
        setSelectedStop(null);
        setShuttleStop(null);
        setBottomSheetIndex(-1);
    };

    return (
        <View style={{ flex: 1}}>
            {shuttleStopCoordinates.map((stop) => (
                <Marker onPress={() => openBottomSheet(stop)}
                    style={{ zIndex: 2 }}
                    key={stop.keyID}
                    coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                    title={stop.title}
                    pinColor="#1D9E9A">
                    <Callout>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, padding: 6 }}>
                                {stop.title}
                            </Text>
                        </View>
                    </Callout>
                </Marker>
            ))}

            <BottomSheetComponent selectedStop={selectedStop} bottomSheetIndex={bottomSheetIndex} onSheetChanges={handleSheetChanges} toggleMapDirections={handleToggleMapDirections}/>
        </View>
    );
};

export default ShuttleBusMarker;