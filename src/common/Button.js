import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
const { width } = Dimensions.get('window');

const Button = ({onPress, value, addStyle, show}) => {
  const backgroundColor = show === value ? { backgroundColor: 'red' } : {backgroundColor: 'rgba(0,0,0,0)'};
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container,  backgroundColor, addStyle]}>
        <Text style={[styles.textStyle]}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 30,
    width: width * 0.3,
    justifyContent:'center',
    alignItems:'center',
  },
  textStyle: {
    fontSize: 17,
  },
});

export default Button;

