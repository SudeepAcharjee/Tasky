import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../firebasconfig';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';

type Task = {
  id: string;
  taskHeading: string;
  taskDetails: string;
  isAssigned: boolean | null;
  isApproved: boolean | null;
  createdAt: Date;
};

const TaskListScreen: React.FC = () => {
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
          isAssigned: data.isAssigned ?? null,
          isApproved: data.isApproved ?? null,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      }) as Task[];
      setTasks(tasksList);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleStatus = async (id: string, field: 'isAssigned' | 'isApproved') => {
    const taskDoc = doc(db, 'tasks', id);
    const task = tasks.find((task) => task.id === id);

    if (task) {
      await updateDoc(taskDoc, {
        [field]: task[field] === null ? true : !task[field],
      });
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskHeading}>{item.taskHeading}</Text>
      <Text style={styles.taskDetails}>{item.taskDetails}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.statusButton}
          onPress={() => handleToggleStatus(item.id, 'isAssigned')}
        >
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor:
                  item.isAssigned === null ? 'orange' : item.isAssigned ? 'green' : 'red',
              },
            ]}
          />
          <Text>Assigned</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statusButton}
          onPress={() => handleToggleStatus(item.id, 'isApproved')}
        >
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor:
                  item.isApproved === null ? 'orange' : item.isApproved ? 'green' : 'red',
              },
            ]}
          />
          <Text>Approved</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.timestamp}>
        {format(item.createdAt, 'MMM d, yyyy h:mm a')}
      </Text>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  timestamp: {
    position: 'absolute',
    right: 15,
    top: 15,
    fontSize: 10,
    color: '#888',
  },
});

export default TaskListScreen;
