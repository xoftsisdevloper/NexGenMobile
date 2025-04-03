import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import Video from 'react-native-video';
import { WebView } from 'react-native-webview';

function MaterialScreen() {
  const route = useRoute();
  const unit = route.params.item;
  const navigation = useNavigation();
  const VideoUrl = `https://drive.google.com/uc?export=download&id=${unit.content_url}`;
  const [loading, setLoading] = useState(true);

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
      <ScrollView>
        <View style={{ width: '100%' }}>
          {unit.content_type.toLowerCase() === 'video' ? (
            <View style={{ position: 'relative' }}>
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
                style={{ width: '100%', height: 250 }}
                resizeMode="cover"
                controls
                onLoadStart={() => setLoading(true)}
                onLoad={() => setLoading(false)}
              />
            </View>
          ) : (
            <WebView source={{ uri: `${unit.content_url}` }} style={{ height: 500 }}  />
          )}
        </View>

        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{unit.name}</Text>
          <Text style={{ marginVertical: 5 }}>{unit.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default MaterialScreen;
