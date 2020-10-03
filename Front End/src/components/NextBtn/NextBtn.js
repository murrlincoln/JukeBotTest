import React, { Component } from 'react';
import './NextBtn.scss'

class NextBtn extends Component {
  constructor(props){
    super(props)
    this.state = {
      callback: this.props.callback
    }
  }

  render(){
    return (
      <div>
        <span className="arrow" onClick={this.state.callback}></span>
      </div>
    );
  }
}

export default NextBtn;
