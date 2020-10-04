import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {

  constructor(props){
    super(props)

    this.state = {
      callback: this.props.callback,
      value: "",
    }

    this.handleChange = this.handleChange.bind(this);
    this.searchSong = this.searchSong.bind(this);
  }

  searchSong() {
    console.log(this.state.value)
    this.state.callback(this.state.value)
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(this.state.value)
  }

  render(){
    return (
      <div className="cover">
        <form method="get" action="">
          <div className="tb">
            <div className="td"><input type="text" value={this.state.value} onChange={this.handleChange} placeholder="Enter Song" required/></div>
            <div className="td s-cover">
              <button type="button" onClick={this.searchSong}>
                <div className="s-circle"></div>
                <span></span>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
  
}

export default SearchBar;


