import React, { Component } from 'react';
import './TwitterHandleInput.scss';

class TwitterHandleInput extends Component {

  constructor(props){
    super(props)
    this.state = {
      twitterHandle: "",
      parentCallback: this.props.parentCallback
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({twitterHandle: event.target.value})
    this.state.parentCallback(event.target.value);
  }

  render(){
    return (
      <div>
        <p>
          <span className="twitterHandleInput">
            <input className="twitterHandleInput" 
            type="text" 
            placeholder={this.props.InputName} 
            value={this.state.twitterHandle} 
            onChange={
              this.handleChange.bind(this)
            }/>
            <span></span>	
          </span>
        </p>
        
      </div>
    );
  }
  
}

export default TwitterHandleInput;
