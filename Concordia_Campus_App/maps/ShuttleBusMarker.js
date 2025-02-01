import React, { useRef, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Callout, Marker } from "react-native-maps";
import shuttleStopCoordinates from './shuttleBusStopCoordinates.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const ShuttleBusMarker = () => {
    const bottomSheetRef = useRef(null);
    const [selectedStop, setSelectedStop] = useState(null);
    const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);

    const openBottomSheet = (stop) => {
        setSelectedStop(stop);
        setBottomSheetIndex(1);
    };
    
    const closeBottomSheet = () => {
        setSelectedStop(null);
        setBottomSheetIndex(-1);
    };

    return (
        <View style={{ flex: 1 }}>
            {shuttleStopCoordinates.map((stop) => (
                <Marker
                    key={stop.keyID}
                    coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                    title={stop.title}
                    pinColor="#1D9E9A">
                    <Callout onPress={() => openBottomSheet(stop)}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, padding: 6 }}>
                                {stop.title}
                            </Text>
                            <TouchableOpacity>
                                <Icon name="info-circle" size={40} color="deepskyblue" />
                            </TouchableOpacity>
                            
                        </View>
                    </Callout>
                </Marker>
            ))}

                <BottomSheet
                    ref={bottomSheetRef}
                    index={bottomSheetIndex}
                    snapPoints={["25%", "50%"]}
                    enablePanDownToClose={true}
                    onChange={(index) => {
                        if (index === -1) {
                        closeBottomSheet();
                        } else if (index === 0) {
                        bottomSheetRef.current?.snapToIndex(1);
                        }
                    }}>
                    
                    <BottomSheetView style={styles.contentContainer}>
                        {selectedStop && (
                            <Text style={{fontSize:20, fontWeight: 'bold'}}>{selectedStop.title}</Text>
                        )}
                    </BottomSheetView>
                    
                </BottomSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
});

export default ShuttleBusMarker;
