import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import config from './config';
import PixelWall from './PixelWall';

const previewWidth = 180;
const previewHeight = 102;

const TheComponent = class extends Component {
    displayName: 'TheComponent'

    constructor(props) {
        super(props);

        this.state = { text: '' };
    }

    send = () => {
        fetch(config.api + ':3001/text', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: this.state.text
            })
        })
        .then(response => this.setState({sending: false}))
        .catch(err => {
            console.log(err);
            alert('Sorry your text didn\'t make it to the wall');
            this.setState({sending: false});
        });
        this.setState({sending: true, text: ''});
    }

    orientationChange = (orientation) => this.setState({orientation});

    componentWillMount() {
        var initial = Orientation.getInitialOrientation();
        this.setState({initial, orientation: initial});
        Orientation.unlockAllOrientations();
    }

    componentDidMount() {
        Orientation.addOrientationListener(this.orientationChange);
    }

    componentWillUnmount() {
        Orientation.removeOrientationListener(this.orientationChange);
    }

    render () {
        const height = this.state.initial == this.state.orientation ? DeviceHeight : DeviceWidth;
        const width = this.state.initial == this.state.orientation ? DeviceWidth : DeviceHeight;
        const previewPos = {
            top: (height / 2) - (previewHeight / 2),
            left: (width / 2) - (previewWidth / 2),
            right: (width / 2) + (previewWidth / 2),
            bottom: (height / 2) - (previewHeight / 2)
        }
        return (
            <Flex>
                <TextInput
                    placeholder="Send text to the wall!"
                    value={this.state.text}
                    onChangeText={text => this.setState({text})}/>
                <View style={[styles.preview, previewPos]}>
                    <PixelWall width={previewWidth} height={previewHeight} />
                </View>
                <Button
                    disabled={this.state.sending || !this.state.text}
                    onPress={this.send}
                    title={this.state.sending ? 'Sending..' : 'Send!'}/>
            </Flex>
        )
    }
};

const styles = StyleSheet.create({
    preview: {
        position: 'absolute',
        width: previewWidth,
        height: previewHeight,
    },
})

TheComponent.propTypes = {};

module.exports = TheComponent;