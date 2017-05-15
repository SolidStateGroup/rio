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
        ws.binaryType = 'arraybuffer';
        ws.onmessage =(e) => {
            PixelWall.set(Array.from(new Uint8Array(e.data)));
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
