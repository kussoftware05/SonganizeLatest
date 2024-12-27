import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useState, useRef} from 'react';

import {useDispatch} from 'react-redux';
import backgroundImage from '../../images/background.png';

import TextForm from '../../components/forms/TextForm';
import CheckBoxKus from '../../components/forms/Checkbox';

import Loader from '../../components/Loader/Loader';
import LogoImage from '../../components/logo_image';
import {userRegister} from '../../redux/services/authActions';
import {COLORS} from '../../constant/Colors';
import {verticalScale} from '../../PixelRatio';

const Registration = ({navigation}) => {
  const dispatch = useDispatch();

  const [UserName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errortext, setErrortext] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const nameInput = useRef();
  const emailInput = useRef();
  const passwordInput = useRef();
  const firstNameInput = useRef();
  const lastNameInput = useRef();
  const [termsAccepted, settermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmitPress = () => {
    let pattern =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    let passwrdresult = pattern.test(password);

    if (!UserName) {
      nameInput.current.validateEmail();
    } else if (!password) {
      passwordInput.current.validateEmail();
    } else if (passwrdresult !== true) {
      ToastAndroid.show('Invalid Password', ToastAndroid.SHORT);
      return false;
    } else if (!email) {
      emailInput.current.validateEmail();
    } else if (!firstName) {
      firstNameInput.current.validateEmail();
    } else if (!lastName) {
      lastNameInput.current.validateEmail();
    } else {
      const dataToSend = {
        action: 'register_user',
        username: UserName,
        email: email,
        password: password,
        firstname: firstName,
        lastname: lastName,
      };

      setLoading(true);
      dispatch(userRegister(dataToSend)).then(res => {
        if (res.type == 'auth/register/rejected') {
          setLoading(false);
          setErrortext(res.payload);
        } else if (res.type == 'auth/register/fulfilled') {
          setLoading(false);
          Alert.alert(
            'Alert',
            'You have successfully registered in Songanize. Please check your mail.',
            [{text: 'OK'}],
            {cancelable: false},
          );
          navigation.navigate('Login');
        }
      });
    }
  };

  const handleCheckBox = () => {
    settermsAccepted(true);
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="always">
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImageStyle}
          resizeMode="cover">
          <View style={styles.innerContainer}>
            <View style={styles.middleArea}>
              <LogoImage />

              <TextForm
                placeholder="Username"
                type="text"
                isRequired={true}
                ref={nameInput}
                onChangeText={setUserName}
                className="inputViewTextIcon"
                returnKeyType="next"
                onSubmitEditing={() => passwordInput.current.focus()}
                blurOnSubmit={false}
              />
              <TextForm
                placeholder="Password"
                type="password"
                isRequired={true}
                secureTextEntry={true}
                ref={passwordInput}
                onChangeText={setPassword}
                returnKeyType="next"
                onSubmitEditing={() => emailInput.current.focus()}
                blurOnSubmit={false}
              />
              <TextForm
                placeholder="E-Mail"
                type="email"
                isRequired={true}
                ref={emailInput}
                onChangeText={setEmail}
                returnKeyType="next"
                onSubmitEditing={() => firstNameInput.current.focus()}
                blurOnSubmit={false}
              />
              <TextForm
                placeholder="First name"
                type="text"
                isRequired={true}
                ref={firstNameInput}
                onChangeText={setFirstName}
                returnKeyType="next"
                onSubmitEditing={() => lastNameInput.current.focus()}
                blurOnSubmit={false}
              />
              <TextForm
                placeholder="Last name"
                type="text"
                isRequired={true}
                ref={lastNameInput}
                onChangeText={setLastName}
              />

              <View style={styles.MainermsConditions}>
                <CheckBoxKus
                  selected={termsAccepted}
                  onPress={handleCheckBox}
                  text="I accept your terms and condition"
                />
              </View>
              {errortext != '' ? (
                <Text style={styles.errorTextStyle}> {errortext} </Text>
              ) : null}
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => handleSubmitPress()}>
                <Text style={styles.registerText}>Register Now</Text>
              </TouchableOpacity>
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text onPress={() => navigation.goBack()}>Login</Text>
              </Text>
              {password ? (
                <Text style={styles.errorMessage}>
                  [NOTE : Your password should be at least 7 characters. Please
                  use also at least one uppercase letter, one lowercase letter,
                  one number and one special signs like ! ? $ % &]
                </Text>
              ) : (
                ''
              )}
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  screenOuter: {
    flex: 1,
  },
  backgroundImageStyle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputStyle: {
    width: '80%',
    marginTop: 16,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: COLORS.white,
    borderRadius: 5,
  },
  registerButton: {
    padding: 2,
    width: '100%',
    height: verticalScale(35),
    borderRadius: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingVertical: 6,
    backgroundColor: COLORS.registratioButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
    color: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16,
    padding: 5,
    letterSpacing: 1,
    justifyContent: 'space-between',
  },
  checkboxView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'fitContent',
    width: '100%',
    height: 50,
    flexDirection: 'row',
  },
  logoImage: {
    height: '11%',
    width: '25%',
    justifyContent: 'center',
    margin: 'auto',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  termsText: {
    color: COLORS.white,
    fontSize: 17,
  },
  middleArea: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  innerContainer: {
    width: '70%',
  },
  checkboxStyle: {
    borderColor: COLORS.white,
    color: COLORS.white,
  },
  loginText: {
    marginTop: 15,
    color: COLORS.white,
    fontSize: 15,
    marginBottom: 10,
    fontWeight: '500',
  },
  MainermsConditions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    padding: 5,
  },
  errorMessage: {
    fontWeight: '500',
    fontSize: 15,
    color: COLORS.themeColor,
    width: '100%',
  },
});
