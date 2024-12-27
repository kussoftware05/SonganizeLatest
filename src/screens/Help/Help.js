import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import {COLORS} from '../../constant/Colors';

const Help = () => {
  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.heading}>Help</Text>
        <Text style={styles.subHeading}>Please note that songanize is in an early stage, we launched the product recently.</Text>

        <Text style={styles.text}><Text>We will develop further functions and improve our apps continually. For help please contact us: webmaster@songanize.com. We’re always happy about feedback and questions 🙂

        </Text>Your songanize-team</Text>



         
        <Text style={styles.heading}>Song sheet list</Text>
        <Text style={styles.text}><Text style={styles.subHeading}>Upload:</Text> Drag and drop or tap in the upload zone to store your songs on songanize.
          Please make sure that you legally own all uploaded documents. So, you have to create this sheet by your own or only use, if you downloaded it before, only free versions!</Text>

        <Text style={styles.text}><Text style={styles.subHeading}>Refresh:</Text> Online click on your browsers refresh button. On mobile app pull-down (tap on top of page and wipe down) to reload the page.</Text>

        <Text style={styles.text}><Text style={styles.subHeading}>View:</Text>Simply tap on a song. Please note that .doc and .xls cannot be viewed in a browser. Better upload PDF.</Text>

        <Text style={styles.text}><Text style={styles.subHeading}>Edit:</Text> Add information to the song by taping the edit button.</Text>

        <Text style={styles.text}><Text style={styles.subHeading}>Download:</Text> You can download it to any device anytime. Just tap on the cloud symbol.</Text>

        <Text style={styles.text}><Text style={styles.subHeading}>Share:</Text> Press the orange share button and your group members see it in their personal song list.</Text>

        <Text style={styles.text}><Text style={styles.subHeading}>Hide:</Text> Someone shared a song and you don’t like it? Hide it from your list by pressing the orange X.</Text>

        <Text style={styles.text}><Text style={styles.subHeading}>Sort list:</Text> Simply tap on the headline of the table.</Text>



        <Text style={styles.heading}>FAQ</Text>
        <Text style={styles.text}>Some questions raise up when you use songanize. Hopefully you could find a quick solution with our FAQ´s</Text>

        <Text style={styles.subHeading}>A friend shared a song. Why can I not see it? </Text>
        <Text style={styles.text}>Simply please refresh your page. On mobile app pull-down (tap on top of page and wipe down) to reload the page.</Text>
        <Text style={styles.subHeading}>Can I use songanize just for myself?</Text>
        <Text style={styles.text}>Yes of course. Songanize will help you to organize all your song sheets and take them everywhere on every device.</Text>
        <Text style={styles.subHeading}>Can I share my song sheet only with one person?</Text>
        <Text style={styles.text}>Yes. Please create a group just for the two of you and you’ll be able to share with just one person.</Text>
      </View></ScrollView>
  )
}

export default Help

const styles = StyleSheet.create({
  container:{
    width: '100%',
    height: '100%',
    paddingHorizontal: 10,
    marginVertical: 20
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginVertical: 15
  },
  subHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.black,
    marginVertical: 15
  },
  text:{
    marginVertical: 10,
    color: COLORS.black
  }
})