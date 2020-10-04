import React, { Component } from 'react';
import SquareBtn from '../SquareBtn/SquareBtn';
import TwitterHandleInput from './../TwitterHandleInput/TwitterHandleInput';
import './Menu.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useRouteMatch,
  useParams
} from "react-router-dom";
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
        <h1>JukeBot</h1>
        <div>
          <NavLink 
            to="/joinlobby"
            className = "navButton"
          >Join Lobby</NavLink>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <div>
        <NavLink 
          to="/faq" 
          className = "navButton"
        >FAQ</NavLink>
        </div>
        
        
      </div>
    );
  }
  
}

export default Menu;
