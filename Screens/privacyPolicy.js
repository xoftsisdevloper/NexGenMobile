// PrivacyPolicyScreen.js

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colorPalette } from '../assets/styles/Colors';

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.title}>Privacy Policy</Text> */}

      <Text style={styles.sectionTitle}>1. Information We Collect</Text>
      <Text style={styles.text}>
        a. Personal Information: Includes student name, ID, grade, and contact info.
        {'\n'}b. Educational Information: Assignments, grades, discussions.
        {'\n'}c. Device and Usage Data: IP address, device info, usage stats.
      </Text>

      <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
      <Text style={styles.text}>
        - To provide and maintain LMS functionality.
        {'\n'}- To facilitate communication.
        {'\n'}- To personalize the learning experience.
        {'\n'}- To comply with legal obligations.
      </Text>

      <Text style={styles.sectionTitle}>3. Sharing and Disclosure</Text>
      <Text style={styles.text}>
        We do not sell or rent your data. Information may be shared with school staff,
        service providers, or as legally required.
      </Text>

      <Text style={styles.sectionTitle}>4. Data Security</Text>
      <Text style={styles.text}>
        We use industry-standard security practices to protect your data.
      </Text>

      <Text style={styles.sectionTitle}>5. Children's Privacy</Text>
      <Text style={styles.text}>
        We comply with COPPA and FERPA. We do not knowingly collect data from children under 13 without proper consent.
      </Text>

      <Text style={styles.sectionTitle}>6. Your Rights</Text>
      <Text style={styles.text}>
        You may request access, correction, or deletion of your personal data through your school administrator.
      </Text>

      <Text style={styles.sectionTitle}>7. Policy Changes</Text>
      <Text style={styles.text}>
        We may update this policy and will notify users via the app or school.
      </Text>

      <Text style={styles.sectionTitle}>8. Contact Us</Text>
      <Text style={styles.sectionTitle}>Directors</Text>
      <Text style={styles.text}>
      NexGen-e Techno Solutions LLP{'\n'}
        Email: directors@nexgen-e.com{'\n'}
        Phone: +91 9677082133{'\n'}
        Address: 
        No. D3/46, SIDCO Nagar
25th Street,
Villivakkam, 
Chennai - 600 049.
Website: nexgen-e.com 

      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colorPalette.aliceBlue,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    paddingHorizontal: 20
  },
});

export default PrivacyPolicyScreen;
