import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';

const SubButton = ({addStyle, name, type, color, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.subButtonContainer, addStyle]}>
        <Icon name={name} type={type} color={color} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  subButtonContainer: {
    height: 50,
    borderWidth: 1,
    width: 50,
    borderRadius: 25,
    justifyContent:'center',
    alignItems:'center',
  },
});

export default SubButton;
