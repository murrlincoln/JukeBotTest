import React, { Component } from 'react';
import SquareBtn from '../SquareBtn/SquareBtn';
import { w3cwebsocket as W3CWebSocket } from "websocket";

var client 

class Session extends Component {
  constructor(props){
    super(props)
    console.log(props.match.params)
    this.state = {
      sessionID: props.match.params.sessionID,
      value: "",
      songs: []
    }

    this.addSong = this.addSong.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    //const client = new W3CWebSocket('ws://localhost:8080/connectlobby/something');//+makeid(5));
  }

  componentWillMount() {

    client = new W3CWebSocket('ws://localhost:8080/connectlobby/'+this.state.sessionID)
    
    let myWindow
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const messageJSON = JSON.parse(message.data)
      console.log(messageJSON)

      if(messageJSON.type === 0){
        myWindow = window.open(messageJSON.body, "MsgWindow", "width=400,height=600")
      }else if(messageJSON.type === 1){
        myWindow.close()
      }else if(messageJSON.type === 2){
        this.setState({
          songs: JSON.parse(messageJSON.body)
        })
        console.log(this.state.songs)
      }
      
      //const bodyJSON = JSON.parse(messageJSON.body)
      //const textMsgJSON = JSON.parse(bodyJSON.body)

      //this.messageHistory.value += textMsgJSON.textMsg + "\n"
      //console.log(this.messageHistory.value)

      this.forceUpdate()
    };
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleClick() {
    console.log(this.state.value)
    client.send(JSON.stringify({
      "type": "searchSong",
      "content": JSON.stringify({
        "songSearch": this.state.value
      })
    }))
  }

  addSong(songID) {
    client.send(JSON.stringify({
      "type": "addSong",
      "content": JSON.stringify({
        "songID": songID
      })
    }))
  }

  // callback function passing state values up to Game to actually start the game
  startGame = () => {
    //this.state.startGame(this.state.twitterHandleOne,this.state.twitterHandleTwo)
  }

  render(){
    const items = this.state.songs.map((item) =>
    <tr key={item.ID} >
      <td><button onClick={() => this.addSong(item.ID)}>Add Song</button></td>
      <td>{item.Name}</td>
      <td>{item.Artist}</td>
      <td>{item.Album}</td>
    </tr>
    );
    return (
      <div>
        <h1>JUKEBOT</h1>
        <h2>Now Playing: </h2>
        <h2>Join Code: {this.state.sessionID}</h2>
        <h2>You are in  's lobby</h2>
        <p>Enter Song:</p>
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        <button type="button" onClick={this.handleClick}>Search</button>
        <table>
          <tbody>
            {items}
          </tbody>
          
        </table>
        
      </div>
    );
  }
  
}

export default Session;
