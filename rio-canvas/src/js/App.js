import React, {Component, PropTypes} from 'react';
import Header from './Header';
import config from './config';
import {withRouter} from 'react-router';
import socketHandler from './utils/socket';
const App = class extends Component {
  displayName: 'App';

  constructor (props, context) {
    super(props, context);
    this.state = {};
    socketHandler((data) => {
      var children = this.refs.child;
      if (data.indexOf('route_') != -1) {
        this.props.router.replace(data.replace('route_',''));
      } else {
        children.handleInput && children.handleInput(data);
      }
    })
  }

  onMessage = (data) => {
    const event = JSON.parse(data.data);
    if (event.event == 'load') {
      switch (event.catridge.toUpperCase()) {
        case 'P1P': // Pong
          this.props.router.replace('/pong');
          break;

        case 'PVS': // 2-Player Pong
          this.props.router.replace('/pong-vs');
          break;

        case 'SNK': // Snake
          this.props.router.replace('/snake');
          break;

        case 'BKT': // Breakout
          this.props.router.replace('/breakout');
          break;
      }
    }
  }

  render () {
    return (
      <div>
        <Header/>
        {React.cloneElement(this.props.children, {
          ref: "child"
        })}
      </div>
    );
  }
};

module.exports = withRouter(App);
