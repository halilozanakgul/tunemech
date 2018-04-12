import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage.js"
import 'semantic-ui-css/semantic.min.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={HomePage}/>
        <Route path="/newsong" exact component={NewSong}/>
      </Router>
    );
  }
}

export default App;
