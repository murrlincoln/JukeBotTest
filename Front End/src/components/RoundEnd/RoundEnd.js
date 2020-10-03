import React, { Component } from 'react';
import NextBtn from '../NextBtn/NextBtn';

class RoundEnd extends Component {

  constructor(props){
    super(props)
    console.log(this.props.correctCount)
    console.log(this.props.totalRounds)
    this.state = {
      correctCount: this.props.correctCount,
      playedRounds: this.props.playedRounds,
      totalRounds: this.props.totalRounds,
      callback: this.props.callback
    }
    
  }



  render(){
    let message = ""
    if(this.state.playedRounds === this.state.totalRounds){
      message = "Game Over! Your Stats:"
    }else{
      message = "Your Current Accuracy:"
    }
    const percentCorrect = Math.round(this.state.correctCount / this.state.playedRounds * 100)
    return (
      <div>
        <h1>{message}</h1>
        <h1 style={{color: `rgb(${250-percentCorrect*2.5},${percentCorrect*2.5},30)`}}>{percentCorrect}%</h1>
        <NextBtn
          callback={this.state.callback}
        />
      </div>
    );
  }
  
}

export default RoundEnd;
