import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from 'react-native';
import Video from 'react-native-video';
import { WebView } from 'react-native-webview';

function MaterialScreen() {
  const route = useRoute();
  const unit = route.params.item;
  const navigation = useNavigation();
  const VideoUrl = `https://drive.google.com/uc?export=download&id=${unit.content_url}`;
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get('window').width;
  const videoHeight = (screenWidth * 9) / 16; // 16:9 aspect ratio
  const pdfHeight = 800; // or any reasonable static height

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: `${unit.name} - ${unit.content_type}`,
    });
  }, [navigation, unit.name]);

  const handleProgress = (e) => {
    if (e.currentTime > 0) {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ width: '100%' }}>
        {unit.content_type.toLowerCase() === 'video' ? (
          <View style={{ position: 'relative', width: '100%', height: videoHeight }}>
            {loading && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#000000bd',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1,
                }}>
                <ActivityIndicator size="large" color="#0147ab" />
                <Text style={{ color: 'white', fontSize: 16, marginTop: 10 }}>
                  Loading video...
                </Text>
              </View>
            )}
            <Video
              source={{ uri: VideoUrl }}
              onError={(e) => console.log('Video Error:', e)}
              onProgress={handleProgress}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
              controls
              onLoadStart={() => setLoading(true)}
              onLoad={() => setLoading(false)}
            />
          </View>
        ) : (
          <View style={{ width: '100%', height: pdfHeight }}>
            <WebView source={{ uri: unit.content_url }} style={{ flex: 1 }} />
          </View>
        )}
      </View>
    </View>
  );
}

export default MaterialScreen;
