import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { GetCourseByID, HandleJoinRequest } from '../API_STORE/course_api';

const ApprovalListScreen = () => {
  const route = useRoute();
  const { course } = route.params;
  const [crs, setCrs] = useState(course);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const handleAccept = async (userId) => {
    try {
      const response = await HandleJoinRequest({ courseId: course?._id, userId, action: 'approved' });
      Toast.show({ type: 'success', text1: 'Student Approved Successfully!' });
        await getCourseById();
    } catch (error) {
      console.error('Approval error:', error);
      Toast.show({ type: 'error', text1: 'Something went wrong. Try again.' });
    }
  };

  const handleReject = async (userId) => {
    try {
      const response = await HandleJoinRequest({ courseId: course?._id, userId, action: 'rejected' });
      if (response.success) {
        Toast.show({ type: 'success', text1: 'Student Rejected Successfully!' });
        onRefresh();
      } else {
        Toast.show({ type: 'error', text1: 'Error rejecting the student. Please try again later.' });
      }
    } catch (error) {
      console.error('Rejection error:', error);
      Toast.show({ type: 'error', text1: 'Something went wrong. Try again.' });
    }
  };

  const getCourseById = async () => {
    try {
      const response = await GetCourseByID(course?._id);
      setCrs(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
      Toast.show({ type: 'error', text1: 'Failed to fetch course data.' });
    }
  };

  useEffect(() => {
    getCourseById();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getCourseById();
    setRefreshing(false);
  };

  const filteredRequests =
    filter === 'all'
      ? crs.joinRequests || []
      : (crs.joinRequests || []).filter((req) => req.status === filter);

  const renderRequest = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.user.username}</Text>
        <Text style={[styles.status, getStatusColor(item.status)]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.email}>{item.user.email}</Text>
      <Text style={styles.email}>{item.user.phoneNumber}</Text>

      {item.status === 'pending' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.user._id)}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item.user._id)}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderFilterButtons = () => {
    const filters = ['all', 'pending', 'approved', 'rejected'];
    return (
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterBtn, filter === f && styles.activeFilterBtn]}
          >
            <Text style={filter === f ? styles.activeFilterText : styles.filterText}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return { color: 'green' };
      case 'rejected':
        return { color: 'red' };
      case 'pending':
        return { color: '#f0ad4e' };
      default:
        return { color: '#333' };
    }
  };

  return (
    <View style={styles.container}>
      {renderFilterButtons()}
      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item._id}
        renderItem={renderRequest}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No {filter} requests found.</Text>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default ApprovalListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  status: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 14,
    justifyContent: 'space-between',
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 6,
    marginRight: 10,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  activeFilterBtn: {
    backgroundColor: '#85db51',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: '700',
  },
});
