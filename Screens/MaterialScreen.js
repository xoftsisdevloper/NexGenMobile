import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import Video from 'react-native-video';
import { WebView } from 'react-native-webview';
import Orientation from 'react-native-orientation-locker';
import Svg, { Path } from 'react-native-svg';
import { colorPalette } from '../assets/styles/Colors';

function MaterialScreen() {
  const route = useRoute();
  const unit = route.params.item;
  const navigation = useNavigation();
  const VideoUrl = `https://drive.google.com/uc?export=download&id=${unit.content_url}`;
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const videoHeight = (screenWidth * 9) / 16;
  const pdfHeight = 800;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `${unit.name.toUpperCase()} - ${unit.content_type.toUpperCase()}`,
      headerStyle: { backgroundColor: colorPalette.primary },
      headerTitleStyle: { fontWeight: 'semi-bold' },
    });
  }, [navigation, unit.name]);

  useEffect(() => {
    if (fullscreen) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, [fullscreen]);

  const handleProgress = (e) => {
    if (e.currentTime > 0) {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => setFullscreen(!fullscreen);

  const renderVideoPlayer = () => (
    <View style={{ flex: 1 }}>
      <Video
        source={{ uri: unit.content_url }}
        onError={(e) => console.log('Video Error:', e)}
        onProgress={handleProgress}
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)}
        style={styles.video}
        resizeMode="contain"
        controls
      />
      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      )}
      <TouchableOpacity onPress={toggleFullscreen} style={styles.fullscreenBtn}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {fullscreen ? (
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Exit Fullscreen
            </Text>
          ) : (
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Enter Fullscreen
            </Text>
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colorPalette.aliceBlue }}>
      {unit.content_type.toLowerCase() === 'video' ? (
        <>
          {!fullscreen ? (
            <View style={{ width: '100%', height: videoHeight }}>{renderVideoPlayer()}</View>
          ) : (
            <Modal visible={true} supportedOrientations={['landscape']} animationType="fade">
              <View style={{ flex: 1, backgroundColor: 'black' }}>{renderVideoPlayer()}</View>
            </Modal>
          )}
        </>
      ) : (
        <View style={{ width: '100%', height: pdfHeight }}>
          <WebView source={{ uri: unit.content_url }} style={{ flex: 1 }} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  },
  fullscreenBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(147, 147, 147, 0.59)',
    padding: 5,
    borderRadius: 5,
    zIndex: 999,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default MaterialScreen;
