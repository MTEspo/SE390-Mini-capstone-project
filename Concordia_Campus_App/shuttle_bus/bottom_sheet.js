import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles/bottom_sheet_styles';
import ArrivalDisplay from './next_shuttle_arrival';

const BottomSheetComponent = ({ selectedStop, bottomSheetIndex, onSheetChanges, onShowDirections }) => {
    const bottomSheetRef = useRef(null);
    const [showSchedule, setShowSchedule] = useState(false);

    useEffect(() => {
        if (bottomSheetIndex === -1) {
            setShowSchedule(false);
        }
        else if(bottomSheetIndex === 1 || bottomSheetIndex === 0){
            onSheetChanges(1)
        }
    }, [bottomSheetIndex]);

    const displaySchedule = () => {
        console.log('Schedule button clicked');
        setShowSchedule(prev => !prev);
        if (!showSchedule) {
            onSheetChanges(2);
        } else {
            onSheetChanges(2);
        }
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={bottomSheetIndex}
            snapPoints={["22%", "50%"]}
            enablePanDownToClose={true}
            onChange={onSheetChanges}>
            
            <BottomSheetView style={styles.contentContainer}>
                {selectedStop && (
                    <>
                        <Text style={{fontSize:20, fontWeight: 'bold', textAlign:'center'}}>{selectedStop.title}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={showSchedule ? styles.button_active : styles.button} onPress={() => displaySchedule(selectedStop)}>
                                <Icon name="clock-o" size={20} style={showSchedule? styles.icon_active : styles.icon}/>
                                <Text style={showSchedule ? styles.text_active : styles.buttonText}>Next Arrival</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={onShowDirections}>
                                <Icon name="location-arrow" size={20} color="#4876FF" style={styles.icon}/>
                                <Text style={styles.buttonText}>Directions</Text>
                            </TouchableOpacity>
                        </View>
                        { showSchedule && (<ArrivalDisplay stop={selectedStop} ></ArrivalDisplay> )}
                        { !showSchedule && (
                            <View style={styles.defaultTextContainer}>
                                <Text style={styles.defaultText}>{'\u2022'} Schedule in effect: Jan. 6 – Apr. 14, 2025</Text>
                                <Text style={styles.defaultText}>{'\u2022'} Shuttle buses run <Text style={{ fontWeight: 'bold' }}>Monday through Friday.</Text></Text>
                                <Text style={styles.defaultText}>{'\u2022'} The ride is approximately <Text style={{ fontWeight: 'bold' }}>30 minutes.</Text></Text>
                                <Text style={styles.defaultText}>{'\u2022'} <Text style={{ fontWeight: 'bold' }}>Your ID card is required.</Text> Present your Concordia student, faculty, staff or alumni card to the driver.</Text>
                            </View>
                        )}
                    </>  
                )}
            </BottomSheetView>
        </BottomSheet>
    );
};

export default BottomSheetComponent;