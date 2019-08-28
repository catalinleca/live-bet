import './App.css';
import * as React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import AppBody from "./containers/AppBody/AppBody";
import {
  compose,
} from 'redux';


class App extends React.Component {

  render() {
    return (
      <Router>
        <AppBody/>
      </Router>
    );
  }
}


export default compose<React.ComponentClass<any>>(
)(App);
