import React, { Component } from 'react';
import Loading from './../Loading/Loading'
import Menu from './../Menu/Menu'
import GamePlay from './../GamePlay/GamePlay'
import RoundEnd from '../RoundEnd/RoundEnd';

class Game extends Component {

  constructor(props){
    super(props)
    this.state = {
      gameState: "start",
      twitterHandleOne: "",
      nameOne: "",
      tweetsOne: {},
      twitterHandleTwo: "",
      nameTwo: "",
      tweetsTwo: {},
      correctCount: 0,
      playedRounds: 0,
      totalRounds: 5
    }
    this.startGame = this.startGame.bind(this);
    this.setTwitterData = this.setTwitterData.bind(this);
    this.countAnswer = this.countAnswer.bind(this);
  }

  // callback function passed into the loading screen that allows tweets to be loaded
  setTwitterData = (nameOne, tweetsOne, nameTwo, tweetsTwo) => {
    this.setState({
      gameState: "gameplay",
      nameOne: nameOne,
      tweetsOne: tweetsOne,
      nameTwo: nameTwo,
      tweetsTwo: tweetsTwo
    })
  }

  // callback function passed into menu that initializes the game data
  startGame = (handleOne, handleTwo) => {
    this.setState({
      gameState: "loading",
      twitterHandleOne: handleOne,
      twitterHandleTwo: handleTwo,
      correctCount: 0,
      playedRounds: 0
    })
  }

  // callback function passed into gameplay that handles answering a question
  countAnswer = (correct) => {
    var self = this
    setTimeout(function () {
      const numCorrect = self.state.correctCount
      const numRound = self.state.playedRounds
      self.setState({
        correctCount: numCorrect + correct,
        playedRounds: numRound + 1,
        gameState: "round end"
      })
    }, 5000);
  }

  render(){
      if(this.state.gameState === "start"){
        return (
          <div>
            <Menu
              startGameCallback = {this.startGame}
            />
          </div>
        )
      } else if(this.state.gameState === "loading"){
        return (
          <div>
        <Loading
          twitterHandleOne = {this.state.twitterHandleOne}
          twitterHandleTwo = {this.state.twitterHandleTwo}
          setTwitterData = {this.setTwitterData}
        />
        
      </div>
        )
      } else if(this.state.gameState === "gameplay"){
        // flip a coin to choose which user to pick
        const chooseHandle = (Math.floor(Math.random() * 2) === 0)
        
        // pick a random tweet
        let correct, index, tweet;
        if(chooseHandle){
          correct = "0"
          index = Math.floor(Math.random() * this.state.tweetsOne.length)
          tweet = this.state.tweetsOne[index]
        }else{
          correct = "1"
          index = Math.floor(Math.random() * this.state.tweetsTwo.length)
          tweet = this.state.tweetsTwo[index]
        }
        return (
          <div>
            <GamePlay
              nameOne = {this.state.nameOne}
              nameTwo = {this.state.nameTwo}
              correct = {correct}
              tweet = {tweet}
              callback = {this.countAnswer}
            />
          </div>
        )
      } else if(this.state.gameState === "round end"){
        return (
          <div>
            <RoundEnd
              correctCount = {this.state.correctCount}
              playedRounds = {this.state.playedRounds}
              totalRounds = {this.state.totalRounds}
              callback = {() => {
                this.setState({
                  gameState: this.state.playedRounds < this.state.totalRounds ? "gameplay" : "start" 
                })
              }}
            />
          </div>
        )
      }
    
  }
  
}

export default Game;
