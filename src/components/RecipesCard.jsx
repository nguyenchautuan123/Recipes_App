import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const RecipesCard = ({ item, onPress, onLongPress }) => {
    return(
        <TouchableOpacity 
            style={styles.container} 
            onPress={onPress}
            onLongPress={onLongPress}
        >
            <Image source={{ uri: item.strMealThumb }} style={styles.image}/>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{item.strMeal}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    infoContainer: {
        marginLeft: 15,
        justifyContent: 'center',
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    category: {
        fontSize: 14,
        color: 'gray',
        marginTop: 5,
    },
});

export default RecipesCard;