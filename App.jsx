import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FavouritesProvider } from './src/context/FavouritesContext';

import SearchScreen from './src/screens/SearchScreen';
import RecipesDetailScreen from './src/screens/RecipesDetailScreen';
import FavouriteListScreen from './src/screens/FavouriteListScreen';

import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tạo một Stack Navigator cho luồng Tìm kiếm
const SearchStack = () => {
  return(
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="SearchHome" component={SearchScreen} options={{ title: 'Meal Recipes 🍽️'}} />
      <Stack.Screen name="RecipesDetail" component={RecipesDetailScreen} options={{ title: 'Meal Detail 👨‍🍳'}} />
    </Stack.Navigator>
  );
};
// Tạo một Stack Navigator cho luồng Yêu thích
const FavouriteStack = () => {
  return(
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="FavouriteList" component={FavouriteListScreen} options={{ title: 'Favourite List 🩷'}} />
      <Stack.Screen name="RecipesDetail" component={RecipesDetailScreen} options={{ title: 'Meal Detail 👨‍🍳'}} />
    </Stack.Navigator>
  );
};

const stackOptions = {
  headerStyle: { backgroundColor: 'orange' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
};

export default function App() {
  return (
    //Bọc toàn bộ ứng dụng trong FavouritesProvider
    <SafeAreaView style={styles.container}>
    <StatusBar style="auto" backgroundColor='black'/>
    <FavouritesProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if(route.name === 'Search'){
                iconName = focused ? 'search' : 'search-outline';
              }else if(route.name === 'Favourite'){
                iconName = focused ? 'heart' : 'heart-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />
            },
            tabBarActiveTintColor: 'orange',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
            tabBarStyle: {
              borderRadius: 50,
              height: 70,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              margin: 20,
              paddingTop: 8,
            }
          })}
        >
          <Tab.Screen name="Search" component={SearchStack} options={{ title: 'Meals'}}/>
          <Tab.Screen name="Favourite" component={FavouriteStack} options={{ title: 'Favourites'}}/>
        </Tab.Navigator>
      </NavigationContainer>
    </FavouritesProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
});