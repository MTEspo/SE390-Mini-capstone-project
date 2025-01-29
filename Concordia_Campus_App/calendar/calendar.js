import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function Calendar() {
  return (
    <View style={styles.container}>
        <Text>CALENDAR SCREEN</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});