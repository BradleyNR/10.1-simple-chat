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
      signupPassword: ''
    };
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

    fetch(PARSE_URL + '/?' + qs, {
      headers: HEADERS
    }).then((resp) => {
      return resp.json()
    }).then((user) => {
      localStorage.setItem('user', JSON.stringify(user));
      //setting session token to header for new headers
      HEADERS['X-Parse-Session-Token'] = user.sessionToken;
      console.log(user);

      this.setState({user: user});
    });
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

        {this.state.user ? <h1>{this.state.user}</h1> : null}

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
        </div>
    )
  }
}

export default Form;
