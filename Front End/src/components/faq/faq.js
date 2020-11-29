import React, { Component } from 'react';
import SquareBtn from '../SquareBtn/SquareBtn';
import TwitterHandleInput from './../TwitterHandleInput/TwitterHandleInput';
import './faq.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useRouteMatch,
  useParams
} from "react-router-dom";

class faq extends Component {
    
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


  render() {
      return (
          <div>
              <h1>JukeBot</h1>
              <div>
                  <h2>FAQ</h2>
                  <div>
                      <h4>What is Jukebot?</h4>
                      <p>Jukebot is a crowd-sourcing tool for the Spotify queue. The days of hassling a party host for aux privileges are no longer- Jukebot lets you blast your favorite song through a decentralized song request process. Once a host creates a Jukebot session (via Spotify login), anyone with the session ID (join code) will be able to add songs to the session queue. You can find our GitHub link here. [add DevPost link]. This project was developed by three Vanderbilt University students (Berke Lunstad, Sam Stubbs, Lincoln Murr) for VandyHacks VII.</p>
                      <h4>How do I join a session?</h4>
                      <p>Joining a session is simple! Click the “join session” button and input the session ID that you can get from the host.</p>
                      
                  </div>
              </div>
          </div>




      )
  }

}