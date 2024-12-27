import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {COLORS} from '../../constant/Colors';

import SetListCard from '../../components/SetListCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import SearchBar from '../../components/searchBar';
import AppButton from '../../components/forms/AppButton';
import Loader from '../../components/Loader/Loader';
import {
  fetchSetListingsModel,
  searchSetListDataModel,
} from '../../models/setlistModel';

import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'Songanizeoffline.db'});

const Setlist = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const [userId, setUserId] = useState('');
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState('');

  //for sorting
  const [sortAscending, setSortAscending] = React.useState(false);
  const [sortFieldName, setSortFieldName] = React.useState(null);

  //for searching
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [mode, setMode] = useState('');

  useEffect(() => {
    readUserId('user_id');
    readUserKey('user_key');
    readUserName('user_name');
  }, []);

  useEffect(() => {
    getNetInfo();
    onRefresh();
  }, [userKey, userName, userId]);

  // read storage data userID
  const readUserId = async user_id => {
    try {
      const userId1 = JSON.parse(await AsyncStorage.getItem(user_id));
      if (userId1 !== null) {
        setUserId(userId1);
      }
    } catch (e) {
      Alert.alert('Failed to fetch the data from storage');
    }
  };
  // read storage data userName
  const readUserName = async user_name => {
    try {
      const username1 = JSON.parse(await AsyncStorage.getItem(user_name));
      if (username1 !== null) {
        setUserName(username1);
      }
    } catch (e) {
      Alert.alert('Failed to fetch the data from storage');
    }
  };
  // read storage data userKey
  const readUserKey = async user_key => {
    try {
      const userKey1 = JSON.parse(await AsyncStorage.getItem(user_key));
      if (userKey1 !== null) {
        setUserKey(userKey1);
      }
    } catch (e) {
      Alert.alert('Failed to fetch the data from storage');
    }
  };

  const getNetInfo = () => {
    // To get the network state once
    NetInfo.fetch().then(state => {
      if (state.isConnected == true) {
        setMode('online');
      } else {
        setMode('offline');
      }
    });
  };
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setLoading(true);

    fetchSetListingsModel(userKey, userName, userId)
      .then(async data => {
        setData(data);
        setIsRefreshing(false);
        setLoading(false);
      })
      .catch(error => console.log(error));
  }, [userKey, userName, userId]);

  const lodeMoreData = async () => {
    if (!loading) {
    }
  };

  const pressed = () => {
    navigation.navigate('AddSetlistScreen', {itemId: 0});
  };

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: COLORS.itemSeperator,
          alignItems: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />
    );
  };
  const ListEmptyComponent = ({item}) => {
    return (
      // Flat List Item
      <View style={styles.loadingCircle}>
        <Text style={styles.emptyListStyle}>No Data Found</Text>
        {isRefreshing ? (
          <ActivityIndicator size="large" color="orange"></ActivityIndicator>
        ) : (
          ''
        )}
      </View>
    );
  };
  const updateQuery = input => {
    if (input) {
      searchSetListDataModel(userId, input)
        .then(data => {
          setSearchActive(true);
          setSearchText(input);
          setData(data);
        })
        .catch(error => console.log(error));
    } else {
      setSearchText('');
      setSearchActive(false);
      onRefresh();
    }
  };
  const sortedItems = data
    .slice()
    .sort((item1, item2) =>
      sortFieldName == 'event'
        ? sortAscending
          ? item1.event.localeCompare(item2.event)
          : item2.event.localeCompare(item1.event)
        : sortFieldName == 'event_date'
        ? sortAscending
          ? item1.event_date.localeCompare(item2.event_date)
          : item2.event_date.localeCompare(item1.event_date)
        : sortFieldName == 'group_names'
        ? sortAscending
          ? item1.group_names.localeCompare(item2.group_names)
          : item2.group_names.localeCompare(item1.group_names)
        : '',
    );

  const doSort = column => {
    if (column == 'event') {
      setSortAscending(!sortAscending);
      setSortFieldName('event');
    } else if (column == 'group_names') {
      setSortAscending(!sortAscending);
      setSortFieldName('group_names');
    } else if (column == 'event_date') {
      setSortAscending(!sortAscending);
      setSortFieldName('event_date');
    }
  };

  return (
    <ScrollView
      style={styles.fullScreen}
      nestedScrollEnabled={true}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.screenOuter}>
        <Loader loading={loading} />
        <View style={styles.screenInner}>
          <View style={styles.textView}>
            <Text style={styles.textHeading}>Setlist</Text>
          </View>

          <View style={styles.searchArea}>
            <View style={{alignContent: 'flex-start', width: '50%'}}>
              <SearchBar updateQuery={updateQuery} />
            </View>
            <View
              style={{width: '50%', paddingTop: 10, alignItems: 'flex-end'}}>
              <AppButton
                onPress={() => pressed()}
                title="Add New"
                backgroundColor={COLORS.editButtonColor}
              />
            </View>
          </View>
          <View style={styles.lowerArea}>
            <View style={styles.table_head}>
              <Text
                style={[styles.eventText, styles.heading_text]}
                onPress={() => doSort('event')}>
                Event
              </Text>
              <Text
                style={[styles.groupsText, styles.heading_text]}
                onPress={() => doSort('group_names')}>
                Group
              </Text>
              <Text
                style={[styles.dateText, styles.heading_text]}
                onPress={() => doSort('event_date')}>
                Date
              </Text>
            </View>
            {searchActive ? (
              <SetListCard
                tableData={sortedItems}
                lodeMoreData={lodeMoreData}
                renderSeparator={renderSeparator}
                refreshData={onRefresh}
                ListEmptyComponent={ListEmptyComponent}
              />
            ) : (
              <SetListCard
                tableData={sortedItems}
                lodeMoreData={lodeMoreData}
                renderSeparator={renderSeparator}
                refreshData={onRefresh}
                ListEmptyComponent={ListEmptyComponent}
              />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Setlist;

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  textView: {
    width: '100%',
    height: 'auto',
  },
  textHeading: {
    marginTop: 30,
    marginBottom: 20,
    fontSize: 25,
    color: COLORS.textListColorBold,
  },
  lowerArea: {
    flex: 1,
  },
  container: {
    padding: 15,
  },
  tableHeader: {
    color: 'white',
  },
  screenOuter: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  screenInner: {
    flex: 1,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  searchArea: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  listDragBox: {
    flex: 1,
    marginTop: 20,
    backgroundColor: 'white',
  },
  item: {
    backgroundColor: 'lightgrey',
    marginTop: 10,
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  //Table design start//
  table_head: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    padding: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.itemSeperator,
  },
  table_body: {
    flex: 1,
    width: '90%',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  eventText: {
    width: '30%',
    color: COLORS.black,
    fontWeight: 'bold',
  },
  groupsText: {
    width: '40%',
  },
  dateText: {
    width: '30%',
  },
  emptyListStyle: {
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.textListColorBold,
  },
  heading_text: {
    color: COLORS.textListColorBold,
    fontWeight: '600',
  },
  // Table design end //
  loadingCircle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
