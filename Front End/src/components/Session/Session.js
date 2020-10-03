import React, { Component } from 'react';
import SquareBtn from '../SquareBtn/SquareBtn';

class Session extends Component {

  constructor(props){
    super(props)

  }

  // callback function passing state values up to Game to actually start the game
  startGame = () => {
    //this.state.startGame(this.state.twitterHandleOne,this.state.twitterHandleTwo)
  }

  render(){
    return (
      <div>
        <h1>Session</h1>

        <SquareBtn
          parentCallback = {this.startGame}
          name = "Session"
        />
      </div>
    );
  }
  
}

export default Session;
