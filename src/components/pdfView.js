import React from 'react';
import { StyleSheet, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { scale, verticalScale } from './scale';

const PDFView = ({fileData}) => {

    const source2 ={uri:fileData};
  return (
        <View style={styles.container}>
            <Pdf
                trustAllCerts={false}
                source={source2}
                onLoadComplete={(numberOfPages,filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page,numberOfPages) => {
                    console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                    console.log(error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`);
                }}
                style={styles.pdf}/>
        </View>
  );
};
export default PDFView;

// styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25
    },
    pdf: {
        flex:1,
        width: scale(260),
        height: verticalScale(150)
    }
});