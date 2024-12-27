import React, { Component } from 'react'
import { Image } from 'react-native'
import { scale, verticalScale } from '../components/scale';
var imgSrc = require('../images/logo.png')

const LogoImage = () => (
    <Image source = { imgSrc }  
    style={{width:scale(400), height:verticalScale(160), marginTop:20}}  
    resizeMode='contain' />
)
export default LogoImage