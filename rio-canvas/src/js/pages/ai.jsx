/**
 * Created by Oakley Hall on 6/23/15.
 */

module.exports = function(){
  const context = this._context;
  const state = this.state;
  const props = this.props;
  const that = this;
  let py;

  return {
    update: function() {
      py = state.aiy
      const desty = state.bally - (props.paddleHeight - props.ballSize)*0.5;
      py = py + (desty - py) * 0.1
      that.setState({aiy: py})
    },
    draw(){
      context.fillRect( state.aix, state.aiy,
        props.paddleWidth, props.paddleHeight);
    },
    name(){
      return 'ai';
    },
    position(){
      return{
        x: state.aix,
        y: state.aiy
      }
    }
  };
};