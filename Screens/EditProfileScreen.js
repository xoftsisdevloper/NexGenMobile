import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, Modal, FlatList, Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../Navigation/AuthContext';
import { userUpdate } from '../API_STORE/user_api';
import { fetchInstitutions } from '../API_STORE/ins_api';

const options = {
    edlevel: [
        { label: 'School', value: 'school' },
        { label: 'College', value: 'college' },
        { label: 'Graduated', value: 'graduated' }
    ],
    clLevels: [
        { label: 'LKG', value: 'lkg' },
        { label: 'UKG', value: 'ukg' },
        { label: 'Class 1', value: 'class_1' },
        { label: 'Class 2', value: 'class_2' },
        { label: 'Class 3', value: 'class_3' },
        { label: 'Class 4', value: 'class_4' },
        { label: 'Class 5', value: 'class_5' },
        { label: 'Class 6', value: 'class_6' },
        { label: 'Class 7', value: 'class_7' },
        { label: 'Class 8', value: 'class_8' },
        { label: 'Class 9', value: 'class_9' },
        { label: 'Class 10', value: 'class_10' },
        { label: 'Class 11', value: 'class_11' },
        { label: 'Class 12', value: 'class_12' }
    ],
    cdLevels: [
        { label: 'BSc', value: 'bsc' },
        { label: 'BA', value: 'ba' },
        { label: 'BCA', value: 'bca' },
        { label: 'BCom', value: 'bcom' },
        { label: 'BBA', value: 'bba' },
        { label: 'BE', value: 'be' },
        { label: 'BS', value: 'bs' },
        { label: 'MSc', value: 'msc' },
        { label: 'MA', value: 'ma' },
        { label: 'MCA', value: 'mca' },
        { label: 'MCom', value: 'mcom' },
        { label: 'MBA', value: 'mba' },
        { label: 'ME', value: 'me' },
        { label: 'MS', value: 'ms' },
        { label: 'Other', value: 'other' }
    ]
};

