import React, { Component } from 'react';
import './App.css';
import Menu from './components/Menu/Menu';
import Session from './components/Session/Session';
import CreateLobby from './components/CreateLobby/CreateLobby';
import JoinLobby from './components/JoinLobby/JoinLobby';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const client = new W3CWebSocket('ws://localhost:8080/connectlobby/something');//+makeid(5));


class App extends Component {
  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const messageJSON = JSON.parse(message.data)
      const bodyJSON = JSON.parse(messageJSON.body)
      const textMsgJSON = JSON.parse(bodyJSON.body)

      this.messageHistory.value += textMsgJSON.textMsg + "\n"
      console.log(this.messageHistory.value)

      this.forceUpdate()
    };
  }

  render(){
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/joinlobby">
              <JoinLobby />
            </Route>
            <Route path="/session/:sessionID">
              <Session />
            </Route>
            <Route path="/createlobby">
              <CreateLobby />
            </Route>
            <Route path="/">
              <Menu />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
  
}

export default App;
