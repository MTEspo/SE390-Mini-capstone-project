import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  directionsContainer: { maxHeight: 300, backgroundColor: '#f8f8f8', padding: 10 },
  step: { marginBottom: 10, padding: 10, borderRadius: 5 },
  evenRow: { backgroundColor: '#f1f1f1' },
  oddRow: { backgroundColor: '#e0e0e0' },
  instruction: { fontSize: 16 },
  distance: { fontSize: 14, color: 'gray' },
});

export default styles;