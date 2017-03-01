import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import config from './config';

const TheComponent = class extends Component {
    displayName: 'TheComponent'

    componentWillMount () {
        const reconnect = () => {
            setTimeout(()=>reconnect(),1000)
        }
        const connect = () => {
            var ws = new WebSocket(config.apiWs);
            ws.binaryType = 'arraybuffer';
            ws.onmessage = (e) => {
                // var imageData = new ImageData(new Uint8ClampedArray(e.data), 60, 34);
                // console.log(imageData.data);
                // var canvas = document.createElement('canvas');
                // canvas.width = 60;
                // canvas.height = 34;
                // var imageData = new ImageData(new Uint8ClampedArray(e.data), 60, 34);
                // canvas.getContext('2d').putImageData(imageData, 0, 0);
                // document.getElementById('canvas').getContext('2d').drawImage(canvas, 0, 0, window.renderWidth, window.renderHeight);
            };
            ws.onclose = () => {
                reconnect();
            };
            ws.onerror = () => {
                ws.close();
            };
        };
        connect();
    }

    render () {
        const { width, height } = this.props;
        var jsCode = `
            window.renderWidth = ${width};
            window.renderHeight = ${height};
            document.getElementById('canvas').width = window.renderWidth;
            document.getElementById('canvas').height = window.renderHeight;
        `;
        return (
            <WebView
                ref={webview => { this.webview = webview; }}
                source={{html: `
                <html>
                    <head>
                    </head>
                     <body style="margin:0">
                        <canvas id="canvas" style="border: 1px solid" />
                        <script>
                        const reconnect = () => {
                            setTimeout(() => {
                                connect();
                            }, 1000);
                        };
                        const connect = () => {
                            var ws = new WebSocket("${config.apiWs}");
                            ws.binaryType = 'arraybuffer';
                            ws.onmessage = (e) => {
                                var canvas = document.createElement('canvas');
                                canvas.width = 60;
                                canvas.height = 34;
                                var imageData = new ImageData(new Uint8ClampedArray(e.data), 60, 34);
                                canvas.getContext('2d').putImageData(imageData, 0, 0);
                                document.getElementById('canvas').getContext('2d').drawImage(canvas, 0, 0, window.renderWidth, window.renderHeight);
                            };
                            ws.onclose = () => {
                                reconnect();
                            };
                            ws.onerror = () => {
                                ws.close();
                            };
                        };
                        connect();
                        </script>
                    </body>
                </html>`}}
                injectedJavaScript={jsCode}
                style={{width, height}}
                javaScriptEnabled={true}
                scrollEnabled={false} />
        )
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;