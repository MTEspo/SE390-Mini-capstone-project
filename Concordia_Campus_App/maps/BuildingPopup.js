// BuildingPopup.js

import React from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import styles from './styles/popupStyles';  // Importing styles from the new file

const BuildingPopup = ({ building, onClose }) => {
  if (!building) return null;

  const buildingsWithButton = [
    "John Molson School of Business",
    "Henry F.Hall Building",
    "Vanier Library Building",
    "Central Building",
    "Vanier Extension"
  ];

  return (
    <View style={styles.popupContainer} testID="building-popup">
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <Text style={styles.popupTitle}>{building.popUp.name}</Text>
      <Text style={styles.popupText}>{building.popUp.address}</Text>
      <Text style={styles.popupText}>{building.popUp.codes}</Text>

      {/* Conditional Button Rendering */}
      {buildingsWithButton.includes(building.popUp.name) && (
        <TouchableOpacity style={styles.bottomButton}>
          <Button title="Access inside -->" onPress={() => { /* Define the button press action */ }} />
        </TouchableOpacity>
      )}

    </View>
  );
};

export default BuildingPopup;



