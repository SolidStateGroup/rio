import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import SideMenu from 'react-native-simple-drawer';
import { ColorPicker } from 'react-native-color-picker';
import hexRgb from 'hex-rgb';
import config from './config';

const canvasWidth = DeviceWidth - 50;
const canvasHeight = DeviceHeight;

const Draw = class extends Component {
    constructor(props) {
        super(props);
        this.state = { showColorPicker: false };
    }
    onColorSelected = (color) => {
        this.webview.postMessage(JSON.stringify({op:'color', color: hexRgb(color)}));
        this.setState({color, showColorPicker: false});
    }
    componentWillMount() {
        this.props.ws && this.props.ws.send('route_');
        Orientation.lockToLandscape();
    }
    render() {
        const { width, height } = this.props;
        var jsCode = `
        const canvas = document.getElementById('canvas');
        canvas.width = ${canvasWidth};
        canvas.height = ${canvasHeight};
    `;
        return (
            <Flex>
              <Modal
                  visible={this.state.showColorPicker}
                  supportedOrientations={['portrait', 'landscape']}
                  transparent={true}>
                <Flex style={styles.colorPickerContainer}>
                  <ColorPicker
                      style={styles.colorPickerModal}
                      color={this.state.color}
                      onColorChange={color => this.setState({color})}
                      onColorSelected={this.onColorSelected} />
                </Flex>
              </Modal>
              <Row style={{flex: 1}}>
                <Column style={{alignSelf: 'stretch'}}>
                  <TouchableOpacity onPress={() => this.setState({showColorPicker: true})}>
                    <ION
                        name="ios-color-palette"
                        size={50}
                        style={{textAlign: 'center'}} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.webview.postMessage(JSON.stringify({op: 'clear'}))}>
                    <ION
                        name="ios-trash"
                        size={50}
                        style={{textAlign: 'center'}} />
                  </TouchableOpacity>
                </Column>
                <WebView
                    ref={webview => { this.webview = webview; }}
                    source={{html: `
                <html>
                    <head>
                      <title>Draw</title>
                    </head>
                    <body style="margin:0">
                        <canvas id="canvas" style="background-color: black" />
                        <script>
                          (() => {
                          var color = [255, 0, 0];
                          var ws;
                          document.addEventListener('message', (e) => {
                            var data = JSON.parse(e.data);
                            switch (data.op) {
                              case 'color':
                                color = data.color;
                                break;

                              case 'clear':
                                clear();
                                break;
                            }
                          });
                          const canvas = document.getElementById("canvas");
                          const ctx = canvas.getContext("2d");

                          const draw = (x, y) => {
                            const penSizeX = Math.floor(${canvasWidth / config.matrix.width});
                            const penSizeY = Math.floor(${canvasHeight / config.matrix.height});

                            x = Math.floor(x / penSizeX) * penSizeX;
                            y = Math.floor(y / penSizeY) * penSizeY;

                            ctx.fillStyle = 'rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', 255)';

                            var currentColor = ctx.getImageData(x, y, 1, 1);

                            if (currentColor.data[0] == color[0] && currentColor.data[1] == color[1] && currentColor.data[2] == color[2]) {
                              return;
                            }
                            ctx.fillRect(x, y, penSizeX, penSizeY);

                            var resizeCanvas = document.createElement('canvas');
                            resizeCanvas.width = ${config.matrix.width};
                            resizeCanvas.height =  ${config.matrix.height};
                            resizeCanvas.getContext('2d').drawImage(canvas, 0, 0, 60, 34);
                            var imageData = resizeCanvas.getContext('2d').getImageData(0, 0, 60, 34).data;
                            frame = [];
                            for (var i = 0; i < imageData.length; i += 4) {
                                frame.push(imageData[i]);
                                frame.push(imageData[i + 1]);
                                frame.push(imageData[i + 2]);
                            }
                            ws && ws.readyState == 1 && ws.send(JSON.stringify(frame));

                          };

                          const clear = () => {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ws && ws.readyState == 1 && ws.send(JSON.stringify(new Array(60 * 34 * 3).fill(0)));
                          };

                            var mouseDown;
                            const getOffset = (el) => {
                              el = el.getBoundingClientRect();
                              return {
                                left: el.left + window.scrollX,
                                top: el.top + window.scrollY
                              }
                            };
                            canvas.ontouchstart = (e) => {
                              mouseDown = true;
                              var parentOffset = getOffset(e.currentTarget.parentElement);
                              var relX = e.touches[0].pageX - parentOffset.left;
                              var relY = e.touches[0].pageY - parentOffset.top;
                              switch (e.which) {
                                case 1:
                                  isLeft = true;
                                  break;
                                default:
                                  isLeft = false;
                              }
                              draw(relX, relY);
                              e.preventDefault();
                            };
                            canvas.ontouchcancel = () => {mouseDown = false};
                            canvas.ontouchmove = (e) => {
                              var parentOffset = getOffset(e.currentTarget.parentElement);
                              var relX = e.touches[0].pageX - parentOffset.left;
                              var relY = e.touches[0].pageY - parentOffset.top;
                              if (mouseDown) {
                                draw(relX, relY);
                              }
                            };

                            const reconnect = () => {
                                setTimeout(() => {
                                    connect();
                                }, 1000);
                            };
                            const connect = () => {
                                ws = new WebSocket("ws://${config.dev ? 'localhost' : config.api}:3001/");
                                ws.onclose = () => {
                                    reconnect();
                                };
                                ws.onerror = () => {
                                    ws.close();
                                };
                            };
                            connect();
                          })();
                        </script>
                    </body>
                </html>`}}
                    injectedJavaScript={jsCode}
                    style={{ width: canvasWidth, height: canvasHeight}}
                    javaScriptEnabled={true}
                    scrollEnabled={false} />
              </Row>
            </Flex>
        )
    }
}

const styles = StyleSheet.create({
    colorPickerContainer: {
        backgroundColor: 'rgba(1, 1, 1, 0.5)',
        justifyContent: 'center',
    },
    colorPickerModal: {
        backgroundColor: '#f1f1f1',
        alignSelf: 'center',
        width: DeviceWidth * 3 / 4,
        height: DeviceHeight - 40,
        paddingHorizontal: 20,
        borderRadius: 5
    }
})

module.exports = Draw;
