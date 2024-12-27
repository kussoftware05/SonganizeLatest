import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import React, {useState, useRef} from 'react';
import {useDispatch} from 'react-redux';
import backgroundImage from '../../images/background.png';
import {useNavigation} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import TextForm from '../../components/forms/TextForm';
import LogoImage from '../../components/logo_image';
import Loader from '../../components/Loader/Loader';
import {forgotPassword} from '../../redux/services/authActions';
import { verticalScale } from '../../PixelRatio';
import { COLORS } from '../../constant/Colors';

const ForgotPassword = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const emailInput = useRef();

  const handleSubmitPress = () => {
    if (!email) {
      emailInput.current.validateEmail();
    } else {
      setErrortext('');
      let dataToSend = {
        action: 'forgot_password',
        email: email,
      };
      setLoading(true);
      dispatch(forgotPassword(dataToSend)).then(res => {
        if (res.type == 'auth/forgotPassword/rejected') {
          setLoading(false);
          setErrortext(res.payload);
        } else if (res.type == 'auth/forgotPassword/fulfilled') {
          setLoading(false);
          console.log('forgotPassword' + JSON.stringify(res));
          var id = res.payload.id;
          var user_key = res.payload.user_key;
          navigation.navigate('ResetPassword', {id: id});
        }
      });
    }
  };

  return (
    <View style={styles.outerView}>
      <Loader loading={loading} />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="always">
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImageStyle}
          resizeMode="cover">
            <View style={styles.arrowButton}>
              <Icons
                name="arrow-back"
                size={25}
                color="white"
                onPress={() => navigation.goBack()}
                style={styles.goBackArrow}
              />
            </View>
          <View style={styles.innerContainer}>
            <View style={styles.outerMiddle}>
              <LogoImage />
              <View style={styles.middleArea}>
                <Text style={{color: 'white', fontSize: 23, fontWeight: 600}}>
                  Find your account
                </Text>
                <TextForm
                  placeholder="E-Mail"
                  type="text"
                  isRequired={true}
                  ref={emailInput}
                  onChangeText={setEmail}
                  className="inputViewTextIcon"
                />
                {errortext != '' ? (
                  <Text style={styles.errorTextStyle}> {errortext} </Text>
                ) : null}
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => handleSubmitPress()}>
                  <Text style={styles.findButtonText}>Find Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  outerView: {
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer:{
    width: '70%'
  },
  arrowButton:{
    marginTop: verticalScale(40),
    width:'auto',
    alignSelf: 'flex-start' 
  },
  textInputStyle: {
    width: '90%',
    marginTop: 16,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  sendButton: {
    padding: 2,
    width: '100%',
    height: verticalScale(35),
    borderRadius: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingVertical: 6,
    backgroundColor: COLORS.registratioButton,
    alignItems: 'center',
    justifyContent: 'center'
  },
  findButtonText: {
    color: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16,
    padding: 5,
    letterSpacing: 1,
    justifyContent: 'space-between',
},
  logoImage: {
    height: '20%',
    width: '45%',
    justifyContent: 'center',
    margin: 'auto',
    flexDirection: 'row',
    marginTop: 20,
  },
  middleArea: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  outerMiddle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  goBackArrow: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  errorTextStyle: {
    color: COLORS.red,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
});
