import React, { Component } from 'react';
import SquareBtn from '../SquareBtn/SquareBtn';
import SearchBar from '../SearchBar/SearchBar';
import { w3cwebsocket as W3CWebSocket } from "websocket";

var client 

class Session extends Component {
  constructor(props){
    super(props)
    console.log(props.match.params)
    this.state = {
      sessionID: props.match.params.sessionID,
      value: "",
      songs: [],
      currentSong: "",
      hostName: ""
    }

    this.addSong = this.addSong.bind(this);
    this.searchSong = this.searchSong.bind(this);
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
      }else if(messageJSON.type === 3){
        this.setState({
          currentSong: messageJSON.body
        })
      }else if(messageJSON.type === 4){
        this.setState({
          hostName: messageJSON.body
        })
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

  searchSong(songName) {
    console.log(songName)
    client.send(JSON.stringify({
      "type": "searchSong",
      "content": JSON.stringify({
        "songSearch": songName
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
    this.setState({
      "songs": []
    })
  }

  // callback function passing state values up to Game to actually start the game
  startGame = () => {
    //this.state.startGame(this.state.twitterHandleOne,this.state.twitterHandleTwo)
  }

  render(){
    let tableHeader
    if(this.state.songs.length !== 0){
      tableHeader = 
        <tr>
          <th>Add Song</th>
          <th>Song Name</th>
          <th>Artist</th>
          <th>Album</th>
        </tr>
      
    }
    const items = this.state.songs.map((item) =>
    <tr key={item.ID} >
      <td><button className="w3-button w3-xlarge w3-circle w3-black" onClick={() => this.addSong(item.ID)}>+</button></td>
      <td>{item.Name}</td>
      <td>{item.Artist}</td>
      <td>{item.Album}</td>
    </tr>
    );
/*
<div className="searchBox">
          <input type="text" value={this.state.value} onChange={this.handleChange} />
          <button type="button" onClick={this.handleClick}>Search</button>  
        </div>
*/
    return (
      <div>
        <h1>JUKEBOT</h1>
        <h2>Now Playing: {this.state.currentSong}</h2>
        <h2>Join Code: {this.state.sessionID}</h2>
        <h2>You are in {this.state.hostName}'s lobby</h2>
        <SearchBar
          callback = {this.searchSong}
        />
        
        <table>
          <tbody>
            {tableHeader}
            {items}
          </tbody>
          
        </table>
        
      </div>
    );
  }
  
}

export default Session;
