import React from "react";
import Toast from "react-native-toast-message";
import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { rem } from "nativewind";

// 1. Tạo Context
export const FavouritesContext = createContext();

// 2. Tạo Provider (Component sẽ bao bọc toàn bộ ứng dụng)
export const FavouritesProvider = ({ children }) => {
    const [favourites, setFavourites] = useState([]);

    // Hàm lưu danh sách yêu thích vào AsyncStorage
    const saveFavourites = async (value) => {
        try{
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('@favourites', jsonValue);
        }catch(error){
            console.error('Lỗi không thể lưu danh sách yêu thích vào AsyncStorage', error);
        }
    };

    // Hàm tải danh sách yêu thích từ AsyncStorage khi ứng dụng khởi động
    const loadFavourites = async () => {
        try{
            const jsonValue = await AsyncStorage.getItem('@favourites');
            if(jsonValue != null){
                setFavourites(JSON.parse(jsonValue));
            }
        }catch(error){
            console.error('Lỗi tải danh sách yêu thích', error);
        }
    }

    // Tải danh sách khi component được mount lần đầu
    useEffect(() => {
        loadFavourites();
    }, []);

    // Hàm thêm một món ăn vào danh sách yêu thích
    const addFavourites = (meal) => {
        const newFavourites = [...favourites, meal];
        setFavourites(newFavourites);
        saveFavourites(newFavourites);
    };

    // Hàm xóa một món ăn khỏi danh sách yêu thích
    const removeFavourites = (mealId) => {
        const newFavourites = favourites.filter((meal) => meal.idMeal !== mealId);
        setFavourites(newFavourites);
        saveFavourites(newFavourites);
        if(newFavourites){
            Toast.show({
                type: 'success',
                text1: 'Notification',
                text2: 'The meal has been removed from favourite list successfully',
            });
        }else{
            Toast.show({
                type: 'error',
                text1: 'Notification',
                text2: 'The meal cannot removed from favourite list successfully',
            });
        }
    };

    // Hàm này sẽ xóa toàn bộ danh sách yêu thích
    const removeAllFavourites = () => {
        const emptyFavourites = [];
        setFavourites(emptyFavourites);
        saveFavourites(emptyFavourites);
        if(emptyFavourites){
            Toast.show({
              type: 'success',
              text1: 'Notification',
              text2: 'All meals have been removed from favourite list successfully 🩷',
            });
        }else{
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Cannot remove all meals from favourite list ❌',
            });
        }
    };

    return(
        <FavouritesContext.Provider
            value={{ 
                favourites,
                addFavourites,
                removeFavourites,
                removeAllFavourites,
            }}
        >
            {children}
        </FavouritesContext.Provider>
    );
};