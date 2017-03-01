/**
 * Created by Oakley Hall on 6/23/15.
 */
module.exports = function(){
  const context = this._context;
  const state = this.state;
  const props = this.props;
  const keystate = this._keystate;
  const that = this;
  let py;

  return {
    update() {
      py = state.player2y;
      if (keystate[props.wKey]){
        py = state.player2y - props.paddleSpeed;
        that.setState({player2y: py});
      }
      if (keystate[props.sKey]){
        py = state.player2y + props.paddleSpeed;
        that.setState({player2y: py});
      }
      // keep the paddle inside of the canvas
      py = Math.max(Math.min(py, props.height - props.paddleHeight), 0);
      that.setState({player2y: py});

    },
    draw(){
      context.fillRect(state.player2x, state.player2y,
        props.paddleWidth, props.paddleHeight);
    },
    name(){
      return 'player2';
    },
    position(y){
      if(y) {
        that.setState({player2y: y});
      }
      return{
        x: state.player2x,
        y: state.player2y
      }
    }
  };
};