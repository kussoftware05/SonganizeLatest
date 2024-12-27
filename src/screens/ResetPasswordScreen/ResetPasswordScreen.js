import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Alert,
  ToastAndroid
} from 'react-native';
import React, {useState, useRef} from 'react';
import {useDispatch} from 'react-redux';

import backgroundImage from '../../images/background.png';
import {useNavigation} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import ChangePasswordTextFiled from '../../components/forms/ChangePasswordTextField';
import LogoImage from '../../components/logo_image';
import Loader from '../../components/Loader/Loader';
import {COLORS} from '../../constant/Colors';
import {scale, verticalScale} from '../../components/scale';
import {resetPassword} from '../../redux/services/authActions';

const ResetPasswordScreen = ({route}) => {

  const dispatch = useDispatch();

  const navigation = useNavigation();
  const userId = route.params.id;
  console.log('userId-resetPass=='+ userId)

  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const passwordInput = useRef();

  const confirmPasswordInput = useRef();

  const handleSubmitPress = async() => {
    let pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    let passwrdresult = pattern.test(password);

    if (!password) {
      passwordInput.current.validateFiled();
    }
    else if (passwrdresult !== true) {
      ToastAndroid.show('Invalid Password', ToastAndroid.SHORT);
      return false;
    }
    else if (!confirmpassword) {
      confirmPasswordInput.current.validateFiled();
    } else if (confirmpassword !== password) {
      setErrorText("Passwords Don't Match");
    } else {
      setErrorText('');
      let dataToSend = {
        action: 'reset_password',
        userId: userId,
        password: confirmpassword,
      };
      await dispatch(resetPassword(dataToSend)).then(res => {
        console.log("resetPass"+JSON.stringify(res))
        if (res.type == 'auth/resetPass/rejected') {
          setErrorText(res.payload);
        } else {
          Alert.alert(
            'Success',
            'Password changed successfully. Please Login again.',
            [
              {text: 'OK', onPress: () =>  navigation.navigate('Login')},
            ],
          );
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
            <Text style={styles.BackButton} onPress={() => navigation.goBack()}>
            <Icons
              name="arrow-back"
              size={25}
              color="white"
              onPress={() => navigation.goBack()}
              style={styles.goBackArrow}
            />
          </Text>

          <View style={styles.innerContainer}>
          <View style={styles.outerMiddle}>
            <LogoImage />
            <View style={styles.middleArea}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 25,
                  fontWeight: 600,
                  marginBottom: 10,
                }}>
                Reset Your Password
              </Text>
              <ChangePasswordTextFiled
                placeholder="Password"
                type="password"
                isRequired={true}
                secureTextEntry={true}
                ref={passwordInput}
                value={password}
                onChangeText={setPassword}
                className="inputViewTextIcon"
              />
              <ChangePasswordTextFiled
                placeholder="Confirm Password"
                type="password"
                isRequired={true}
                secureTextEntry={true}
                ref={confirmPasswordInput}
                value={confirmpassword}
                onChangeText={setConfirmPassword}
                className="inputViewTextIcon"
              />
              {errorText ? (
                <View style={styles.errorControl}>
                  <View>
                    <Text style={styles.errorMsg}>{errorText}</Text>
                  </View>
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() =>handleSubmitPress()}>
                <Text style={styles.findButtonText}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

export default ResetPasswordScreen;

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
    width: scale(320),
    height: verticalScale(280),
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
    position: 'absolute',
    marginTop: 10,
  },
  BackButton: {
    marginTop: verticalScale(40),
    width:'auto',
    alignSelf: 'flex-start' 
  },
  errorControl: {
    borderWidth: 2,
    alignItems: 'center',
    borderColor: COLORS.red,
    display: 'flex',
    flexDirection: 'row',
    height: 35,
    width: scale(200),
    borderRadius: 5,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 20,
  },
  errorMsg:{
    color: COLORS.red,  justifyContent: 'space-between',
    width: 'auto',
    alignItems: 'center',  marginLeft: 30,
    marginRight: 'auto', textAlign: 'center', 
    alignItems: 'center',display: 'flex', fontWeight: '500',
   marginHorizontal: 10,
   fontSize: 15,
  }
});
