import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {StyleSheet, Modal, ScrollView} from 'react-native';

import {TouchableOpacity, Text, View} from 'react-native';

const CheckBoxKus = ({
  selected,
  onPress,
  style,
  textStyle,
  size = 30,
  color = '#fff',
  text = '',
  ...props
}) => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsText, setTermsText] = useState('');
  const showModal = () => {
    setShowTermsModal(true);
    var textTerms = (
      <Text style={styles.text}>
        INTENTION A genius is unique. But only 5% is inspiration, 95% is
        transpiration for musicians. 100% on top and you create a perfect event
        to wow your audience. Organize it easily with songanize. Our mission is
        to create a world with more music. Music lights creativity, creates
        fancy moments, connect link-minded and, at the end, raise love for life.
        Be part of it! We empower people to build musical networks, discover
        talents and celebrate events. Organize it easily and create perfect
        events with songanize or only have fun to make music. Over time you will
        definitely find out how to better develop your skills and introduce
        advanced systems to improve your musical performance! songanize is in an
        early stage. Please send valuable feedback to webmaster (at)
        songanize.com and help us to better user experience and functionality
        quickly. SERVICES With songanize you receive a bunch of functionality:
        Upload documents (e.g. notes, chords, full scores, lyrics, song sheets)
        Administer your groups, contacts and songs Store “best practice”-links
        (e.g. songs, videos) Create events, send invitations and improve reach
        Share information and discover inspiration On top we organize a backup
        to save your data regularly. If you´re switching your device or losing
        it, no problem, you receive all songs back from songanize at any time!
        Important information: songanize is a cost-free service. But ongoing
        operation of this platform is not free of expenses for us. That´s why we
        integrate some pieces of commercial advertising to finance development,
        services and availability. Under no circumstance shall we have any
        liability to you for any loss or damage of any kind incurred as a result
        of the use of songanize or reliance on any information provided on
        songanize. Your use of songanize and your reliance on any information is
        solely at your own risk. YOUR COMMITMENT songanize is a service from
        musicians for musicians and planned to be free. This is the reason why
        we beg you to stay in also with some strong commitments. When people
        communicate transparent and open, the whole community is more
        accountable to achieve a common goal: Make music and have fun! Provide
        accurate information about yourself Use only one account with your
        “everyday”-name Save passwords and do not share your account t anyone
        else without permission Make sure that you are legal owner of any
        uploaded content and do not infringe copyright or intellectual property
        rights. Of course we are not accepting any discriminatory or generally
        misleading communication on songanize. Also you may not use our platform
        to violent someone else`s rights. It is strongly forbidden to manipulate
        software code and upload viruses or malware to affect proper operations
        of platform and/or apps. In such cases we can remove content, block your
        username or delete your account. UPLOADED CONTENT Shared documents on
        the Site may contain unacceptable, illegal or invalid content. Uploaded
        and shared content of users is not investigated, or checked for
        accuracy, adequacy, validity, reliability, availability, completeness,
        legality or legitimacy by us. We are also not checking that the user who
        uploads documents like song sheets, lyrics, or files is the legal owner
        of this information. We are also not warrant, guarantee or step in
        responsibility for any copyright of a third party. PERMISSIONS You have
        all rights on content you create and share at any time. No further
        permission takes away or remove your personal rights. It is up to you to
        share your content with anyone else. For some todays and future services
        we need some extended permissions. Therefore you accept (with this
        terms) when you upload that we get a transferable and non-exclusive
        right to store, operate, distribute, modify, copy and translate uploaded
        data. This permission allows us, from a legal perspective, to operate
        the platform and deliver the announced services. In addition you grant
        us the permission that we are allowed to update software at your devices
        at any time to improve software, remove bugs and roll out updated
        functionality. You could quit these permissions by deleting your total
        account or single uploaded documents.
      </Text>
    );
    setTermsText(textTerms);
  };

  const hideActiveModal = () => {
    setShowTermsModal(false);
  };
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={[styles.checkBox, style]}
        onPress={onPress}
        {...props}>
        <Icon
          size={size}
          color={color}
          name={selected ? 'check-box' : 'check-box-outline-blank'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={showModal}>
        <Text style={styles.textStyle}> {text} </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={false}
        visible={showTermsModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          hideActiveModal();
        }}>
        <ScrollView>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>{termsText}</Text>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => hideActiveModal()}>
                <Icon name="close" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default CheckBoxKus;
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
  },
  checkBox: {
    alignItems: 'center',
  },
  textStyle: {
    color: '#fff',
    fontSize: 16,
    paddingTop: 5,
  },

  modalView: {
    margin: 20,
    width: '90%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 30,
  },
  buttonClose: {
    position: 'absolute',
    right: 25,
    top: 20,
    backgroundColor: 'red',
    borderRadius: 9,
  },
  text: {
    fontSize: 22,
  },
});
