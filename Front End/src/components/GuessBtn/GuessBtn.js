import React, { Component } from 'react';
import './GuessBtn.scss';

class GuessBtn extends Component {

  handleClick = (e) => {
    this.props.callback(this.props.className === "button success")

    e.preventDefault();
      //reset animation
      e.target.classList.remove('animate');
      
      e.target.classList.add('animate');
      
      e.target.classList.add('animate');
  }

  render(){
    return (
      <div className="guessBtn">
        <button className={this.props.className} onClick={this.handleClick} disabled = {this.props.disabled}>{this.props.name}</button>
      </div>
    );
  }
  
}

export default GuessBtn;