const EditProfileScreen = () => {
    const { setAuthUser, authUser } = useAuth();
    const navigation = useNavigation();

    const [institutionList, setInstitutionList] = useState([]);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [schoolClass, setSchoolClass] = useState('');
    const [institution, setInstitution] = useState('');
    const [educationLevel, setEducationLevel] = useState(null);
    const [collegeDegree, setCollegeDegree] = useState('');
    const [customCollegeDegree, setCustomCollegeDegree] = useState('');

    const [modalVisible, setModalVisible] = useState(null); // 'education' | 'class' | 'degree' | 'institution'

    const [showIns, setShowIns] = useState(false);
    const [showCls, setShowCls] = useState(false);
    const [showCgd, setShowCgd] = useState(false);

    useEffect(() => {
        const fetchIns = async () => {
            try {
                const response = await fetchInstitutions();
                setInstitutionList(response.data || []);
            } catch (error) {
                console.log("Error fetching institutions:", error);
            }
        };
        fetchIns();
    }, []);

    useEffect(() => {
        if (authUser) {
            setUsername(authUser.username || '');
            setEmail(authUser.email || '');
            setPhoneNumber(authUser.phoneNumber?.toString() || '');
            setEducationLevel(authUser.educationLevel || null);
            setSchoolClass(authUser.schoolClass || '');
            setInstitution(authUser.institution || '');
            setCollegeDegree(authUser.collegeDegree || '');
            setCustomCollegeDegree(authUser.customCollegeDegree || '');
        }
    }, [authUser]);

    useEffect(() => {
        setShowIns(['school', 'college'].includes(educationLevel));
        setShowCls(educationLevel === 'school');
        setShowCgd(['college', 'graduated'].includes(educationLevel));
    }, [educationLevel]);

    const handleUpdate = async () => {
        try {
            const data = {
                id: authUser._id,
                username,
                email,
                phoneNumber,
                educationLevel,
                schoolClass,
                institution,
                collegeDegree,
                customCollegeDegree,
            };

            const result = await userUpdate({ data });

            if (result.success) {
                Toast.show({ type: 'success', text1: 'Updated Successfully' });
                setAuthUser(result.data.user);
                navigation.navigate('UserDetails');
            } else {
                Toast.show({ type: 'error', text1: result.error, text2: 'Update failed.' });
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'An unexpected error occurred.' });
            console.error('Update error:', error);
        }
    };

    const renderModal = (type, optionsList, valueSetter) => (
        <Modal visible={modalVisible === type} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <FlatList
                        data={optionsList}
                        keyExtractor={item => item.value || item._id || item}
                        renderItem={({ item }) => (
                            <Pressable
                                style={styles.optionItem}
                                onPress={() => {
                                    valueSetter(item.value || item._id || item);
                                    setModalVisible(null);
                                }}
                            >
                                <Text style={styles.optionText}>{item.label || item.name || item}</Text>
                            </Pressable>
                        )}
                    />
                    <TouchableOpacity onPress={() => setModalVisible(null)} style={styles.cancelButton}>
                        <Text style={{ color: 'red', fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.formTitleView}>Edit Profile</Text>

                <TextInput style={styles.formView} placeholder="Username" value={username} onChangeText={setUsername} />
                <TextInput style={styles.formView} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                <TextInput style={styles.formView} placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />

                <TouchableOpacity onPress={() => setModalVisible('education')} style={styles.selector}>
                    <Text style={styles.selectorText}>
                        {educationLevel ? options.edlevel.find(e => e.value === educationLevel)?.label : 'Select Educational Level'}
                    </Text>
                </TouchableOpacity>

                {showIns && (
                    <TouchableOpacity onPress={() => setModalVisible('institution')} style={styles.selector}>
                        <Text style={styles.selectorText}>
                            {institution
                                ? institution === 'other'
                                    ? 'Other'
                                    : (institutionList.find(i => i._id === institution)?.name || 'Select Institution')
                                : 'Select Institution'}
                        </Text>
                    </TouchableOpacity>
                )}

                {showCls && (
                    <TouchableOpacity onPress={() => setModalVisible('class')} style={styles.selector}>
                        <Text style={styles.selectorText}>
                            {schoolClass ? options.clLevels.find(c => c.value === schoolClass)?.label : 'Select Class'}
                        </Text>
                    </TouchableOpacity>
                )}

                {showCgd && (
                    <TouchableOpacity onPress={() => setModalVisible('degree')} style={styles.selector}>
                        <Text style={styles.selectorText}>
                            {collegeDegree ? options.cdLevels.find(c => c.value === collegeDegree)?.label : 'Select Degree'}
                        </Text>
                    </TouchableOpacity>
                )}

                {collegeDegree === 'other' && (
                    <TextInput
                        style={styles.formView}
                        placeholder="Custom College Degree"
                        value={customCollegeDegree}
                        onChangeText={setCustomCollegeDegree}
                    />
                )}

                <TouchableOpacity style={styles.registerButton} onPress={handleUpdate}>
                    <Text style={styles.registerButtonText}>Update</Text>
                </TouchableOpacity>
            </View>

            {renderModal('education', options.edlevel, setEducationLevel)}
            {renderModal('class', options.clLevels, setSchoolClass)}
            {renderModal('degree', options.cdLevels, setCollegeDegree)}
            {renderModal(
                'institution',
                [
                    ...institutionList.map(i => ({ label: i.name, value: i._id })),
                    { label: 'Other', value: 'other' }
                ],
                setInstitution
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#0147ab',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        width: '100%',
        padding: 20,
        borderRadius: 15,
        backgroundColor: '#ffffff',
    },
    formView: {
        marginVertical: 8,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'gray',
        color: '#000',
    },
    formTitleView: {
        color: '#0147ab',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    selector: {
        marginVertical: 8,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: '#e9e9e9',
    },
    selectorText: {
        color: '#000',
    },
    registerButton: {
        marginTop: 20,
        backgroundColor: '#0147ab',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        maxHeight: '80%',
    },
    optionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    optionText: {
        fontSize: 16,
        color: '#000',
    },
    cancelButton: {
        padding: 10,
        alignItems: 'center',
    },
});

export default EditProfileScreen;
