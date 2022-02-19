import React, { Component } from 'react';
import '../stylesheets/Header.css';

class Header extends Component {
  navTo(path) {
    window.location.href = window.location.origin + path;
  }

  navigator = {
    '/': 'List',
    '/add': 'Add',
    '/play': 'Play',
  }

  currentPath = window.location.pathname

  render() {
    return (
      <div className='App-header'>
        <h1
          onClick={() => {
            this.navTo('');
          }}
        >
          Udacitrivia
        </h1>

        {Object.keys(this.navigator).map((path) => (
          <h2
            key={path}
            className = {`${this.currentPath === path ? 'selected':''}`}
            onClick = {() => {
              this.navTo(path)
            }}
          >
            {this.navigator[path]}
          </h2>
        ))}

      </div>
    );
  }
}

export default Header;
