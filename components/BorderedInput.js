import React from 'react';
import {StyleSheet, TextInput} from 'react-native';

const BorderedInput = ({hasMarginBottom, ...rest}, ref) => {
  // forwardRef: 특정 컴포넌트 내부에 있는 또 다른 컴포넌트에 ref를 설정할 때 사용
  return (
    <TextInput
      style={[styles.input, hasMarginBottom && styles.margin]}
      {...rest}
      ref={ref}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderColor: '#bdbdbd',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  margin: {
    marginBottom: 16,
  },
});

export default React.forwardRef(BorderedInput);
