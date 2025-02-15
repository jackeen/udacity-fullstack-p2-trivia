import React, { Component } from 'react';

class Search extends Component {
  state = {
    query: '',
  };

  getInfo = (event) => {
    event.preventDefault();
    this.props.submitSearch(this.state.query);
  };

  handleInputChange = () => {
    this.setState({
      query: this.search.value,
    });
  };

  render() {
    return (
      <form className='search' onSubmit={this.getInfo}>
        <input
          type='text'
          placeholder='Search questions...'
          ref={(input) => (this.search = input)}
          onChange={this.handleInputChange}
        />
        <button type='submit'>Submit</button>
      </form>
    );
  }
}

export default Search;
