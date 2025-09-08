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
  Modal,
  Alert,
  Linking,
} from 'react-native';
import { Switch } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { colorPalette } from '../assets/styles/Colors';
import { useAuth } from '../Navigation/AuthContext';
import { fetchCourses, HandleJoinRequest } from '../API_STORE/course_api';
import Toast from 'react-native-toast-message';
import Svg, { Path } from 'react-native-svg';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const { authUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [menuVisible, setMenuVisible] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const colors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#facc15'];

  // Filter users by search and status
  useEffect(() => {
    let filtered = users;

    if (searchText.trim() !== '') {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(lower) ||
          user.email.toLowerCase().includes(lower)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user =>
        user.courses.some(c => (statusFilter === 'approved' ? c.status === 'approved' : c.status === 'rejected'))
      );
    }

    setFilteredUsers(filtered);
  }, [searchText, users, statusFilter]);

  // Load teacher courses
  const loadCourses = useCallback(async () => {
    try {
      const result = await fetchCourses();
      const teacher_course_access = authUser?.institution?.course_access || [];

      const teacherCourses = result.filter(course =>
        teacher_course_access.includes(course._id)
      );

      setCourses(teacherCourses);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  }, [authUser]);

  // Load user requests for courses
  const loadRequests = useCallback(coursesList => {
    const userMap = new Map();

    coursesList.forEach(course => {
      (course.joinRequests || []).forEach(req => {
        const user = req.user;
        if (!user) return;

        const userId = user._id;

        // Random color
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        if (!userMap.has(userId)) {
          userMap.set(userId, {
            id: userId,
            name: user.username || 'Unnamed',
            color: randomColor,
            class: user.schoolClass || 'N/A',
            degree: user.collegeDegree || user.customCollegeDegree || 'N/A',
            ed_level: user.educationLevel || 'N/A',
            institution: user?.institution?.name || 'N/A',
            email: user.email || 'No Email',
            phone: user.phoneNumber || 'N/A',
            courses: [{ name: course.name, status: req.status || 'pending', courseId: course._id }],
            requestedAt: req.requestedAt,
          });
        } else {
          const existing = userMap.get(userId);
          existing.courses.push({ name: course.name, status: req.status || 'pending', courseId: course._id });
        }
      });
    });

    setUsers(Array.from(userMap.values()));
  }, []);

  // Update user status for a specific course
  const updateUserStatus = useCallback(
    async ({ courseId, userId, action }) => {
      if (!courseId || !userId || !action) return;

      try {
        await HandleJoinRequest({ courseId, userId, action });
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
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: item.color || '#dbeafe' }]}>
        <Text style={styles.avatarText}>{item.name ? item.name[0].toUpperCase() : '?'}</Text>
      </View>

      {/* User Info */}
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.info}>{item.email}</Text>

        {/* Approval Switch per course */}
        {item.courses.map(course => (
          <View key={course.courseId} style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{course.name}</Text>
            <View style={styles.switchContainer}>
              <Switch
                value={course.status === 'approved'}
                onValueChange={val =>
                  updateUserStatus({
                    courseId: course.courseId,
                    userId: item.id,
                    action: val ? 'approved' : 'rejected',
                  })
                }
                trackColor={{ false: '#fca5a5', true: '#bbf7d0' }}
                thumbColor={course.status === 'approved' ? '#22c55e' : '#ef4444'}
                ios_backgroundColor="#fca5a5"
                style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }} // smaller thumb
              />
            </View>
          </View>
        ))}
      </View>

      {/* Three Dots Menu */}
      <View style={{ justifyContent: 'flex-start', alignItems: 'flex-end' }}>
        <TouchableOpacity onPress={() => setMenuVisible(menuVisible === item.id ? null : item.id)}>
          <Svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000" viewBox="0 0 16 16">
            <Path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
          </Svg>
        </TouchableOpacity>

        {menuVisible === item.id && (
          <View style={styles.menuBox}>
            <TouchableOpacity onPress={() => { setMenuVisible(null); setSelectedUser(item); }} style={styles.menuItem}>
              <Text style={styles.menuText}>Show Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                const phoneNumber = item.phone;
                if (phoneNumber) {
                  Linking.openURL(`tel:${phoneNumber}`).catch(() => {
                    Alert.alert('Error', 'Unable to make a call');
                  });
                } else {
                  Alert.alert('No Phone Number', 'This user does not have a phone number.');
                }
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Call Student</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* Search + Filter Row */}
      <View style={styles.searchFilterRow}>
        <TextInput
          placeholder="Search by name or email"
          style={[styles.searchInput, { flex: 1 }]}
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#666"
        />

        <View style={styles.filterBox}>
          <Picker
            selectedValue={statusFilter}
            onValueChange={itemValue => setStatusFilter(itemValue)}
            style={styles.picker}
            dropdownIconColor="#333"
          >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Approved" value="approved" />
            <Picker.Item label="Rejected" value="rejected" />
          </Picker>
        </View>
      </View>

      {users.length > 0 ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No students found</Text>
        </View>
      )}

      {/* User Details Modal */}
      <Modal visible={!!selectedUser} transparent animationType="slide" onRequestClose={() => setSelectedUser(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>👤 User Details</Text>

            <View style={styles.detailTable}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>{selectedUser?.name}</Text>
              </View>

              {selectedUser?.ed_level === 'school' ? (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Class</Text>
                  <Text style={styles.detailValue}>{selectedUser?.class}</Text>
                </View>
              ) : (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Degree</Text>
                  <Text style={styles.detailValue}>{selectedUser?.degree}</Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Institution</Text>
                <Text style={styles.detailValue}>{selectedUser?.institution}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{selectedUser?.email}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{selectedUser?.phone}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Courses</Text>
                <View style={styles.detailValue}>
                  {selectedUser?.courses?.length > 0 ? (
                    selectedUser.courses.map((c, index) => (
                      <Text key={index} style={{ marginBottom: 3 }}>
                        {index + 1}. {c.name}
                      </Text>
                    ))
                  ) : (
                    <Text>None</Text>
                  )}
                </View>
              </View>


              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Request at</Text>
                <Text style={styles.detailValue}>
                  {selectedUser?.requestedAt
                    ? new Date(selectedUser.requestedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                    : 'N/A'}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedUser(null)}>
              <Text style={styles.closeButtonText}>✖</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default UserList;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colorPalette.primary },
  searchFilterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  searchInput: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#111',
  },
  filterBox: {
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    height: 45,
    justifyContent: 'center',
  },
  picker: { width: 140, height: 'auto', color: '#111', fontSize: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 17, fontWeight: 'bold', color: '#111' },
  info: { fontSize: 14, color: '#444', marginTop: 2 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between' },
  toggleLabel: { fontSize: 14, color: '#333', marginRight: 8, flex: 1 },
  switchContainer: { justifyContent: 'center' },
  switch: {},
  menuBox: { position: 'absolute', top: 30, right: 5, backgroundColor: '#fff', borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 5, zIndex: 10, width: 150 },
  menuItem: { paddingVertical: 5, paddingHorizontal: 15 },
  menuText: { fontSize: 12, color: '#333' },
  emptyBox: { justifyContent: 'center', alignItems: 'center', minHeight: 200 },
  emptyText: { fontSize: 18, color: '#666' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  detailTable: { flexDirection: 'column', marginTop: 8 },
  detailRow: { flexDirection: 'row', marginVertical: 4 },
  detailLabel: { width: 100, fontWeight: '600', color: '#111', textTransform: 'capitalize' },
  detailValue: { flex: 1, color: '#444', flexWrap: 'wrap' ,textTransform: 'capitalize' },
  closeButton: { position: 'absolute', right: 10, top: 10, backgroundColor: '#dd0000', borderRadius: 10, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  closeButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
