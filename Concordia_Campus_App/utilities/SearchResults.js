import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';


const SearchResults = ({searchableData, isOrigin, handleOriginCallback, handleDestinationCallback, screen, searchCallback}) => {
    return (
        <>
            <FlatList
                style={{ marginTop: 5, width: '100%', backgroundColor: 'white', borderRadius: 8 }}
                data={(screen === "indoor") ? searchableData.flatMap(building => 
                    building.rooms.map(room => ({ room, building }))) :
                    searchableData
                }
                renderItem={({ item, index, separators }) => {
                    const totalItems = searchableData.flatMap(building => 
                        (screen === "indoor") ? building.rooms.map(room => ({ room, building })) :
                       searchableData 
                    ).length;
                        const showSeparator = totalItems > 1 && index < totalItems - 1;
                             
                        return (
                            <TouchableOpacity 
                                onPress={() => (isOrigin !== undefined) ? (isOrigin ? handleOriginCallback(item) : handleDestinationCallback(item)) : searchCallback(item, item.markerCoord, item.name)}>
                                <View style={style.item}>
                                    <Text style={style.title}>{(screen === "indoor") ? item.room : item.name}</Text>
                                </View>
                                {showSeparator && <View style={style.separator} />}
                            </TouchableOpacity>
                        );
                }}
                keyExtractor={(item, index) => (screen === "indoor") ? `${item.building.names[0]}-${index}` : item.name}
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