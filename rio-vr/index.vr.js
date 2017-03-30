import React from 'react';
import {
  AppRegistry,
  asset,
  StyleSheet,
  Pano,
  NativeModules,
  Text,
  View,
} from 'react-vr';
import {apiWs} from './config';
const PixelWall = NativeModules.PixelWallModule;


class riovr extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentWillMount() {
        var ws = new WebSocket(apiWs);
        // ws.binaryType = 'arraybuffer';
        ws.onmessage =(e) => {

            const json = JSON.parse(e.data);
            // console.log("Hey")
            PixelWall.set(json)
        };
    }

    render() {
    return (
      <View>

      </View>
    );
  }
};

AppRegistry.registerComponent('riovr', () => riovr);
