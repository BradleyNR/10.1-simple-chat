import React, { Component } from 'react';

const HEADERS = {
  'X-Parse-Application-Id': 'carson',
  'X-Parse-REST-API-Key': 'naturarogue',
  'X-Parse-Revocable-Session': 1
}

const PARSE_URL = 'https://naturals-test-parse-server.herokuapp.com'

class Form extends Component {
  constructor(props){
    super(props);

    this.state = {
      username: '',
      password: '',
      singupUsername: '',
      signupPassword: '',
      errorMessage: '',
      newMessage: '',
      user: null
    };

  }

  // --- Below sets the session per localStorage so a user can stay
  // --- logged in as long as they like across requests
  componentWillMount(){
    var loggedInUser = localStorage.getItem('user');

    if(loggedInUser){
      this.setState({user: JSON.parse(loggedInUser)})
    }
  }

  handleSignupUsername = (e) => {
    e.preventDefault();
    this.setState({signupUsername: e.target.value});
    console.log(this.state.signupUsername);
  }

  handleSignupPassword = (e) => {
    e.preventDefault();
    this.setState({signupPassword: e.target.value})
    console.log(this.state.signupPassword);
  }

  handleUsername = (e) => {
    e.preventDefault();
    this.setState({username: e.target.value});
  }

  handlePassword = (e) => {
    e.preventDefault();
    this.setState({password: e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault();

    var username = this.state.username;
    var password = this.state.password;
    let qs = 'username=' + encodeURIComponent(username) + '&password=' + password;

    fetch(PARSE_URL + '/login?' + qs, {
      headers: HEADERS
    }).then((resp) => {
      console.log(resp);
      return resp.json();
    }).then((user) => {
      console.log('user: ', user);

      localStorage.setItem('user', JSON.stringify(user));

      // --- if trying to log in with wrong user/pass
      // --- don't set session or set state
      if (user.username) {
        // --- setting session token to header for new headers
        HEADERS['X-Parse-Session-Token'] = user.sessionToken;
        this.setState({user: user});
      } else {
        this.setState({errorMessage: user.error})
      }
    });
  }

  handleMessage = (e) => {
    e.preventDefault();

    let messageText = this.state.newMessage;
    let objId = this.state.user.objectId;
    console.log('obj id', objId);

    fetch(PARSE_URL + '/classes/message', {
      headers: HEADERS,
      body: JSON.stringify({messagetext: messageText, user: objId}),
      method: 'POST'
    }).then((resp) => {
      return resp.json();
    }).then((message) => {
      console.log(message);
    });
  }

  handleMessageText = (e) => {
    e.preventDefault();

    this.setState({newMessage: e.target.value})
    console.log(this.state.newMessage);
  }


  handleSignupSubmit = (e) => {
    e.preventDefault();

    let username = this.state.signupUsername;
    let password = this.state.signupPassword;

    fetch(PARSE_URL + '/users', {
      headers: HEADERS,
      body: JSON.stringify({'username': username, 'password': password}),
      method: 'POST'
    }).then((resp) => {
      return resp.json();
    }).then((user) => {
      localStorage.setItem('user', JSON.stringify(user));
      HEADERS['X-Parse-Session-Token'] = user.sessionToken;
      this.setState({user: user})
    });
  }

  render(){
    return(
      <div className='row'>


          {this.state.user ? <h1 className='col-md-11 col-md-offset-1'>Welcome, {this.state.user.username}!</h1> : <h1 className='col-md-11 col-md-offset-1'>{this.state.errorMessage}</h1>}


          <div className='col-md-5 col-md-offset-1'>
            <h1>Please Login:</h1>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input onChange={this.handleUsername} type="text" className="form-control" id="username" placeholder="Username" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input onChange={this.handlePassword} type="password" className="form-control" id="password" placeholder="Password" />
              </div>
              <button type="submit" className="btn btn-success">Submit</button>
            </form>
          </div>

          <div className='col-md-5'>
            <h1>No Account? Please sign up:</h1>
            <form onSubmit={this.handleSignupSubmit}>
              <div className="form-group">
                <label htmlFor="signupUsername">Username:</label>
                <input onChange={this.handleSignupUsername} type="text" className="form-control" id="signupUsername" placeholder="Username" />
              </div>
              <div className="form-group">
                <label htmlFor="signupPassword">Password:</label>
                <input onChange={this.handleSignupPassword} type="password" className="form-control" id="signupPassword" placeholder="Password" />
              </div>
              <button type="submit" className="btn btn-success">Submit</button>
            </form>

          </div>

          {this.state.user ?
            <div className='col-md-10 col-md-offset-1'>

              <form onSubmit={this.handleMessage}>
                <div className='form-group'>
                  <label htmlFor='message-box'>Enter Message:</label>
                  <input onChange={this.handleMessageText} id='message-box' className='form-control' placeholder='Type your message...'></input>
                </div>
              </form>
            </div> : null
          }

        </div>
    )
  }
}

export default Form;
