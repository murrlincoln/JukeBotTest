import React, { Component } from 'react';
import LoadAnimation from './../LoadAnimation/LoadAnimation'

class Loading extends Component {

  constructor(props){
    super(props)
    this.state = {
      twitterHandleOne: this.props.twitterHandleOne,
      tweetsOne: {},
      twitterNameOne: "",
      twitterHandleTwo: this.props.twitterHandleTwo,
      tweetsTwo: {},
      twitterNameTwo: "",
      setTwitterData: this.props.setTwitterData
    }
  }

  async componentDidMount() {
    await fetch('http://localhost:3001/get-tweets/'+this.state.twitterHandleOne)
    .then(res => res.json())
    .then((data) => {
      this.setState({ tweetsOne: data, twitterNameOne: data[0].User.Name })
    })
    .catch(console.log)

    await fetch('http://localhost:3001/get-tweets/'+this.state.twitterHandleTwo)
    .then(res => res.json())
    .then((data) => {
      this.setState({ tweetsTwo: data, twitterNameTwo: data[0].User.Name })
    })
    .catch(console.log)

    if(this.state.tweetsOne.length === 0 || this.state.tweetsTwo.length === 0){
      
    }

    this.state.setTwitterData(
      this.state.twitterNameOne,
      this.state.tweetsOne,
      this.state.twitterNameTwo,
      this.state.tweetsTwo
    )
  }

  

  render(){
    return (
      <div>
        <LoadAnimation/>
      </div>
    );
  }
  
}

export default Loading;
