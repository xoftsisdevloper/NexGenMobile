import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Switch, FlatList, StyleSheet } from 'react-native';
import { getTestById, UpdateTestStatus } from '../API_STORE/test_api';
import Toast from 'react-native-toast-message';
import { colorPalette } from '../assets/styles/Colors';

const ToggleTestScreen = () => {
  const [tests, setTests] = useState([]);
  const route = useRoute();
  const { test } = route.params;

  useEffect(() => {
    setTests(test);
  }, [test]);

  const getTest = async (id) => {
    try {
      const response = await getTestById(id);
      return response;
    } catch (error) {
      console.log("Error getting test:", error);
      Toast.show({
        type: 'error',
        text1: 'Fetch Error',
        text2: 'Failed to fetch test data.',
      });
    }
  };

  const updateStatus = async (test_id, data) => {
    try {
      const response = await UpdateTestStatus(test_id, data); // Update API
      if (response.success) {
        const updatedTest = await getTest(test_id); // Get latest data
        if (updatedTest.success) {
          setTests((prev) =>
            prev.map((t) =>
              t._id === test_id ? { ...t, test_status: updatedTest.data.test_status } : t
            )
          );
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Test status updated.',
          });
        }
      }
    } catch (error) {
      console.log("Error updating status:", error);
      Toast.show({
        type: 'error',
        text1: 'Update Error',
        text2: 'Failed to update test status.',
      });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.testName}>{item.test_name}</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Test Type:</Text>
          <Text style={styles.detailValue}>{item.test_type}</Text>
        </View>
      </View>

      <View style={styles.switchContainer}>
        <Text style={{ fontWeight: '700', marginBottom: 5 }}>
          {item.test_status === 'enabled' ? 'Enabled' : 'Disabled'}
        </Text>
        <Switch
          value={item.test_status === 'enabled'}
          onValueChange={() =>
            updateStatus(item._id, {
              status: item.test_status === 'enabled' ? 'disabled' : 'enabled',
            })
          }
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={item.test_status === 'enabled' ? '#85db51' : '#f4f3f4'}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tests}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Data requests not found.</Text>
        } />
    </View>
  );
};

export default ToggleTestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colorPalette.aliceBlue,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  testName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#85db51',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  detailLabel: {
    marginRight: 10,
    fontWeight: '700',
    fontSize: 13,
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    textTransform: 'capitalize',
  },
  switchContainer: {
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
  },
});
