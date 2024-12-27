import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../../constant/Colors';
import ChangePasswordTextFiled from '../../components/forms/ChangePasswordTextField';
import {resetPassword} from '../../redux/services/authActions';
import {
  selectUserId,
  selectUserKey,
  selectUserName,
} from '../../redux/slices/authSlice';
import {scale} from '../../components/scale';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const userName = useSelector(selectUserName);
  const userKey = useSelector(selectUserKey);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const newPasswordInput = useRef();
  const confirmPasswordInput = useRef();

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleSubmitPress = async () => {
    let pattern =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    let passwrdresult = pattern.test(newPassword);

    if (!newPassword) {
      newPasswordInput.current.validateFiled();
    } else if (passwrdresult !== true) {
      ToastAndroid.show('Invalid Password', ToastAndroid.SHORT);
      return false;
    } else if (!confirmPassword) {
      confirmPasswordInput.current.validateFiled();
    } else if (confirmPassword !== newPassword) {
      setErrorText("Passwords Don't Match");
    } else {
      setErrorText('');
      let dataToSend = {
        action: 'reset_password',
        userId: userId,
        password: confirmPassword,
        user_key: userKey,
        user_name: userName,
      };
      setLoading(true);
      await dispatch(resetPassword(dataToSend)).then(res => {
        console.log('resetPassword' + JSON.stringify(res));
        if (res.type == 'auth/resetPass/rejected') {
          setLoading(false);
          setErrorText(res.payload);
        } else {
          setLoading(false);
          Alert.alert(
            'Success',
            'Password changed successfully. Please Login again.',
          );
        }
      });
    }
  };

  return (
    <ScrollView>
      <Text style={styles.heading}>Change Password</Text>
      <View style={styles.inputContainer}>
        <ChangePasswordTextFiled
          placeholder="New Password"
          isRequired={true}
          secureTextEntry={true}
          ref={newPasswordInput}
          value={newPassword}
          onChangeText={setNewPassword}
          className="inputViewTextIcon"
          style={styles.inputArea}
        />
        <ChangePasswordTextFiled
          placeholder="Repeat Password"
          isRequired={true}
          secureTextEntry={true}
          value={confirmPassword}
          ref={confirmPasswordInput}
          onChangeText={setConfirmPassword}
          className="inputViewTextIcon"
          style={styles.inputArea}
        />
      </View>
      {errorText ? (
        <View style={styles.errorControl}>
          <View>
            <Text style={styles.errorMsg}>{errorText}</Text>
          </View>
        </View>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={handleSubmitPress}>
        <Text style={styles.text}>Change password</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  inputArea: {
    width: scale(200),
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    shadowOpacity: 18,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 10,
  },
  inputContainer: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 20,
    marginHorizontal: 10,
    color: COLORS.textListColorBold,
  },
  button: {
    width: scale(240),
    marginTop: 25,
    padding: 10,
    borderRadius: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: COLORS.editButtonColor,
  },
  text: {
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 16,
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
  errorMsg: {
    color: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 'auto',
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
});
