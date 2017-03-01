export const initialState = {
  ballx: 100,
  bally: 100,
  ballSpeed: 0.5,
  velx: 0,
  vely: 0,
  aix: 700,
  aiy: 250,
  player2x: 700,
  player2y: 250,
  playerx: 10,
  playery: 250,
  playerScore: 0,
  player2Score: 0,
  aiScore: 0
}

export const defaultProps = {
  width: 750,
  height: 500,
  upArrow: 38,
  downArrow: 40,
  paddleHeight: 140,
  paddleWidth: 40,
  paddleSpeed: 1,
  ballSize: 15,
  wKey: 87,
  sKey: 83,
  player1Color: "#f0f",
  player2Color: "#00f"
}
