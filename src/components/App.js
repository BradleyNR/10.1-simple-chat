import React, { Component } from 'react';
import '../styles/App.css';

import Form from './Login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Form />
      </div>
    );
  }
}

export default App;
