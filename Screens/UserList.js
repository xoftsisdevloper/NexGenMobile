import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Image } from 'react-native-elements';
import { colorPalette } from '../assets/styles/Colors';
import { useAuth } from '../Navigation/AuthContext';
import { fetchCourses } from '../API_STORE/course_api';
import { userToggling } from '../API_STORE/user_api';
import Toast from 'react-native-toast-message';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const { authUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter users based on search & status
  useEffect(() => {
    let filtered = users;

    if (searchText.trim() !== '') {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(lower) ||
          user.email.toLowerCase().includes(lower)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchText, users, statusFilter]);

  // Fetch courses
  const loadCourses = useCallback(async () => {
    try {
      const result = await fetchCourses();
      const teacherCourses = result.filter(
        (course) => course.created_by === authUser?._id
      );
      setCourses(teacherCourses);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  }, [authUser]);

  // Load requests and group by user
  const loadRequests = useCallback((coursesList) => {
    const userMap = new Map();

    coursesList.forEach((course) => {
      (course.joinRequests || []).forEach((req) => {
        const user = req.user;
        if (!user) return;

        const userId = user._id;

        if (!userMap.has(userId)) {
          userMap.set(userId, {
            id: userId,
            name: user.username || 'Unnamed',
            email: user.email || 'No Email',
            phone: user.phoneNumber || 'N/A',
            status: user.isActive ? 'active' : 'blocked',
            courses: [course.title],
          });
        } else {
          const existing = userMap.get(userId);
          if (!existing.courses.includes(course.title)) {
            existing.courses.push(course.title);
          }
        }
      });
    });

    setUsers(Array.from(userMap.values()));
  }, []);

  const updateUserStatus = useCallback(
    async (id, data) => {
      try {
        await userToggling(id, data);
        Toast.show({ type: 'success', text1: 'Status updated successfully' });
        await loadCourses();
      } catch (error) {
        console.log('Update user status error', error);
        Toast.show({ type: 'error', text1: 'Failed to update status' });
      }
    },
    [loadCourses]
  );

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    if (courses.length > 0) {
      loadRequests(courses);
    }
  }, [courses, loadRequests]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.info}>Email: {item.email}</Text>
        <Text style={styles.info}>Phone: {item.phone}</Text>
        <Text style={styles.info}>
          Courses: {item.courses?.join(', ') || 'None'}
        </Text>
      </View>

      <View style={[styles.statusContainer, { flex: 0.5 }]}>
        <Text
          style={[
            styles.statusText,
            {
              color: item.status === 'active' ? 'green' : 'red',
              textAlign: 'center',
            },
          ]}
        >
          {item.status === 'active' ? 'Active' : 'Blocked'}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() =>
          updateUserStatus(item.id, {
            isActive: item.status === 'blocked',
          })
        }
        style={[
          styles.actionButton,
          {
            backgroundColor:
              item.status === 'active'
                ? 'rgba(255, 175, 175, 0.64)'
                : 'rgba(178, 255, 182, 0.52)',
          },
        ]}
      >
        <Image
          source={
            item.status === 'active'
              ? require('../assets/images/stop.png')
              : require('../assets/images/check_circle.png')
          }
          style={{ width: 20, height: 20 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TextInput
        placeholder="Search by name or email"
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.filterContainer}>
        {['all', 'active', 'blocked'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              statusFilter === status && styles.filterButtonActive,
            ]}
            onPress={() => setStatusFilter(status)}
          >
            <Text
              style={[
                styles.filterButtonText,
                statusFilter === status && styles.filterButtonTextActive,
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {users.length > 0 ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            minHeight: 200,
          }}
        >
          <Text style={{ textAlign: 'center' }}>Student Data not found</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default UserList;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colorPalette.aliceBlue,
  },
  searchInput: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  info: {
    fontSize: 14,
    marginBottom: 3,
    color: '#555',
  },
  statusContainer: {
    marginTop: 5,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 16,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    width: 100,
    height: 40,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colorPalette.blue || '#add8e6',
  },
  filterButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
