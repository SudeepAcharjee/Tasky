import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebasconfig';
import { collection, query, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Task = {
  id: string;
  taskHeading: string;
  taskDetails: string;
  isApproved: boolean | null;
  createdAt: Date;
};

const ApproveTaskScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          taskHeading: data.taskHeading,
          taskDetails: data.taskDetails,
          isApproved: data.isApproved,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      }) as Task[];
      setTasks(tasksList);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleApproval = async (id: string, isApproved: boolean | null) => {
    const taskDoc = doc(db, 'tasks', id);

    try {
      await updateDoc(taskDoc, {
        isApproved: isApproved === null ? true : !isApproved,
      });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const taskDoc = doc(db, 'tasks', id);
              await deleteDoc(taskDoc);
              Alert.alert('Success', 'Task deleted successfully!');
            } catch (error) {
              console.error('Error deleting document: ', error);
              Alert.alert('Error', 'Failed to delete the task.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskHeading}>{item.taskHeading}</Text>
      <Text style={styles.taskDetails}>{item.taskDetails}</Text>
      <Text style={styles.timestamp}>
        {format(item.createdAt, 'MMM d, yyyy h:mm a')}
      </Text>
      <View style={styles.switchContainer}>
        <Switch
          value={item.isApproved === true}
          onValueChange={() => handleToggleApproval(item.id, item.isApproved)}
          thumbColor={item.isApproved ? 'green' : 'red'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
        <Text style={styles.approvalStatus}>
          {item.isApproved ? 'Approved' : 'Not Approved'}
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTask(item.id)}
        >
          <Icon name="delete" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  taskContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
  },
  taskHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskDetails: {
    fontSize: 14,
    marginBottom: 15,
    color: '#555',
  },
  timestamp: {
    position: 'absolute',
    right: 15,
    bottom: 5,
    fontSize: 12,
    color: '#888',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  approvalStatus: {
    fontSize: 12,
    color: '#888',
  },
  deleteButton: {
    marginLeft: 10,
  },
});

export default ApproveTaskScreen;

