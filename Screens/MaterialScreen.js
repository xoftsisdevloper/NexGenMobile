import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Video from 'react-native-video';
import { WebView } from 'react-native-webview';

function MaterialScreen() {
  const route = useRoute();
  const unit = route.params.item;
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: `${unit.name} - ${unit.content_type}`,
    });
  }, [navigation, unit.name]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView>
        <View style={{ width: '100%' }}>
          {unit.content_type.toLowerCase() === 'video' ? (
            <Video
              source={{ uri: `https://drive.google.com/uc?export=download&id=${unit.content_url}` }}
              onError={(e) => console.log('error', e)}
              style={{ width: '100%', height: 250 }}
              resizeMode="cover"
              controls
            />
          ) : (
            <WebView
              source={{ uri: `${unit.content_url}` }}
              style={{ height: 500 }}
            />
          )}
        </View>

        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' , }}>{unit.name}</Text>
          <Text style={{marginVertical: 5}}>{unit.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default MaterialScreen;