import React, { Component } from 'react';
import './LoadAnimation.scss';

class LoadAnimation extends Component {

  render(){
    return (
      <div className="book">
        <div className="book__page"></div>
        <div className="book__page"></div>
        <div className="book__page"></div>
        <p>Loading...</p>
      </div>

    );
  }
  
}

export default LoadAnimation;
