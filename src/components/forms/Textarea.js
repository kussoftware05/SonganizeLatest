import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  TextInput,
  View,
  Text,
} from 'react-native';
import GlobalStyles from '../../assests/css/Style';
import { COLORS } from '../../constant/Colors';

const Textarea = forwardRef((props, ref) => {
  const [value, setValue] = useState('');
  const [errorText, setErrorText] = useState('');
  useImperativeHandle(ref, () => ({
    validateEmail: validateEmail
  }));
  const validateEmail = () => {
    if (props.type == 'email') {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (!value) {
        setErrorText(<Text style={{ color: 'red' }}>Please enter email address</Text>);
      } else if (reg.test(value) === false) {
        setErrorText(<Text style={{ color: 'red' }}>The email address must include @</Text>);
      } else {
        setErrorText('')
      }
    }
    else if (props.type == 'password') {
      if (value.length === 0) {
        setErrorText(<Text style={{ color: 'red' }}>Please enter password</Text>)
      } else {
        setErrorText('')
        setValue(value)
      }
    }
    else {
      if (props.isRequired) {
        if (!value) {
          setErrorText(<Text style={{ color: 'red' }}>Please enter {props.label.toLowerCase()}</Text>);
        } else {
          setErrorText('')
        }
      }
      else {
        setErrorText('')
      }
    }
  }

  const handleChange = (val) => {
    props.onChangeText(val);
    if (props.type == 'email') {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (!val) {
        setErrorText(<Text style={{ color: 'red' }}>Please enter email address</Text>);
      } else if (reg.test(val) === false) {
        setErrorText(<Text style={{ color: 'red' }}>The email address must include @</Text>);
      } else {
        setErrorText('')
        setValue(val)
      }
    }
    else {
      if (props.isRequired) {
        if (!val) {
          setErrorText(<Text style={{ color: 'red' }}>Please enter {props.label.toLowerCase()}</Text>);
        } else {
          setErrorText('')
          setValue(val)
        }
      }
      else {
        setErrorText('')
        setValue(val)
      }
    }
  }
  return (
    <View style={GlobalStyles.inputView}>
      <Text style={GlobalStyles.signupLabel}>{props.label}{(props.isRequired) ? '*' : null}</Text>
      { props.type == 'textarea' ?
      (
      <View>       
          <TextInput
            style={{
              backgroundColor: COLORS.textInput,
              alignItems: 'flex-start',
              height: 100, 
              borderColor: COLORS.textInputBorder,
              borderWidth: 1,
              borderRadius: 5,
              marginBottom: 4,
              zIndex: 5,
            }}
            onChangeText={(event) => handleChange(event)}
            onBlur={validateEmail}
            multiline={true}
            numberOfLines={10}
          /> 
      </View>) : ''
      }
      <View style={GlobalStyles.mrgnBtn}>
        {
          (errorText) ?
            <View>
              <Text>{errorText}</Text>
            </View>
            : null
        }
      </View>
    </View>
  );
});

export default Textarea;