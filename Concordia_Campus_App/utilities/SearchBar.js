import React from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const SearchBar = ({searchText, isOrigin, placeHolderTxt, iconName, iconSize, iconColor, searchCallback, startingCallback, resetCallback}) => {
    return (
        <>
            <View style={style.inputRow}>
                {!iconName ? (
                    <View style={style.iconContainer}>
                        <View style={style.iconDot} />
                        <View style={style.iconDots} />
                    </View>
                ) : (
                    <View style={style.iconContainer}>
                        <Icon name={iconName} size={iconSize} color={iconColor} />
                    </View>
                )}
                
                <View style={style.textInputWrapper}>
                    <TextInput
                        style={style.input}
                        placeholder={placeHolderTxt}
                        value={searchText}
                        onFocus={() => (isOrigin !== undefined) ? startingCallback(isOrigin) : null}
                        onChangeText={(text) => (isOrigin !== undefined) ? searchCallback(text, isOrigin) : searchCallback(text)}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity testID={"search-exit-" + searchText.length} onPress={() => {resetCallback()}}>
                            <Icon name="times-circle" size={18} color="gray" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </>
    );
}

const style = StyleSheet.create({
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 1,
        padding: 10,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    iconContainer: {
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'green',
    },
    iconDots: {
        width: 2,
        height: 10,
        backgroundColor: 'gray',
        marginVertical: 2,
    },
    input: {
        flex: 1,
        height: 25,
        paddingHorizontal: 10,
    },
    textInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
  });
  
export default SearchBar;