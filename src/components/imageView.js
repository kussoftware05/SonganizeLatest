import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ToastAndroid,
} from 'react-native';

const ImageView = ({fileData}) => {

  const {width, height} = Dimensions.get('window');

  const [rotateLeft, setrotateLeft] = useState(0);
  const [imageWidth, setimageWidth] = useState(250);
  const [imageHeight, setimageHeight] = useState(650);

  const [imageresizeMode, setImageresizeMode] = useState('contain');
  const [maxImageWidth, setMaxImageWidth] = useState('');
  const [maxImageHeight, setMaxImageHeight] = useState('');
  const [minImageWidth, setMixImageWidth] = useState(100);
  const [maximumImageWidth, setMaximumImageWidth] = useState(550);

  useEffect(() => {
    if (fileData) {
      Image.getSize(
        fileData,
        (width, height) => {
          setMaxImageWidth(width);
          setMaxImageHeight(height);
          console.log(`The image dimensions are ${width}x${height}`);
        },
        error => {
          console.error(`Couldn't get the image size: ${error.message}`);
        },
      );
    }

  }, [fileData]);

  const rotateImageLeft = () => {
    let rtLft = rotateLeft - 90;
    setrotateLeft(rtLft);
  };
  const rotateImageRight = () => {
    let rtLft = rotateLeft + 90;
    setrotateLeft(rtLft);
  };
  const zoomInImage = () => {
    let zminimg = imageWidth + 10;
    if (maximumImageWidth == zminimg) {
      ToastAndroid.showWithGravity(
        'Imgae size in Maximum',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      setimageWidth(imageWidth);
    } else {
      setimageWidth(zminimg);
    }
  };
  const zoomOutImage = () => {
    if (imageWidth < 100 || imageWidth == 100) {
      ToastAndroid.showWithGravity(
        'Imgae size in Minimum',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      setimageWidth(minImageWidth);
    } else {
      let zmoutimg = imageWidth - 30;
      if (minImageWidth == zmoutimg) {
        ToastAndroid.showWithGravity(
          'Imgae size in Minimum',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setimageWidth(minImageWidth);
      } else {
        setimageWidth(zmoutimg);
      }
    }
  };
  const animatedScaleStyle = {
    transform: [{rotate: rotateLeft + 'deg'}],
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    subContainer: {
      width: '100%',
      height: '100%',
    },
    songImg: {
      width: imageWidth,
      height: imageHeight, 
      transform: [{rotate: '45deg'}],
      minWidth: minImageWidth,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      margin: 0,
      marginBottom: 10,
      marginTop: 10,
      height: '10%', 
    },
    buttonStyle: {
      margin: 10,
    },
    imageContainer: {
      flex: 1,
      height: '80%',
      width: '100%', 
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10
    },
    ImageIconStyle: {
      width: '50%',
      height: '50%',
      aspectRatio: 1,
      alignItems: 'center',
      objectFit: 'contain',
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        maximumZoomScale={5}
        scrollEnabled={true}
        minimumZoomScale={1}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.subContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => rotateImageLeft()}>
              <Image
                source={require('../images/btn_rotate_left.png')}
                style={styles.ImageIconStyle}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => rotateImageRight()}>
              <Image
                source={require('../images/btn_rotate_right.png')}
                style={styles.ImageIconStyle}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => zoomInImage()}>
              <Image
                source={require('../images/btn_zoom_in.png')}
                style={styles.ImageIconStyle}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => zoomOutImage()}>
              <Image
                source={require('../images/btn_zoom_out.png')}
                style={styles.ImageIconStyle}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.imageContainer}>
            {fileData ? (
              <Image
                style={[styles.songImg, animatedScaleStyle]}
                id="mySong"
                resizeMode={imageresizeMode}
                source={{
                  uri: fileData,
                }}
              />
            ) : (
              ''
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImageView;
