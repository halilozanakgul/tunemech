import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage.js"
import 'semantic-ui-css/semantic.min.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={HomePage}/>
      </Router>
    );
  }
}

export default App;
