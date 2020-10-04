import React, { Component } from 'react';
import SquareBtn from '../SquareBtn/SquareBtn';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useRouteMatch,
  useParams
} from "react-router-dom";

class CreateLobby extends Component {

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
        <h1>Create Lobby</h1>
        <NavLink 
          to="/joinlobby"
          className = "navButton"  
        >Login to Spotify</NavLink>
      </div>
    );
  }
  
}

export default CreateLobby;
