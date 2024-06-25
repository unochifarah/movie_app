import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { API_ACCESS_TOKEN } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import MovieList from '../components/movies/MovieList';
import type { Movie } from '../types/app';

const MovieDetails = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const route = useRoute();
  const { id } = route.params;

  useEffect(() => {
    fetchMovieDetails();
    checkIfFavorite();
  }, [id]);

  const fetchMovieDetails = async () => {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error(error);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      if (initialData !== null) {
        const favMovieList: Movie[] = JSON.parse(initialData);
        const isFav = favMovieList.some((favMovie) => favMovie.id === id);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      let favMovieList: Movie[] = [];

      if (initialData !== null) {
        favMovieList = [...JSON.parse(initialData), movie];
      } else {
        favMovieList = [movie];
      }

      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
      setIsFavorite(true);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavorite = async (movieId: number): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      if (initialData !== null) {
        const favMovieList: Movie[] = JSON.parse(initialData);
        const updatedFavMovieList = favMovieList.filter((favMovie) => favMovie.id !== movieId);
        await AsyncStorage.setItem('@FavoriteList', JSON.stringify(updatedFavMovieList));
        setIsFavorite(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  if (!movie) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        style={styles.coverImage}
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` }}
      />
      <View style={styles.header}>
        <Text style={styles.title}>{movie.title}</Text>
        <TouchableOpacity onPress={toggleFavorite}>
          <FontAwesome
            name={isFavorite ? 'heart' : 'heart-o'}
            size={30}
            color={isFavorite ? 'red' : 'black'}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.overview}>{movie.overview}</Text>
      {/* Movie Recommendations */}
      <MovieList title="Recommendations" path={`movie/${id}/recommendations`} coverType="poster" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  overview: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default MovieDetails;
