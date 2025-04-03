import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../Navigation/AuthContext';
import { userUpdate } from '../API_STORE/user_api';

const EditProfileScreen = ({ route }) => {
    const { setAuthUser, authUser } = useAuth();
    const navigation = useNavigation();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [schoolClass, setSchoolClass] = useState('');
    const [institution, setInstitution] = useState('');
    const [educationLevel, setEducationLevel] = useState(null);
    const [collegeDegree, setCollegeDegree] = useState('');
    const [customCollegeDegree, setCustomCollegeDegree] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);

    const [educationOpen, setEducationOpen] = useState(false);
    const [classOpen, setClassOpen] = useState(false);
    const [degreeOpen, setDegreeOpen] = useState(false);

    const [edlevel] = useState([
        { label: 'School', value: 'school' },
        { label: 'College', value: 'college' },
        { label: 'Graduated', value: 'graduated' },
    ]);
    const [clLevels] = useState([
        { label: 'Class 6', value: 'class_6' },
        { label: 'Class 7', value: 'class_7' },
        { label: 'Class 8', value: 'class_8' },
        { label: 'Class 9', value: 'class_9' },
        { label: 'Class 10', value: 'class_10' },
        { label: 'Class 11', value: 'class_11' },
        { label: 'Class 12', value: 'class_12' },
    ]);
    const [cdLevels] = useState([
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
        { label: 'Other', value: 'other' },
    ]);

    const [showIns, setShowIns] = useState(false);
    const [showCls, setShowCls] = useState(false);
    const [showCgd, setShowCgd] = useState(false);

    // Load user data into state
    useEffect(() => {
        if (authUser) {
            setUsername(authUser.username || '');
            setEmail(authUser.email || '');
            setPhoneNumber(authUser.phoneNumber.toString() || '');
            setEducationLevel(authUser.educationLevel || null);
            setSchoolClass(authUser.schoolClass || '');
            setInstitution(authUser.institution || '');
            setCollegeDegree(authUser.collegeDegree || '');
            setCustomCollegeDegree(authUser.customCollegeDegree || '');
        }
    }, [authUser]);

    useEffect(() => {
        if (educationLevel === 'school') {
            setShowIns(true);
            setShowCls(true);
            setShowCgd(false);
        } else if (educationLevel === 'college') {
            setShowIns(true);
            setShowCls(false);
            setShowCgd(true);
        } else if (educationLevel === 'graduated') {
            setShowIns(false);
            setShowCls(false);
            setShowCgd(true);
        } else {
            setShowIns(false);
            setShowCls(false);
            setShowCgd(false);
        }
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
            }


            const result = await userUpdate({ data });

            if (result.success) {
                Toast.show(
                    {
                        type: 'success',
                        text1: 'Updated Successfully'
                    }
                )
                setAuthUser(result.data.user);
                navigation.navigate('UserDetails');

            } else {
                Toast.show(
                    {
                        type: 'error',
                        text1: result.error,
                        text2: 'Update failed.'
                    }
                )
            }

        } catch (error) {
            Toast.show(
                {
                    type: 'error',
                    text1: 'An unexpected error occurred. Please try again later.'
                }
            )
            console.error('Update error:', error);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.formTitleView}>Edit Profile</Text>

                <TextInput
                    style={styles.formView}
                    placeholder="Username"
                    placeholderTextColor="gray"
                    value={username}
                    onChangeText={setUsername}
                />

                <TextInput
                    style={styles.formView}
                    placeholder="Email"
                    placeholderTextColor="gray"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.formView}
                    placeholder="Phone Number"
                    placeholderTextColor="gray"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />

                <DropDownPicker
                    open={educationOpen}
                    value={educationLevel}
                    items={edlevel}
                    setOpen={setEducationOpen}
                    setValue={setEducationLevel}
                    style={[styles.formView, { zIndex: 99999 }]}
                    textStyle={{ color: '#000' }}
                    placeholder="Select Educational Level"

                    dropDownContainerStyle={{ zIndex: 999999 }}
                />

                {showIns && (
                    <TextInput
                        style={styles.formView}
                        placeholder="Institution"
                        placeholderTextColor="gray"
                        value={institution}
                        onChangeText={setInstitution}
                    />
                )}

                {showCls && (
                    <DropDownPicker
                        open={classOpen}
                        value={schoolClass}
                        items={clLevels}
                        setOpen={setClassOpen}
                        setValue={setSchoolClass}
                        style={[styles.formView, { zIndex: 9999 }]}
                        textStyle={{ color: '#000' }}
                        placeholder="Select Class Level"

                        dropDownContainerStyle={{ zIndex: 999999 }}
                    />
                )}

                {showCgd && (
                    <DropDownPicker
                        open={degreeOpen}
                        value={collegeDegree}
                        items={cdLevels}
                        setOpen={setDegreeOpen}
                        setValue={setCollegeDegree}
                        style={[styles.formView, { zIndex: 99999 }]}
                        textStyle={{ color: '#000', zIndex: 99999 }}
                        placeholder="Select College Degree"

                        dropDownContainerStyle={{ zIndex: 999999 }}
                    />
                )}

                {collegeDegree === 'other' && (
                    <TextInput
                        style={styles.formView}
                        placeholder="Custom College Degree"
                        placeholderTextColor="gray"
                        value={customCollegeDegree}
                        onChangeText={setCustomCollegeDegree}
                    />
                )}

                <TouchableOpacity style={styles.registerButton} onPress={handleUpdate}>
                    <Text style={styles.registerButtonText}>Update</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        width: '100%',
        padding: 20,
        borderRadius: 15,
        backgroundColor: '#ffffff',
    },
    formView: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'gray',
        color: '#000',
    },
    formTitleView: {
        color: '#0147ab',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    registerButton: {
        marginTop: 15,
        backgroundColor: '#0147ab',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default EditProfileScreen;
