import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {

  constructor(props){
    super(props)

    this.state = {
      startCallback: this.props.parentCallback,
      name: this.props.name
    }
  }


  render(){
    return (
      <div className="container">
        <div className="center">
          <button className="btn" onClick={this.state.startCallback}>
            <svg width="180px" height="60px" viewBox="0 0 180 60" className="border">
              <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
              <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
            </svg>
            <span>{this.props.name}</span>
          </button>
        </div>
      </div>
      
    );
  }
  
}

export default SearchBar;


