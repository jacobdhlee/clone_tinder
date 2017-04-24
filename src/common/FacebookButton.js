import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';

const { width } = Dimensions.get('window');

class FacebookButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={this.props.onPress}>
        <View style={styles.buttonBox}>
          <Icon
            type="font-awesome"
            name="facebook"
            size={20}
            color={'white'}
          />
          <Text style={styles.buttonText}>Sign in with Facebook</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: width * 0.7,
    backgroundColor: '#3b5998',
    borderRadius: 50,
  },
  buttonBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    color: 'white',
    marginLeft: 20,
    fontWeight: '500',
  },
});

export default FacebookButton;
