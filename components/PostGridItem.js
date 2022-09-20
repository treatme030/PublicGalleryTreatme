import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Image, Pressable, StyleSheet, useWindowDimensions} from 'react-native';

const PostGridItem = ({post}) => {
  const dimensions = useWindowDimensions();
  const size = (dimensions.width - 3) / 3;
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate('Post', {post});
  };

  return (
    <Pressable
      style={({pressed}) => [
        {
          opacity: pressed ? 0.6 : 1,
          width: size,
          height: size,
        },
        styles.block,
      ]}
      onPress={onPress}>
      <Image
        style={styles.image}
        source={{uri: post.photoURL}}
        resizeMode="cover"
        resizeMethod="resize"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  block: {
    margin: 0.5,
  },
  image: {
    backgroundColor: '#bdbdbd',
    width: '100%',
    height: '100%',
  },
});

export default PostGridItem;
