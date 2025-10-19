import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, Text, ActivityIndicator, ScrollView, TouchableOpacity, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { searchMeals, getRandomMeals, listAllAreas, filterByArea } from '../api/TheMealDB';
import RecipesCard from '../components/RecipesCard';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const SearchScreen = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [listTitle, setListTitle] = useState('Some suggested dish');
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);

    useEffect(() => {
      const initialLoad = async () => {
      setLoading(true);
      setError('');
      
      const [randomMeals, availableAreas] = await Promise.all([
        getRandomMeals(),
        listAllAreas()
      ]);

      if (randomMeals){
        setMeals(randomMeals);
      }
      else{
        setError('Không thể tải món ăn. Vui lòng kiểm tra kết nối.');
      }
      
      if (availableAreas){
        setAreas(availableAreas);
      }
      setLoading(false);
    };
    initialLoad();
    }, []);

    const handleSearch = async () => {
      if (!query){
        return;
      }
      setLoading(true);
      setError('');
      setMeals([]);
      setSelectedArea(null);
      setListTitle(`Result for "${query}"`);

      const results = await searchMeals(query);
      if (results){
        setMeals(results);
      }
      else{
        setError('Không tìm thấy món ăn nào. Vui lòng thử lại.');
      }
      setLoading(false);
    };

    const handleAreaSelect = async (area) => {
      // Nếu người dùng chọn lại mục "Chọn khu vực", không làm gì cả
      if (!area){
        return;
      }

      setLoading(true);
      setError('');
      setMeals([]);
      setQuery('');
      setSelectedArea(area);
      setListTitle(`Meals from ${area}`);

      const results = await filterByArea(area);
      if (results){
        setMeals(results);
      }
      else{
        setError(`Không tìm thấy món ăn nào từ khu vực ${area}.`);
      }
      setLoading(false);
    };

    return (
    <FlatList style={styles.container}
      ListHeaderComponent={
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search for a meal..."
              placeholderTextColor="black"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Ionicons name="search" size={25} color="black" />
            </TouchableOpacity>
          </View>

          {/* 2. Thay thế ScrollView bằng Picker */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedArea}
              onValueChange={(itemValue, itemIndex) => handleAreaSelect(itemValue)}
              style={styles.picker}
              mode="dropdown" 
            >
              <Picker.Item label="-- Country --" value={null} />
              {areas.map(area => (
                <Picker.Item key={area} label={area} value={area} />
              ))}
            </Picker>
          </View>
          
          {meals.length > 0 && <Text style={styles.listTitle}>{listTitle}</Text>}
        </>
      }
      data={meals}
      keyExtractor={(item) => item.idMeal}
      renderItem={({ item }) => (
        <RecipesCard
          item={item}
          onPress={() => navigation.navigate('RecipesDetail', { mealId: item.idMeal })}
        />
      )}
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d3d3d3",
    borderRadius: 12,
    paddingHorizontal: 10,
    margin: 15,
    marginTop: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#d3d3d3",
    padding: 10,
    borderRadius: 8,
    marginLeft: 6,
  },
  pickerContainer: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    justifyContent: 'center', // Cần thiết cho iOS để Picker không quá cao
  },
  picker: {
    height: 50,
    width: '100%',
  },
  listTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'black',
    fontSize: 20,
  },
});

export default SearchScreen;