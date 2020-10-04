import React, { Component } from 'react';
import './JoinLobby.css';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useRouteMatch,
  useParams
} from "react-router-dom";

class JoinLobby extends React.Component {

  constructor(props){
    super(props)
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
  }

  // callback function passing state values up to Game to actually start the game
  startGame = () => {
    //this.state.startGame(this.state.twitterHandleOne,this.state.twitterHandleTwo)
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render(){
    const session = "/session/"+this.state.value;
    return (
      <div>
        <h1>Join Lobby</h1>
        <input value={this.state.value} className="sessionJoin" onChange={this.handleChange} />
        
        <div>
          <NavLink to={session} className="navButton">Join Session</NavLink>
        </div>
        
      </div>
    );
  }
  
}

export default JoinLobby;
