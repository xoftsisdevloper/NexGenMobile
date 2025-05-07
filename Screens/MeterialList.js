import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colorPalette } from '../assets/styles/Colors';
import SvgIcons from '../assets/styles/SvgIcons';

const MeterialList = () => {
  const route = useRoute();
  console.log("Meterials", route.params);

  // Ensure route.params and route.params.item exist before accessing materials
  const meterials = route.params?.item?.materials || [];
  console.log(meterials);

  const renderIcon = (contentType) => {
    switch (contentType) {
      case "video":
        return SvgIcons.videoIcons;
      case "pdf":
        return SvgIcons.pdfIcon;
      case "youtube":
        return SvgIcons.youtubeIcon;
      case "image":
        return SvgIcons.image;
      default:
        return null; // Or a default icon
    }
  };

  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <FlatList
          data={meterials}
          keyExtractor={(item) => item._id || item.name || Math.random().toString()} // Added fallback key
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.meterialContainer} onPress={() => {
              navigation.navigate('MaterialScreen', {item: item})
            }}>
              <View style={styles.iconContainer}>
                {renderIcon(item.content_type.toLowerCase())}
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.meterialText}>{item.name} - {item.content_type}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No materials available for this lesson.</Text>}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  meterialContainer: {
    backgroundColor: colorPalette.white,
    height: 70, // Adjusted height
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15, // Increased gap
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  meterialText: {
    fontSize: 18,
    color: colorPalette.black,
  },
  meterialDescription: {
    fontSize: 14,
    color: colorPalette.gray,
  },
  emptyText: {
    fontSize: 16,
    color: colorPalette.gray,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MeterialList;