import React from "react";
import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    };

    // Hàm này sẽ xóa toàn bộ danh sách yêu thích
    const removeAllFavourites = () => {
        const emptyFavourites = [];
        setFavourites(emptyFavourites);
        saveFavourites(emptyFavourites);
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