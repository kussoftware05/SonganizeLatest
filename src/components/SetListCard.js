import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {COLORS} from '../constant/Colors';
import {scale, verticalScale} from '../components/scale';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {Appbar} from 'react-native-paper';

export default function SetListCard({
  tableData,
  lodeMoreData,
  renderSeparator,
  refreshData,
  ListEmptyComponent,
}) {
  const navigation = useNavigation();
  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'forward';

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const Item = ({id, event, groupNames, date, refreshData}) => {
    setIsRefreshing(true);

    const goToEditPage = songId => {
      navigation.navigate('SongList', {songId: songId});
    };

    setIsRefreshing(false);
    return (
      <View style={styles.table_body}>
        <Text style={styles.eventText}>{event}</Text>
        <Text style={styles.groupsText}>{groupNames}</Text>
        <Text style={styles.dateText}>
          {moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY')}
        </Text>
        <View style={styles.moreArea}>
          <TouchableOpacity style={styles.iconColor}>
            <Appbar.Action
              icon={MORE_ICON}
              onPress={() => goToEditPage(id)}
              color={COLORS.textListColorBold}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={tableData}
        renderItem={({item}) => (
          <Item
            id={item.sid}
            event={item.event}
            groupNames={item.group_names}
            date={item.event_date}
            refreshData={refreshData}
          />
        )}
        onEndReached={lodeMoreData}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={ListEmptyComponent}
        nestedScrollEnabled={true}
        scrollEnabled={false}
        refreshing={isRefreshing}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            enabled={true}
            onRefresh={refreshData}
          />
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  heading: {
    fontSize: 24,
    marginLeft: '6%',
    marginVertical: 20,
    color: COLORS.black,
    fontWeight: 'semibold',
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
  container: {
    padding: 15,
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
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    width: '90%',
    borderStyle: 'dashed',
    borderWidth: 2,
    marginRight: 'auto',
    marginLeft: 'auto',
    height: verticalScale(120),
    borderColor: COLORS.BadlandsOrange,
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
  table_body: {
    flex: 1,
    flexGrow: 0,
    minHeight: '5%',
    width: '100%',
    padding: 0,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  eventText: {
    width: '30%',
    color: COLORS.textListColorBold,
    fontWeight: '600',
  },
  groupsText: {
    width: '30%',
    color: COLORS.textListColor,
  },
  dateText: {
    width: '30%',
    color: COLORS.textListColor,
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  heading_text: {
    color: COLORS.black,
    fontWeight: '500',
  },
  flatStyle: {
    flex: 1,
  },
  toolTipText: {
    color: COLORS.textListColorBold,
    fontWeight: 'bold',
  },
  moreArea: {
    width: '10%',
    margin: 0,
    padding: 0,
    paddingRight: 3,
    height: 65,
  },
});
