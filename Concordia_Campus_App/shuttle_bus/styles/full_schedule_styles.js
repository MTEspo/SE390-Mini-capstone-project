import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    scheduleBlock: {
        marginBottom: 24,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#f5f5f5',
    },
    columnHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 12,
        textAlign: 'center',
    },
    tableContent: {
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    column: {
        flex: 1,
        padding: 12,
        borderRightWidth: 1,
        borderRightColor: '#e0e0e0',
    },
    rightColumn: {
        borderRightWidth: 0,
    },
    timeText: {
        fontSize: 15,
        textAlign: 'center',
    },
});

export default styles;