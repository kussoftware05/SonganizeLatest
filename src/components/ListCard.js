import React, {useState, useEffect} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../constant/Colors';
import Loader from '../components/Loader/Loader';
import {scale, verticalScale} from '../components/scale';
import Popup from '../components/Modal';

import {btoa, atob} from 'react-native-quick-base64';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import PDFView from './pdfView';
import ImageView from './imageView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {Appbar, Avatar} from 'react-native-paper';

export default function ListCard({
  tableData,
  lodeMoreData,
  renderSeparator,
  refreshData,
  ListEmptyComponent,
}) {
  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [userId, setUserId] = useState('');
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    readUserId('user_id');
    readUserKey('user_key');
    readUserName('user_name');
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
  const Item = ({
    id,
    title,
    interpreet,
    type,
    offlinetype,
    by,
    link,
    filename,
    writer,
    category,
    genre,
    songkey,
    year,
    week,
    code,
    shared_pic,
    share_image_type,
    shared_song,
    hidden_file_id,
    hidden_song,
    group_id,
    shared_by_userid,
    userid,
    firstname,
    lastname,
    serverSGID,
    file_user_id,
    refreshData,
  }) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [activeItem, setActiveItem] = React.useState(null);
    const [viewModal, setViewModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fileContent, setFileContent] = useState('');
    const [sharedImage, setSharedImage] = useState('');
    const onPress = item => {
      setActiveItem(item);
      setModalVisible(true);
    };

    if (shared_pic !== '' && shared_pic !== null) {
      const folderName = 'songanizeshare';

      const filesDir =
        Platform.OS === 'android'
          ? RNFS.DownloadDirectoryPath
          : RNFS.DocumentDirectoryPath;
      const folderPath = `${filesDir}/${userName}/${folderName}`;

      var path = folderPath + '/' + shared_pic;

      RNFS.exists(path)
        .then(result => {
          if (result) {
            RNFetchBlob.fs.readFile(path, 'base64').then(dataBit => {
              if (
                share_image_type == 'jpeg' ||
                share_image_type == 'jpg' ||
                share_image_type == 'png'
              ) {
                var bitData =
                  'data:image/' + share_image_type + ';base64,' + dataBit;
                setSharedImage(bitData);
              }
            });
          } else {
            console.log('File Does not exist.--' + shared_pic);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }

    const viewFile = async (itemId, code) => {
      if (itemId) {
        setLoading(true);
        setViewModal(true);

        const folderName = 'songanize';

        const filesDir =
          Platform.OS === 'android'
            ? RNFS.DownloadDirectoryPath
            : RNFS.DocumentDirectoryPath;
        const folderPath = `${filesDir}/${userName}/${folderName}`;

        if (filename != '' && offlinetype != '') {
          var path = folderPath + '/' + filename;
        }
        if (code != '' && (offlinetype == '' || offlinetype == null)) {
          var path = folderPath + '/' + code;
        }

        RNFS.exists(path)
          .then(result => {
            if (result) {
              RNFetchBlob.fs.readFile(path, 'base64').then(data => {
                if (type == 'jpeg' || type == 'jpg' || type == 'png') {
                  var baseData = 'data:image/' + type + ';base64,' + data;
                  setFileContent(baseData);
                }
                if (type == 'txt') {
                  setFileContent(atob(data));
                }
                if (type == 'pdf') {
                  var baseData = 'data:application/' + type + ';base64,' + data;
                  setFileContent(baseData);
                }
              });
            } else {
              Alert.alert('File Does not exist.');
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        Alert.alert('File Does not exist here.');
      }
    };

    const hideViewModal = () => {
      setLoading(false);
      setViewModal(false);
      tableData;
      refreshData();
    };

    return (
      <View style={styles.screenOuter}>
        <TouchableOpacity onPress={() => viewFile(id, code)}>
          <View style={styles.table_body}>
            <Text style={styles.titleText}>
              {title == '' ? filename : title}
            </Text>
            <Text style={styles.interpreetText}>{interpreet}</Text>
            <Text style={styles.typeText}>{category}</Text>

            <View style={styles.imageArea}>
              {shared_pic !== '' && sharedImage ? (
                <Avatar.Image
                  style={styles.avatar}
                  source={{uri: sharedImage}}
                  size={40}
                />
              ) : (
                ''
              )}
            </View>
            <View style={styles.moreArea}>
              <TouchableOpacity style={styles.iconColor}>
                <Appbar.Action
                  icon={MORE_ICON}
                  onPress={() => onPress(id)}
                  color={COLORS.textListColorBold}
                />

                <Popup
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                  activeItem={activeItem}
                  titleEdit={title}
                  interpreetEdit={interpreet}
                  typeEdit={type}
                  byEdit={by}
                  linkEdit={link}
                  filenameEdit={filename}
                  writerEdit={writer}
                  categoryEdit={category}
                  genreEdit={genre}
                  keyEdit={songkey}
                  itemId={id}
                  fyear={year}
                  fweek={week}
                  fcode={code == '' ? filename : code}
                  fsharedPic={shared_pic}
                  fsharedSong={shared_song}
                  fhiddenFileId={hidden_file_id}
                  fhidden_song={hidden_song}
                  fgroupId={group_id}
                  fsharedByUserid={shared_by_userid}
                  fuserId={userid == null ? file_user_id : userid}
                  ffirstname={firstname}
                  flastname={lastname}
                  serverSGID={serverSGID}
                  tableData={tableData}
                  refreshData={refreshData}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={viewModal}
          onRequestClose={() => {
            hideViewModal();
          }}>
          <ScrollView style={styles.modalContainer}>
            <View style={styles.editModalView}>
              <View style={styles.editModalViewSub}>
                <Loader loading={loading} />
                <View style={styles.buttonCloseOptionContainer}>
                  <TouchableHighlight
                    style={{
                      ...styles.closeButton,
                      backgroundColor: COLORS.logoColor,
                    }}
                    onPress={() => {
                      hideViewModal();
                    }}>
                    <Icons name="close" size={35} color={COLORS.white} />
                  </TouchableHighlight>
                </View>
                <View style={styles.editModalViewSubInner}>
                  {type == 'jpeg' || type == 'jpg' || type == 'png' ? (
                    <ImageView fileData={fileContent} />
                  ) : type == 'txt' ? (
                    <ScrollView style={styles.fileContainer}>
                      <View style={styles.fileShow}>
                        <Text style={styles.fileShowText}>{fileContent}</Text>
                      </View>
                    </ScrollView>
                  ) : type == 'pdf' ? (
                    <PDFView fileData={fileContent} />
                  ) : (
                    ''
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={tableData}
        renderItem={({item}) => (
          <Item
            id={item.id}
            title={item.title}
            interpreet={item.interpret}
            type={item.type}
            offlinetype={item.offline_type}
            by={item.writer}
            link={item.link}
            filename={item.filename}
            writer={item.writer}
            category={item.category}
            genre={item.genre}
            songkey={item.song_key}
            year={item.year}
            week={item.week}
            code={item.fcode}
            shared_pic={item.shared_pic}
            share_image_type={item.share_image_type}
            shared_song={item.shared_song}
            hidden_file_id={item.hidden_file_id}
            hidden_song={item.hidden_song}
            group_id={item.song_group_id}
            shared_by_userid={item.shared_by_userid}
            userid={item.userid}
            firstname={item.firstname}
            lastname={item.lastname}
            serverSGID = {item.serverSGID}
            file_user_id={item.file_user_id}
            refreshData={refreshData}
          />
        )}
        onEndReached={lodeMoreData}
        keyExtractor={(item, index) => {
          return item.id;
        }}
        nestedScrollEnabled={true}
        scrollEnabled={false}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshData} />
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: '100%',
  },
  screenOuter: {
    flex: 1,
    backgroundColor: COLORS.white,
    width: '100%',
  },
  fileContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginTop: StatusBar.currentHeight || 0,
  },
  middleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
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
  songList: {
    padding: 2,
    width: '40%',
    backgroundColor: COLORS.blue,
    borderRadius: 5,
  },
  songListText: {
    color: COLORS.white,
    textAlign: 'center',
  },
  imageArea: {
    width: '20%',
  },
  moreArea: {
    width: '10%',
    margin: 0,
    padding: 0,
    paddingRight: 3,
    height: 65,
  },
  userImage: {
    width: scale(40),
    height: verticalScale(40),
  },
  button: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    borderStyle: 'dashed',
    borderWidth: 2,
    marginRight: 'auto',
    marginLeft: 'auto',
    height: verticalScale(120),
    borderColor: COLORS.editButtonColor,
  },
  buttonText1: {
    color: COLORS.black,
    fontSize: 22,
    fontWeight: '450',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  buttonText2: {
    color: COLORS.black,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  tableContainer: {
    marginVertical: 20,
    width: '100%',
  },
  table_head: {
    width: '90%',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.itemSeperator,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  table_body: {
    flex: 1,
    flexGrow: 0,
    minHeight: '2%',
    width: '100%',
    padding: 0,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  titleText: {
    width: '25%',
    color: COLORS.textListColorBold,
    fontWeight: 'bold',
  },
  interpreetText: {
    width: '25%',
    color: COLORS.textListColor,
  },
  typeText: {
    width: '20%',
    color: COLORS.textListColor,
  },
  byPic: {
    width: '20%',
  },
  moreOptions: {
    width: '10%',
    borderWidth: 1,
    borderColor: 'red',
  },
  heading_text: {
    color: COLORS.black,
    fontWeight: '500',
  },
  flatStyle: {
    flex: 1,
  },
  //start view modal
  editModalView: {
    flex: 1,
    justifyContent: 'center',
    width: '95%',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    elevation: 5,
    bottom: 0,
    borderTopColor: COLORS.lightgray,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: verticalScale(50),
    paddingBottom: 20,
    height: scale(600),
  },
  editModalViewSub: {
    width: '100%',
    height: '100%',
  },
  editModalViewSubInner: {
    width: '100%',
    height: '100%',
  },
  buttonCloseOptionContainer: {
    width: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 3,
    elevation: 3,
  },
  closeButton: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5,
    position: 'relative',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 16,
    borderColor: COLORS.black,
    fontWeight: '500',
  },
  infoLabel: {
    fontSize: 17,
    width: scale(150),
    borderColor: COLORS.black,
    fontWeight: '500',
  },
  infoField: {
    fontSize: 17,
    width: scale(150),
    borderColor: COLORS.black,
    fontWeight: '500',
  },
  fileShow: {
    margin: 10,
    fontSize: 20,
    width: '90%',
    height: '90%',
  },
  fileShowText: {
    fontSize: 17,
    fontWeight: '500',
  },
});
