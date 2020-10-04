import React, { Component } from 'react';
import SquareBtn from '../SquareBtn/SquareBtn';
import SearchBar from '../SearchBar/SearchBar';
import './Session.css';

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
      hostName: "",
      animateClassName: "note"
    }

    this.addSong = this.addSong.bind(this);
    this.searchSong = this.searchSong.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {

    client = new W3CWebSocket('ws://localhost:8080/connectlobby/'+this.state.sessionID)
    
    let myWindow
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const messageJSON = JSON.parse(message.data)

      if(messageJSON.type === 0){
        myWindow = window.open(messageJSON.body, "MsgWindow", "width=400,height=600")
      }else if(messageJSON.type === 1){
        myWindow.close()
      }else if(messageJSON.type === 2){
        this.setState({
          songs: JSON.parse(messageJSON.body)
        })
      }else if(messageJSON.type === 3){
        this.setState({
          currentSong: messageJSON.body
        })
      }else if(messageJSON.type === 4){
        this.setState({
          hostName: messageJSON.body
        })
      }

      this.forceUpdate()
    };
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleClick() {
    client.send(JSON.stringify({
      "type": "searchSong",
      "content": JSON.stringify({
        "songSearch": this.state.value
      })
    }))
  }

  searchSong(songName) {
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
      "songs": [],
      animateClassName: "note animate"
    })
    
    setTimeout(()=> {
      this.setState({
        animateClassName: "note"
      })
    }, 4000);
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
      <td><button className="addBtn" onClick={() => this.addSong(item.ID)}>+</button></td>
      <td>{item.Name}</td>
      <td>{item.Artist}</td>
      <td>{item.Album}</td>
    </tr>
    );

    return (
      <div>
        <div className={this.state.animateClassName}>
            Song Added to Queue
          </div>
        
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
