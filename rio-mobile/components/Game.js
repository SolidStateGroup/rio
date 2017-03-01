import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import PixelWall from './PixelWall';

const directionColor = '#333';
const previewHeight = (DeviceHeight / 2) - 40;
const previewWidth = Math.round(previewHeight / 9 * 16);

const DirectionButton = (props) => (
    <TouchableWithoutFeedback onPressIn={props.onPressIn} onPressOut={props.onPressOut}>
        <View title={props.text}
              style={styles.directionButton}>
            {props.name && (
                <ION size={32} name={"ios-arrow-drop" + props.name + ''} style={styles.directionButtonText}/>
            )}
        </View>
    </TouchableWithoutFeedback>
);

const ActionButton = (props) => (
    <TouchableWithoutFeedback onPressIn={props.onPressIn} onPressOut={props.onPressOut}>
        <View title={props.text}
              style={[styles.actionButton,{backgroundColor:props.color}]}
        >
        </View>
    </TouchableWithoutFeedback>
);

const Game = class extends Component {
  constructor (props, context) {
      super(props, context);
      this.state = { modalVisible: false };
      this.routes = [
        { name: 'Pong (2P)', url: 'pong-vs' },
        { name: 'Pong (AI)', url: 'pong' },
        { name: 'Snake', url: 'snake' },
        { name: 'Breakout', url: 'breakout' },
      ]
  }

  showModal = () => {
      this.setState({ modalVisible: true });
  };

  closeModal = () => {
      this.setState({ modalVisible: false });
  };

  sendRoute = (route) => {
      this.closeModal();
      this.props.ws && this.props.ws.send('route_' + route)
  };
  send = (message) => {
    if (this.state.player2 == true) {
        message += '2'
    }
    if (message.indexOf('RELEASE') == -1)
        ReactNative.Vibration.vibrate();
    this.props.ws && this.props.ws.send(message)
  }
  componentDidMount() {
    Orientation.lockToLandscape();
  }
  render () {
    return this.state.modalVisible ? (
      <View style={{flex:1}}>

          <Image source={require('./bg.jpg')}
                  style={{position:'absolute',top:0,bottom:0,left:0,right:0,width:null,height:null}}
                  resizeMode="cover"/>
          <View style={{flex:1}}>
              {this.routes.map((route) => (
                  <TouchableOpacity key={route.name} style={styles.route}
                                    onPress={()=>this.sendRoute(route.url)}>
                      <Text
                          style={{backgroundColor:'transparent', fontSize:24, fontWeight:'bold', color:'black'}}>{route.name}</Text>
                  </TouchableOpacity>
              ))}
          </View>

          <TouchableOpacity style={[styles.route, {position:'absolute',top:10,right:10}]}
                            onPress={()=>this.closeModal()}>
              <Text style={{backgroundColor:'transparent', fontWeight:'bold'}}>Close</Text>
          </TouchableOpacity>
      </View>
      ) : (
      <Flex>
        <Flex>
        </Flex>
        <View style={{backgroundColor:'#f1f1f1', height:(DeviceHeight / 2) + 20,  justifyContent:'center'}}>
            <Row style={{alignItems:'flex-end', paddingLeft:40, paddingRight:40}} space>
                <View>
                    <Row>
                        <DirectionButton horizontal name="left"
                                        onPressOut={()=>this.send('RELEASE')}
                                        onPressIn={()=>this.send('LEFT')}
                                        text="Left"/>
                        <View style={{justifyContent:'center'}}>
                            <DirectionButton name="up" onPressOut={()=>this.send('RELEASE')}
                                            onPressIn={()=>this.send('UP')} text="Up"/>
                            <DirectionButton/>
                            <DirectionButton name="down" onPressOut={()=>this.send('RELEASE')}
                                            onPressIn={()=>this.send('DOWN')} text="Down"/>
                        </View>
                        <DirectionButton horizontal name="right"
                                        onPressOut={()=>this.send('RELEASE')}
                                        onPressIn={()=>this.send('RIGHT')}
                                        text="Right"/>
                    </Row>
                </View>
                <View>
                    <Row>
                        <TouchableWithoutFeedback onPress={this.showModal}>
                            <View style={{alignItems:'center'}}>
                                <View style={styles.startButton}/>
                                <Text style={styles.startButtonText}>
                                    SELECT
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.showModal}>
                            <View style={{alignItems:'center'}}>
                                <View style={styles.startButton}/>
                                <Text style={styles.startButtonText}>
                                    START
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </Row>
                </View>
                <View style={styles.buttonContainer}>
                    <Row>
                        <ActionButton color="#00efb1" horizontal name="left"
                                    onPressOut={()=>this.send('RELEASE')}
                                    onPressIn={()=>this.send('S')}
                                    text="Left"/>
                        <View style={{justifyContent:'center'}}>
                            <ActionButton horizontal color="#006dff" name="up"
                                        onPressOut={()=>this.send('RELEASE')}
                                        onPressIn={()=>this.send('T')}
                                        text="Left"/>
                            <View style={{width:50,height:70}}/>
                            <ActionButton color="#ffbb4a" horizontal name="down"
                                        onPressOut={()=>this.send('RELEASE')}
                                        onPressIn={()=>this.send('X')}
                                        text="Left"/>
                        </View>
                        <ActionButton color="#ff4f5b" name="right"
                                    onPressOut={()=>this.send('RELEASE')}
                                    onPressIn={()=>this.send('C')}
                                    text="Left"/>
                    </Row>
                </View>
            </Row>
        </View>

        <View style={styles.playerSelect}>

            <TouchableOpacity
                onPress={()=>this.setState({player2:!this.state.player2})}>
                {this.props.isConnected ? (
                        <Text style={styles.lightText}>{this.state.player2 ? 'Player 2' : 'Player 1'}</Text>
                    ) : (
                        <Text style={styles.lightText}>Loading..</Text>
                    )}
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.preview}>
            <PixelWall width={previewWidth} height={previewHeight} />
        </TouchableOpacity>
    </Flex>
    )
  }
}

Game.propTypes = {
  ws: React.PropTypes.object,
  isConnected: React.PropTypes.bool
}

var styles = StyleSheet.create({
    lightText: { color: 'white' },
    playerSelect: {
        position: 'absolute',
        backgroundColor: 'red',
        padding: 10,
        margin: 10,
        borderRadius: 5
    },
    preview: {
        position: 'absolute',
        width: previewWidth,
        height: previewHeight,
        top: 10,
        left: (DeviceWidth / 2) - (previewWidth / 2),
        right: (DeviceWidth / 2) + (previewWidth / 2)
    },
    actionButton: {
        width: DeviceHeight / 6,
        height: DeviceHeight / 6,
        paddingTop: 5,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    directionButton: {
        width: DeviceHeight / 6,
        height: DeviceHeight / 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: directionColor
    },
    directionButtonText: {
        color: '#444'
    },
    startButton: {
        transform: [{ "rotate": "320deg" }],
        width: 50,
        paddingBottom: 15,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 30,
        marginTop: 20,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#222',
        backgroundColor: '#333',
    },
    startButtonText: {
        color: '#999',
    },
    buttonContainer: {
        borderRadius: 100,
        backgroundColor: '#f1f1f1'
    },
});

module.exports = Game;
