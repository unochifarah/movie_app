// src/screens/MovieDetail.tsx
import React from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { API_URL, API_ACCESS_TOKEN } from '@env'

const MovieDetail = ({ navigation }: any): any => {
    const fetchData = (): void => {
      if (API_URL == null || API_ACCESS_TOKEN.length == null) {
        throw new Error('ENV not found')
      }
  
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        },
      }
  
      fetch(API_URL, options)
        .then((response) => response.json())
        .then((response) => {
          console.log(response)
        })
        .catch((err) => {
          console.error(err)
        })
    }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Movie Detail Page</Text>
      <Button title="Fetch Data" onPress={fetchData} />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  )
}

export default MovieDetail