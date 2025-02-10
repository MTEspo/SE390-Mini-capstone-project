// BuildingPopup.js

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles/popupStyles';  // Importing styles from the new file

const BuildingPopup = ({ building, onClose }) => {
  if (!building) return null;

  return (
    <View style={styles.popupContainer} testID="building-popup">
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <Text style={styles.popupTitle}>{building.popUp.name}</Text>
      <Text style={styles.popupText}>{building.popUp.address}</Text>
      <Text style={styles.popupText}>{building.popUp.codes}</Text>
    </View>
  );
};

export default BuildingPopup;



