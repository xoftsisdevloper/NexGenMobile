import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  Animated, 
  TouchableWithoutFeedback, 
  Dimensions, 
  LayoutAnimation, 
  StyleSheet 
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const CollapsibleView = ({ title, index, children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const contentRef = useRef(null);

  const toggleCollapse = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsed(!collapsed);
  };

  return (
    <View style={{ marginBottom: 5 }}>
      <TouchableWithoutFeedback onPress={toggleCollapse}>
        <View style={[styles.titleParent, index === 0 && { borderTopWidth: 0 }]}> 
          <View style={styles.titleContainer}>
            <View style= {{flexDirection: 'row', flex: 1,}}>
              <Text style={{color: '#85db51'}}>Subject {index + 1} : </Text>
              <Text style={{ fontWeight: '700', flexWrap: 'wrap', flexShrink: 2 }}>{title}</Text>
            </View>
            <View style={{marginLeft: 10}}>
            <Svg width="15" height="15" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              {collapsed ? (
                <Path d="M9 4.5l-3.5 3.5-3.5-3.5"/> 
              ) : (
                <Path d="M2.5 6h7"/> 
              )}
            </Svg>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {collapsed ? null : ( 
        <View style={{ overflow: 'hidden' }}>
          <View 
            ref={contentRef} 
            onLayout={() => {
              if (!collapsed) {
                contentRef.current?.measure((x, y, width, height) => {
                });
              }
            }}
          >
            {children}
          </View>
        </View>
      )}
    </View>
  );
};

export default CollapsibleView;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align title and icon
    alignItems: 'flex-start',
  },
  titleParent: {
    padding: 10,
    paddingBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
  }
});