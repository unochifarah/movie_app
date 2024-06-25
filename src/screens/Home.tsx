// src/screens/Home.tsx
import React from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function Home(): JSX.Element {
  const navigation = useNavigation()

  return (
    <View>
      <Text>Home</Text>
      <Button title="Go to Movie Detail" onPress={() => navigation.navigate('MovieDetail')} />
    </View>
  )
}
