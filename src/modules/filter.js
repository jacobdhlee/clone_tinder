import _ from 'lodash';
import moment from 'moment';

export default (profiles, user, swipedProfiles) => {
  const reject = _.reject(profiles, profile => profile.uid === user.uid);

  const genderFilter = _.filter(reject, (profile) => {
    console.log(user.interestGender);
    if(user.interestGender === 'Men' && user.gender === 'male') {
      return profile.gender === "male" && (profile.interestGender === 'Men' || profile.interestGender === 'Both');
    }
    if(user.interestGender === 'Men' && user.gender === 'female') {
      return profile.gender === "male" && (profile.interestGender === 'Women' || profile.interestGender === 'Both');
    }
    if(user.interestGender === 'Women' && user.gender === 'male') {
      return profile.gender === "female" && (profile.interestGender === 'Men' || profile.interestGender === 'Both');
    }
    if(user.interestGender === 'Women' && user.gender === 'female') {
      return profile.gender === "female" && (profile.interestGender === 'Women' || profile.interestGender === 'Both');
    }
    if(user.interestGender === 'Both' && user.gender === 'male') {
      return (profile.gender === "female" || profile.gender === 'male') && (profile.interestGender === 'Men' || profile.interestGender === 'Both');
    }
    if(user.interestGender === 'Both' && user.gender === 'female') {
      return (profile.gender === "female" || profile.gender === 'male') && (profile.interestGender === 'Women' || profile.interestGender === 'Both');
    }
  })


  const userBirthday = moment(user.birthday, 'MM/DD/YYYY')
  const userAge = moment().diff(userBirthday, 'years')

  const filterAgeRange = _.filter(genderFilter, profile => {
    const profileBirthday = moment(profile.birthday, 'MM/DD/YYYY')
    const profileAge = moment().diff(profileBirthday, 'years')

    const withinRangeUser = _.inRange(profileAge, user.ageRange[0], user.ageRange[1] + 1)
    const withinRangeProfile = _.inRange(userAge, profile.ageRange[0], profile.ageRange[1] + 1)

    return withinRangeUser && withinRangeProfile;
  });

  const filtered = _.unionBy(filterAgeRange, 'uid');
  const filterSwiped = _.filter(filtered, profile => {
    const swiped = profile.uid in swipedProfiles;
    return !swiped;
  })


  return filterSwiped;
}