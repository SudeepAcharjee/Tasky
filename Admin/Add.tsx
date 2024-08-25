import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { db } from '../firebasconfig';
import { collection, addDoc } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';

const AddTaskScreen: React.FC = () => {
  const [taskHeading, setTaskHeading] = useState<string>('');
  const [taskDetails, setTaskDetails] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddTask = async () => {
    if (!taskHeading || !taskDetails) {
      Alert.alert('Error', 'Please fill out both the task heading and details.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        taskHeading,
        taskDetails,
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Task added successfully!');
      setTaskHeading('');
      setTaskDetails('');

      // Trigger a local notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Task Added!",
          body: `Task: ${taskHeading} has been added successfully.`,
        },
        trigger: null,  // Trigger immediately
      });

    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', `Error adding task: ${error.message}`);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Task</Text>
      <TextInput
        placeholder="Task Heading"
        value={taskHeading}
        onChangeText={setTaskHeading}
        style={styles.input}
      />
      <TextInput
        placeholder="Task Details"
        value={taskDetails}
        onChangeText={setTaskDetails}
        multiline
        numberOfLines={4}
        style={[styles.input, styles.textArea]}
      />
      <Button title={loading ? 'Adding...' : 'Add Task'} onPress={handleAddTask} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default AddTaskScreen;
