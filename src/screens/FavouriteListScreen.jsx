import React, { useContext, useLayoutEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Toast from "react-native-toast-message";
import { FavouritesContext } from "../context/FavouritesContext";
import RecipesCard from "../components/RecipesCard";
import { useFocusEffect } from "@react-navigation/native";

const FavouriteListScreen = ({ navigation }) => {
    const { favourites, removeFavourites, removeAllFavourites } = useContext(FavouritesContext);

    const handleRemoveFavourite = (meal) => {
        Alert.alert(
            "Remove",
            `Are you sure to remove "${meal.strMeal}" from favourite list ?`,
            [
                {
                    text: "Cancel",
                    style: "cancel", 
                },
                {
                    text: "Remove",
                    onPress: () => removeFavourites(meal.idMeal),
                    style: "destructive",
                },
            ]
        );
    };

    const handleRemoveAll = useCallback(() => {
        Alert.alert(
            "Remove all",
            "Are you sure to remove all meals of favourite list",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Remove all",
                    onPress: () => removeAllFavourites(),
                    style: "destructive",
                },
            ]
        );
    }, [removeAllFavourites]);

    // Chỉ hiển thị nút khi danh sách có món ăn
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                favourites.length > 0 ? (
                    <TouchableOpacity onPress={handleRemoveAll} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Remove all ✖</Text>
                    </TouchableOpacity>
                ) : null
            ),
        });
    }, [navigation, favourites.length, handleRemoveAll]);

    if(favourites.length === 0){
        return(
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Favourite list is empty...</Text>
            </View>
        );
    }

    return(
        <View style={styles.container}>
            <FlatList
                data={favourites}
                keyExtractor={(item) => item.idMeal}
                renderItem={({ item }) => (
                    <RecipesCard
                        item={item}
                        onPress={() => navigation.navigate('RecipesDetail', { mealId: item.idMeal })}
                        onLongPress={() => handleRemoveFavourite(item)}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    emptyText: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 20,
    },
    deleteButtonText: {
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default FavouriteListScreen;