import React from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';

const CustomButton = ({onPress, title, hasMarginBottom, theme}) => {
  const isPrimary = theme === 'primary';

  return (
    <View style={[styles.block, hasMarginBottom && styles.margin]}>
      <Pressable
        onPress={onPress}
        style={({pressed}) => [
          styles.wrapper,
          isPrimary && styles.primaryWrapper,
          Platform.OS === 'ios' && pressed && {opacity: 0.5},
        ]}
        android_ripple={{
          color: isPrimary ? '#fff' : '#6200ee',
        }}>
        <Text
          style={[
            styles.text,
            isPrimary ? styles.primaryText : styles.secondaryText,
          ]}>
          {title}
        </Text>
      </Pressable>
    </View>
  );
};

CustomButton.defaultProps = {
  theme: 'primary',
};

const styles = StyleSheet.create({
  block: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  wrapper: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  primaryWrapper: {
    backgroundColor: '#6200ee',
  },
  text: {
    fontSize: 14,
    fontWeight: 'blod',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#6200ee',
  },
  margin: {
    marginBottom: 8,
  },
});

export default CustomButton;
