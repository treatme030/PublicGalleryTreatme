import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ActionSheetModal = ({visible, onClose, actions}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.background} onPress={onClose}>
        <View style={styles.whiteBox}>
          {actions.map((action) => (
            <Pressable
              key={action.text}
              style={styles.actionButton}
              android_ripple={{color: '#eee'}}
              onPress={() => {
                action.onPress();
                onClose();
              }}>
              <Icon
                name={action.icon}
                size={24}
                color="#757575"
                style={styles.icon}
              />
              <Text>{action.text}</Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  whiteBox: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 4,
    elevation: 2,
  },
  actionButton: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
  },
});

export default ActionSheetModal;
