import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ToastAndroid,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import DocumentPicker, {types} from 'react-native-document-picker';
import {scale, verticalScale} from '../../components/scale';
import {COLORS} from '../../constant/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import SearchBar from '../../components/searchBar';
import ListCard from '../../components/ListCard';
import {updateSongsServerAPI} from '../../Service/songsService';

import {useNavigation} from '@react-navigation/native';

import NetInfo from '@react-native-community/netinfo';
import AppButton from '../../components/forms/AppButton';
import {
  fetchSongsListingsModel,
  uploadSongsDataModel,
  searchSongsDataModel,
  fetchSongsListingsHiiddenModel,
} from '../../models/songanizeModel';

import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'Songanizeoffline.db'});

export default function Songanize() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fileUploading, setfileUploading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [songFile, setSongFile] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  //Button text change
  const [isText, setText] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [hiddenSongs, setHiddenSongs] = useState(false);

  const [userId, setUserId] = useState('');
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState('');

  //for sorting
  const [sortAscending, setSortAscending] = React.useState(false);
  const [sortFieldName, setSortFieldName] = React.useState(null);

  //check status mode
  const [mode, setMode] = useState('');

  // redirect authenticated user to profile screen

  useEffect(() => {
    readUserId('user_id');
    readUserKey('user_key');
    readUserName('user_name');
    AsyncStorage.setItem('user_loggedIn', 'false');
    // refreshData();
    getNetInfo();
  }, []);

  useEffect(() => {
    refreshData();
  }, [userKey, userName, userId]);

  useEffect(() => {
    if (
      (userKey == '' && userName == '' && userId == '') ||
      (userKey == null && userName == null && userId == null)
    ) {
      navigation.navigate('Login');
    } else {
      navigation.navigate('DrawerNavigationRoutes');
    }
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
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    setLoading(true);

    fetchSongsListingsModel(userKey, userName, userId)
      .then(data => {
        setTableData(data);
        setLoading(false);
        setIsRefreshing(false);
      })
      .catch(error => console.log(error));
  }, [userKey, userName, userId]);

  const sortedItems = tableData
    .slice()
    .sort((item1, item2) =>
      sortFieldName == 'title'
        ? sortAscending
          ? item1.title.localeCompare(item2.title)
          : item2.title.localeCompare(item1.title)
        : sortFieldName == 'interpret'
        ? sortAscending
          ? item1.interpret.localeCompare(item2.interpret)
          : item2.interpret.localeCompare(item1.interpret)
        : sortFieldName == 'category'
        ? sortAscending
          ? item1.category.localeCompare(item2.category)
          : item2.category.localeCompare(item1.category)
        : sortFieldName == 'img_data'
        ? sortAscending
          ? item1.img_data.localeCompare(item2.img_data)
          : item2.img_data.localeCompare(item1.img_data)
        : '',
    );
  const doSort = column => {
    if (column == 'title') {
      setSortAscending(!sortAscending);
      setSortFieldName('title');
    } else if (column == 'interpret') {
      setSortAscending(!sortAscending);
      setSortFieldName('interpret');
    } else if (column == 'category') {
      setSortAscending(!sortAscending);
      setSortFieldName('category');
    }
  };
  const lodeMoreData = () => {
    if (!loading) {
    }
  };
  const updateQuery = input => {
    if (input) {
      searchSongsDataModel(userId, input)
        .then(data => {
          setSearchActive(true);
          setSearchText(input);
          setTableData(data);
        })
        .catch(error => console.log(error));
    } else {
      setSearchText('');
      setSearchActive(false);
      refreshData();
    }
  };
  const hiddenSongsList = () => {
    if (!isText) {
      fetchSongsListingsHiiddenModel(userKey, userName, userId)
        .then(data => {
          if (data.length > 0) {
            setHiddenSongs(true);
            setText(true);
            setTableData(data);
          } else {
            setHiddenSongs(true);
            setText(true);
            setTableData([]);
          }
        })
        .catch(error => console.log(error));
    } else {
      setText(false);
      setHiddenSongs(false);
      refreshData();
    }
  };
  const ListEmptyComponent = ({item}) => {
    return (
      <View style={styles.loading}>
        <Text style={styles.emptyListStyle}>No Data Found</Text>
        {loading ? (
          <ActivityIndicator size="large" color="orange"></ActivityIndicator>
        ) : (
          ''
        )}
      </View>
    );
  };
  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.8,
          width: '100%',
          backgroundColor: COLORS.itemSeperator,
          alignItems: 'center',
        }}
      />
    );
  };
  const handleDocumentSelection = async () => {
    setfileUploading(true);
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf, types.images, types.plainText],
      });

      if (response[0].uri) {
        RNFS.readFile(response[0].uri, 'base64')
          .then(async res => {
            let uploadFile = response[0].name;
            let uploadFileType = response[0].type;
            setSongFile(uploadFile);

            if (uploadFile) {
              let date = new Date();
              var getExtension = uploadFileType.slice(
                uploadFileType.lastIndexOf('/') + 1,
              );

              if (uploadFileType == 'text/plain') {
                getExtension = 'txt';
              }

              const randomName =
                'file_' +
                Math.floor(date.getTime() + date.getSeconds() / 2) +
                '.' +
                getExtension;
              await checkPermissionDownload(userName, randomName, res);

              uploadSongsDataModel(
                userId,
                randomName,
                getExtension,
                uploadFileType,
              )
                .then(data => {
                  console.log('uploadSongsDataModel' + JSON.stringify(data));
                  if (mode === 'online') {
                    updateSongsServerAPI(
                      res,
                      randomName,
                      getExtension,
                      userKey,
                      userId,
                      userName,
                      dispatch,
                    )
                      .then(resut => {
                        setfileUploading(false);

                        setSongFile('');
                        refreshData();
                      })
                      .catch(error => console.log(error));
                  } else {
                    setfileUploading(false);
                    setSongFile('');
                    refreshData();
                  }
                })
                .catch(error => console.log(error));
            }
          })
          .catch(err => {
            console.log(err.message, err.code);
          });
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const hasFilesPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    const isReadGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );

    if (hasPermission) {
      return true;
    }
    if (isReadGranted) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    const statusRead = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (statusRead === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (
      status === PermissionsAndroid.RESULTS.DENIED ||
      statusRead === PermissionsAndroid.RESULTS.DENIED
    ) {
      ToastAndroid.show('Files permission denied by user.', ToastAndroid.LONG);
    } else if (
      status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
      statusRead === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
    ) {
      ToastAndroid.show('Files permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
  };
  const checkPermissionDownload = async (userName, filename, img64Bit) => {
    const hasPermission = await hasFilesPermission();

    if (!hasPermission) {
      return;
    }
    if (hasPermission) {
      await createPersistedFolder(userName, filename, img64Bit);
    }
  };
  const createPersistedFolder = async (userName, filename, img64Bit) => {
    console.log(filename + userName);
    var folderName = 'songanize';

    try {
      const filesDir =
        Platform.OS === 'android'
          ? RNFS.DownloadDirectoryPath
          : RNFS.DocumentDirectoryPath;

      const folderPath = `${filesDir}/${userName}/${folderName}`;

      const folderExists = await RNFS.exists(folderPath);
      console.log(folderPath);
      if (!folderExists) {
        RNFS.mkdir(folderPath)
          .then(() => {
            console.log('Songanize Folder created successfully');
          })
          .catch(error => {
            console.error('Error creating folder:', error);
          });
      } else {
        console.log('Persisted folder already exists:', folderPath);
      }
      let date = new Date();
      var path = folderPath + '/' + filename;

      const {config, fs} = RNFetchBlob;
      fs.writeFile(path, img64Bit, 'base64').then(res => {
        console.log('File Id: ', res);
        console.log('File Saved successfully to local folder');
      }).catch;
      err => console.log('err File not saved', err)();
    } catch (error) {
      console.error('Error creating persisted folder:', error);
    }
  };
  return (
    <ScrollView style={styles.container} nestedScrollEnabled={true}>
      <View style={styles.screenOuter}>
        <View style={styles.screenInner}>
          <View style={styles.upperArea}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleDocumentSelection}>
              <AppButton
                onPress={() => handleDocumentSelection()}
                title="+ ADD SONGS"
                size="lg"
                backgroundColor={COLORS.editButtonColor}
              />
            </TouchableOpacity>

            {songFile && (
              <View style={{padding: 20, alignItems: 'center'}}>
                <Text style={{fontSize: 24, color: COLORS.logoColor}}>
                  {fileUploading
                    ? ToastAndroid.showWithGravity(
                        'File Uploading...',
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER,
                      )
                    : ''}
                </Text>
                <View style={{padding: 5}} />
                <View></View>
              </View>
            )}
          </View>

          <View style={styles.middleArea}>
            <View style={{alignContent: 'flex-start', width: '50%'}}>
              <SearchBar updateQuery={updateQuery} />
            </View>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => hiddenSongsList()}>
              <Text style={styles.toggleButtonText}>
                {isText ? 'My songlist' : 'My hidden songs'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.lowerArea}>
            <View style={styles.table_head}>
              <Text
                style={[styles.titleText, styles.heading_text]}
                onPress={() => doSort('title')}>
                Title
              </Text>
              <Text
                style={[styles.interpreetText, styles.heading_text]}
                onPress={() => doSort('interpret')}>
                Interpret
              </Text>
              <Text
                style={[styles.typeText, styles.heading_text]}
                onPress={() => doSort('category')}>
                Type
              </Text>
              <Text style={[styles.byPic, styles.heading_text]}>By</Text>
              <Text style={styles.moreOptions}></Text>
            </View>

            {/* backup for new design block start*/}

            {searchActive ? (
              <ListCard
                tableData={sortedItems}
                lodeMoreData={lodeMoreData}
                renderSeparator={renderSeparator}
                refreshData={refreshData}
                ListEmptyComponent={ListEmptyComponent}
              />
            ) : hiddenSongs && !isText ? (
              <ListCard
                tableData={sortedItems}
                lodeMoreData={lodeMoreData}
                renderSeparator={renderSeparator}
                refreshData={refreshData}
                ListEmptyComponent={ListEmptyComponent}
              />
            ) : !hiddenSongs && isText ? (
              <ListCard
                tableData={sortedItems}
                lodeMoreData={lodeMoreData}
                renderSeparator={renderSeparator}
                refreshData={refreshData}
                ListEmptyComponent={ListEmptyComponent}
              />
            ) : hiddenSongs ? (
              <ListCard
                tableData={sortedItems}
                lodeMoreData={lodeMoreData}
                renderSeparator={renderSeparator}
                refreshData={refreshData}
                ListEmptyComponent={ListEmptyComponent}
              />
            ) : (
              <ListCard
                tableData={sortedItems}
                lodeMoreData={lodeMoreData}
                renderSeparator={renderSeparator}
                refreshData={refreshData}
                ListEmptyComponent={ListEmptyComponent}
              />
            )}

            {/* backup for new design block end*/}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  screenOuter: {
    flex: 1,
    backgroundColor: COLORS.white,
    width: '100%',
  },
  screenInner: {
    flex: 1,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  heading: {
    fontSize: 24,
    marginLeft: '6%',
    marginVertical: 20,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  upperArea: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: verticalScale(20),
    width: '100%',
  },
  middleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  lowerArea: {
    paddingTop: verticalScale(15),
    width: '100%',
  },
  textInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '50%',
    borderRadius: 5,
    shadowColor: COLORS.black,
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
    borderColor: COLORS.BadlandsOrange,
  },
  toggleButton: {
    padding: 5,
    width: '40%',
    backgroundColor: COLORS.blue,
    borderRadius: 5,
  },
  toggleButtonText: {
    color: COLORS.white,
    textAlign: 'center',
  },
  tableHeader: {
    color: COLORS.black,
  },
  imageArea: {
    width: '20%',
  },
  userImage: {
    width: scale(40),
    height: verticalScale(40),
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    borderColor: COLORS.BadlandsOrange,
  },
  addbutton: {
    width: '100%',
    alignSelf: 'center',
  },
  buttonText1: {
    color: COLORS.black,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 'auto',
  },
  buttonText2: {
    color: COLORS.black,
    fontWeight: '600',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  tableContainer: {
    marginVertical: 20,
    width: '100%',
  },
  table_head: {
    width: '100%',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.itemSeperator,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  table_body: {
    flex: 1,
    width: '90%',
    padding: 0,
    margin: 0,
    flexGrow: 0,
    minHeight: '2%',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  titleText: {
    width: '25%',
    color: COLORS.black,
    fontWeight: 'bold',
  },
  interpreetText: {
    width: '25%',
  },
  typeText: {
    width: '20%',
  },
  byPic: {
    width: '20%',
  },
  moreOptions: {
    width: '10%',
  },
  heading_text: {
    color: COLORS.textListColorBold,
    fontWeight: '600',
  },
  emptyListStyle: {
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.textListColorBold,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
