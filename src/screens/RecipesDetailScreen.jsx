import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMealDetails } from '../api/TheMealDB';
import { FavouritesContext } from '../context/FavouritesContext';

const RecipesDetailScreen = ({ route }) => {
  const { mealId } = route.params;
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy state và hàm từ context
  const { favourites, addFavourites, removeFavourites} = useContext(FavouritesContext);

  // Kiểm tra xem món ăn hiện tại có trong danh sách yêu thích không
  const isFavourite = favourites.some(item => item.idMeal === mealId);

  useEffect(() => {
    const fetchMealDetails = async () => {
      setLoading(true);

      const details = await getMealDetails(mealId);
      setMeal(details);
      setLoading(false);
    };
    fetchMealDetails();
  }, [mealId]);

  const handleAddFavourites = () => {
    if(isFavourite){
      Toast.show({
        type: 'info',
        text1: 'Notification',
        text2: 'The meal is already in favourite list ❤',
      });
    }else{
      addFavourites(meal);
      Toast.show({
        type: 'success',
        text1: 'Notification',
        text2: 'The meal has been added to favourite list successfully ❤',
      });
    }
  };

  if(loading){
    return <ActivityIndicator size="large" color="orange" style={{ flex: 1, justifyContent: 'center' }} />;
  }
  if(!meal){
    return <Text style={styles.errorText}>Không thể tải chi tiết món ăn.</Text>;
  }

  const ingredients = [];
  for(let i=1; i<=20; i++){
    if(meal[`strIngredient${i}`]){
      ingredients.push(`${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`);
    }else{
      break;
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView style={styles.container}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{meal.strMeal}</Text>
        <Text style={styles.category}>{meal.strCategory} | {meal.strArea}</Text>

        <Text style={styles.sectionTitle}>Ingredients</Text>
        {ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredient}>{ingredient}</Text>
        ))}
        
        <Text style={styles.sectionTitle}>Instruction</Text>
        <Text style={styles.instructions}>{meal.strInstructions}</Text>
      </View>
      <TouchableOpacity 
        style={[styles.favouriteButton, isFavourite && styles.favouriteButtonActive]}
        onPress={handleAddFavourites}
      >
        <Text style={[styles.favouriteButtonText, isFavourite ? styles.isFavourite : styles.notIsFavourite]} >
          {isFavourite ? 'Favourite ❤' : 'Add to favourite list ✚'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  detailsContainer: {
    backgroundColor: '#f5deb3',
    padding: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  category: {
    textAlign: 'center',
  },
  sectionTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 20,
    marginTop: 20,
    fontSize: 20,
  },
  favouriteButton: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  favouriteButtonText: {
    fontWeight: 'bold',
  },
  isFavourite: {
    color: 'green',
  },
});

export default RecipesDetailScreen;