import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const img = require('../assets/img.png');

const Choose = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Go Back Button */}
      <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>

      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={img}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Description */}
      <Text style={styles.description}>
        Welcome! Choose your role to proceed:
        {'\n\n'}As an **Admin**, you can manage users, tasks, and view analytics.
        {'\n'}As a **User**, you can manage your tasks, view progress, and collaborate with your team.
      </Text>

      {/* Admin Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminLogin' as never)}>
        <Text style={styles.buttonText}>Admin</Text>
      </TouchableOpacity>

      {/* User Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserLogin' as never)}>
        <Text style={styles.buttonText}>User</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDF4FF',
    padding: 20,
  },
  goBackButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  goBackText: {
    color: '#1F2C57',
    fontSize: 16,
  },
  imageContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  description: {
    fontSize: 16,
    color: '#4B5D72',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#1F2C57',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Choose;
