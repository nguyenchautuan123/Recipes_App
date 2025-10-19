import axios from "axios";

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

export const searchMeals = async (query) => {
    try{
        const response = await axios.get(`${API_BASE_URL}search.php?s=${query}`);
        return response.data.meals;
    }catch(error){
        console.error("Lỗi tìm món ăn !", error);
        return null;
    }
};

export const getMealDetails = async (id) => {
    try{
        const response = await axios.get(`${API_BASE_URL}lookup.php?i=${id}`);
        return response.data.meals[0];
    }catch(error){
        console.error("Lỗi lấy chi tiết món ăn !", error);
        return null;
    }
};

export const getRandomMeals = async () => {
    try{
        const promises = [];
        for(let i = 0; i < 10; i++){
            promises.push(axios.get(`${API_BASE_URL}random.php`));
        }
        const responses = await Promise.all(promises);
        const meals = responses.map(response => response.data.meals[0]);
        
        const uniqueMealsMap = new Map();
        meals.forEach(meal => {
            if(meal && meal.idMeal){
                uniqueMealsMap.set(meal.idMeal, meal);
            }
        });
        const uniqueMeals = Array.from(uniqueMealsMap.values());

        return uniqueMeals;
    }catch(error){
        console.error("Không thể hiện món ngẫu nhiên", error);
        return null;
    }
};

export const listAllAreas = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}list.php?a=list`);
        return response.data.meals.map(area => area.strArea);
    }catch(error){
        console.log("Không thể lấy danh sách khu vực !!", error);
        return null;
    }
};

export const filterByArea = async (area) => {
    try{
        const response = await axios.get(`${API_BASE_URL}filter.php?a=${area}`);
        return response.data.meals;
    }catch(error){
        console.log("Không thể lọc món ăn theo khu vực !!", error);
        return null;
    }
};