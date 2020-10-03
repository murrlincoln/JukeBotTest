import React, { Component } from 'react';
import StartBtn from './../StartBtn/StartBtn';
import TwitterHandleInput from './../TwitterHandleInput/TwitterHandleInput';

class Menu extends Component {

  constructor(props){
    super(props)
    this.state = {
      twitterHandleOne: "",
      twitterHandleTwo: "",
      startGame: this.props.startGameCallback
    }
  }

  // callback function allowing inputs to set state
  setHandleOne = (childData) => {
    this.setState({twitterHandleOne: childData})
  }

  // callback function allowing inputs to set state
  setHandleTwo = (childData) => {
    this.setState({twitterHandleTwo: childData})
  }

  // callback function passing state values up to Game to actually start the game
  startGame = () => {
    this.state.startGame(this.state.twitterHandleOne,this.state.twitterHandleTwo)
  }

  render(){
    return (
      <div>
        <h1>Change++ Coding Challenge</h1>
        <TwitterHandleInput
          InputName="Twitter Handle One"
          parentCallback = {this.setHandleOne}
        />
        <TwitterHandleInput
          InputName="Twitter Handle Two"
          parentCallback = {this.setHandleTwo}
        />
        <StartBtn
          parentCallback = {this.startGame}
        />
        <p>Try these for the meme: AnnaKendrick47, owlcity, Kanyewest, cher, elonmusk</p>
      </div>
    );
  }
  
}

export default Menu;
