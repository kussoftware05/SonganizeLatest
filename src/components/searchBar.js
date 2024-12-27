import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {scale, verticalScale} from './scale';

const SearchBar = props => {
  const queryRun = val => {
    props.updateQuery(val);
  };
  return (
    <View style={styles.searchSection}>
      <Icon style={styles.searchIcon} name="search" size={20} color="#000" />
      <TextInput
        style={styles.input}
        placeholder="Search"
        onChangeText={searchString => {
          queryRun(searchString);
        }}
        underlineColorAndroid="transparent"
      />
    </View>
  );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
  searchSection: {
    width: scale(180),
    height: verticalScale(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 5,
    marginTop: 10,
  },
  searchIcon: {
    flex: 1,
    width: '20%',
    padding: 10,
  },
  input: {
    width: scale(130),
    height: verticalScale(35),
    backgroundColor: '#ffffff',
    color: '#424242',
  },
});
