import React, { Component } from 'react';
import './App.css';
import Menu from './components/Menu/Menu';
import Session from './components/Session/Session';
import CreateLobby from './components/CreateLobby/CreateLobby';
import JoinLobby from './components/JoinLobby/JoinLobby';
import faq from './components/faq/faq';
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



class App extends Component {
  

  render(){
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/joinlobby">
              <JoinLobby />
            </Route>
            <Route path="/session/:sessionID" component={Session}>
            </Route>
            <Route path="/createlobby">
              <CreateLobby />
            </Route>
            <Route path = "/faq/">
               <faq />
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
