import React, { Component } from 'react';
import SquareBtn from '../SquareBtn/SquareBtn';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
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
    const session = "/session/:"+this.state.value;
    return (
      <div>
        <h1>Join Lobby</h1>

        <input type="text" value={this.state.value} onChange={this.handleChange} />
        <Link to={session}>Join Session</Link>
      </div>
    );
  }
  
}

export default JoinLobby;
