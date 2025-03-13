import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';


const SearchResults = ({searchableData, isOrigin, handleOriginCallback, handleDestinationCallback}) => {
    return (
        <>
            <FlatList
                style={{ marginTop: 5, width: '100%', backgroundColor: 'white', borderRadius: 8 }}
                data={searchableData.flatMap(building => 
                    building.rooms.map(room => ({ room, building }))
                )}
                renderItem={({ item, index, separators }) => {
                    const totalItems = searchableData.flatMap(building => 
                        building.rooms.map(room => ({ room, building }))).length;
                        const showSeparator = totalItems > 1 && index < totalItems - 1;
                             
                        return (
                            <TouchableOpacity 
                                onPress={() => isOrigin ? handleOriginCallback(item) : handleDestinationCallback(item)}>
                                <View style={style.item}>
                                    <Text style={style.title}>{item.room}</Text>
                                </View>
                                {showSeparator && <View style={style.separator} />}
                            </TouchableOpacity>
                        );
                }}
                keyExtractor={(item, index) => `${item.building.names[0]}-${index}`}
                maxHeight={115}
            />
        </>
    );
}

const style = StyleSheet.create({
    title: {
        fontSize: 10,
        fontWeight: '500',
    },
    item: {
        padding: 15,
        paddingBottom: 15,
    },
    separator: {
        height: 1,
        backgroundColor: 'black',
        marginHorizontal: 10,
    }
});

export default SearchResults;