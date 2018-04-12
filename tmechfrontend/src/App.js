import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage.js"
import NewSong from "./Pages/NewSong/NewSong.js"
import 'semantic-ui-css/semantic.min.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" exact component={HomePage}/>
          <Route path="/newsong" component={NewSong}/>
        </div>
      </Router>
    );
  }
}

export default App;
