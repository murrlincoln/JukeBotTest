import React, { Component } from 'react';
import GuessBtn from './../GuessBtn/GuessBtn'
import './GamePlay.css'

class GamePlay extends Component {

  constructor(props){
    super(props)

    this.state = {
      nameOne: this.props.nameOne,
      nameTwo: this.props.nameTwo,
      correct: this.props.correct,
      tweet: this.props.tweet,
      callback: this.props.callback,
      disableBtn: false
    }

    this.handleClick = this.handleClick.bind(this);
  }

  // callback function passed into GuessBtns 
  handleClick(correct) {
    // this prevents a user from using multiple answers
    this.setState({
      disableBtn:true
    })
    this.state.callback(correct);
  }

  render(){
    return (
      <div>
        <h1>Which Twitter User Said This?</h1>
            <p className="tweetDisplay">
              {this.state.tweet.Text}
            </p>
            <div className="Button-container">
              <GuessBtn
                name = {this.state.nameOne}
                className = {this.state.correct === "0" ? "button success" : "button error"}
                callback = {this.handleClick}
                disabled = {this.state.disableBtn}
              />
              <GuessBtn
                name = {this.state.nameTwo}
                className = {this.state.correct === "1" ? "button success" : "button error"}
                callback = {this.handleClick}
                disabled = {this.state.disableBtn}
              />
            </div>
      </div>
    );
  }
  
}

export default GamePlay;


