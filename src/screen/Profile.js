import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as firebase from 'firebase';
import Slider from 'react-native-multislider';
import CircleImage from './CircleImage';
import Button from '../common/Button';
const { width } = Dimensions.get('window');

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ageValue: this.props.navigation.state.params.user.ageRange,
      distanceValue: [ this.props.navigation.state.params.user.distance ],
      show: this.props.navigation.state.params.user.interestGender,
      user: this.props.navigation.state.params.user,
    };
    this.valueChange = this.valueChange.bind(this);
    this.updateUser = this.updateUser.bind(this);
    console.log('fucking params', this.props.navigation.state.params.distance);
    console.log('this state ', this.state);
  }

  valueChange(val) {
    val.length === 2 ? this.setState({ageValue: val}) : this.setState({distanceValue: val});
  }

  interestGenderValue(val) {
    this.setState({show: val});
    this.updateUser('interestGender', val);
  }

  updateUser(key, val) {
    const {uid} = this.state.user;
    firebase.database().ref('users').child(uid).update({[key]: val});
  }

  render() {
    const { first_name, id } =  this.state.user;
    const { show, distanceValue } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <CircleImage fbID={id} size={100} />
          <Text style={styles.nameText}>{first_name}</Text>
        </View>
        <View>
          <View style={{marginLeft: 20}}>
            <Text style={{fontSize: 16}}>Your Interest is {show}</Text>
          </View>
          <View>
            <View style={styles.interestContainer}>
              <Button
                onPress={() => this.interestGenderValue('Women')}
                value="Women"
                show={show}
              />

              <Button
                onPress={() => this.interestGenderValue('Men')}
                value="Men"
                addStyle={styles.addStyle}
                show={show}
              />

              <Button
                onPress={() => this.interestGenderValue('Both')}
                value="Both"
                show={show}
              />

            </View>
          </View>
          <View style={styles.lable}>
            <Text>Distance Preferance</Text>
            <Text style={styles.ageRangeText}>{distanceValue} Km</Text>
          </View>
          <Slider
            min={1}
            max={30}
            values={distanceValue}
            onValuesChange={this.valueChange}
            onValuesChangeFinish={(val) => this.updateUser('distance', val[0])}
          />

          <View style={styles.lable}>
            <Text>Age Preferance</Text>
            <Text style={styles.ageRangeText}>{this.state.ageValue.join(' - ')}</Text>
          </View>
          <Slider
            min={18}
            max={70}
            values={this.state.ageValue}
            onValuesChange={this.valueChange}
            onValuesChangeFinish={(val) => this.updateUser('ageRange', val)}
          />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFD1DC',
    flex: 1,
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 17,
    color: 'darkgrey',
  },
  lable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  ageRangeText: {
    color: 'darkgrey',
  },
  interestContainer: {
    flexDirection: 'row',
    width: width * 0.9,
    height: 30,
    margin: 20,
    borderWidth: 0.5,
    borderRadius: 5,
  },
  addStyle: {
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
  },
});

export default Profile;

