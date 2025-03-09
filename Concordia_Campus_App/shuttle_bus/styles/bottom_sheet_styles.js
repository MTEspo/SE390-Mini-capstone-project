import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 10,
        zIndex:10
    },
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: 10,
        gap: 15,
        justifyContent: 'center',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#ECF3FE',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
        minWidth: 120,
    },
    text_active:{
        color: 'white',
        fontSize: 18,
    },
    button_active: {
        flexDirection: 'row',
        backgroundColor: '#367AE4',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
        minWidth: 120,
    },
    defaultTextContainer:{
        marginTop: 30,
    },
    defaultText:{
        paddingVertical:5
    },
    buttonText: {
        color: '#4876FF',
        fontSize: 18,
    },
    icon_active:{
        color: 'white',
        marginRight: 8,
    },
    icon: {
        color: '#4876FF',
        marginRight: 8,
    },
});

export default styles;