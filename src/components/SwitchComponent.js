import {Switch} from 'react-native';
import React, {useState} from 'react';

const SwitchComponent = props => {
  const [switchState, setSwitchState] = useState(props.value);
  const [groupId, setgroupId] = useState(props.item);

  const handleChange = (prevState, groupId) => {
    setSwitchState(prevState => !prevState);
    props.onValueChange(prevState, groupId);
  };
  return (
    <Switch
      key={props.item}
      trackColor={{false: '#767577', true: '#FFA500'}}
      value={switchState}
      onChange={props.onChange}
      onValueChange={prevState => handleChange(prevState, groupId)}
    />
  );
};

export default SwitchComponent;
