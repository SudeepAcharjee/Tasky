import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Home from './Home';
import List from './List';
import Add from './Add';
import AddUser from './AddUser';
import Profile from './profile';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const user = auth().currentUser;
      if (user) {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          
          // Check if userData is defined before accessing profileImage
          if (userData && userData.profileImage) {
            setProfileImage(userData.profileImage);
          } else {
            setProfileImage(null); // or set a default image URL if preferred
          }
        }
      }
    };

    fetchProfileImage();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'help-outline'; // Default icon
          
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'List') {
            iconName = 'list-outline';
          } else if (route.name === 'Add') {
            iconName = 'add-circle-outline';
          } else if (route.name === 'AddUser') {
            iconName = 'person-add-outline';
          } else if (route.name === 'Profile') {
            return profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{ width: size, height: size, borderRadius: size / 2 }}
              />
            ) : (
              <Icon name="person-circle-outline" size={size} color={color} />
            );
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1F2C57',
        tabBarInactiveTintColor: 'gray',
        headerTitle: 'My App', // Set the title of the header to the app name
        headerTitleAlign: 'center', // Align the title to the center
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="List" component={List} />
      <Tab.Screen name="Add" component={Add} />
      <Tab.Screen name="AddUser" component={AddUser} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default HomeScreen;
