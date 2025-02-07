// BuildingPopup.js

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles/popupStyles';  // Importing styles from the new file

const BuildingPopup = ({ building, onClose }) => {
  if (!building) return null;

  return (
    <View style={styles.popupContainer}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <Text style={styles.popupTitle}>{building.popUp.name}</Text>
      <Text style={styles.popupText}>{building.popUp.address}</Text>
      <Text style={styles.popupText}>{building.popUp.codes}</Text>
    </View>
    //add a new key for class codes, put info in building coordinates
    //marker coordinates for every building
  );
};

export default BuildingPopup;



