import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MovieItem from '../components/movies/MovieItem';
import type { Movie } from '../types/app';

const Favorite = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);

  useEffect(() => {
    getFavoriteMovies();
  }, []);

  const getFavoriteMovies = async () => {
    try {
      const data = await AsyncStorage.getItem('@FavoriteList');
      if (data !== null) {
        setFavoriteMovies(JSON.parse(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (favoriteMovies.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorite movies found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteMovies}
        renderItem={({ item }) => (
          <MovieItem movie={item} size={{ width: 100, height: 160 }} coverType="poster" />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default Favorite;
