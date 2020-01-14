import React from 'react';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Loginnext from './Components/Auth/Loginnext';
import Registernext from './Components/Auth/Registernext'
import "antd/dist/antd.css";
import './App.css';

function App() {
  return (
    <Router>
      <div className="">
        <Switch>
          <Route path="/SignIn" exact component={() => <Login />}></Route>
          <Route
            path="/SignInplus"
            exact
            component={() => <Loginnext />}
          ></Route>
          <Route
            path="/CreateAccount"
            exact
            component={() => <Register />}
          ></Route>
          <Route
            path="/CreateAccountplus"
            exact
            component={() => <Registernext />}
          ></Route>
        </Switch>
      </div>
      <div className="text-center bg-light p-4 border fixed-bottom">
          <h5 className="d-inline p-1">Search</h5>
          <span className="p-1" style={{fontSize:"2vh"}}>&bull;</span>
          <h5 className="d-inline p-1">Home</h5>
          <span className="p-1" style={{fontSize:"2vh"}}>&bull;</span>
          <h5 className="d-inline p-1">Browse</h5>
          
      </div>
    </Router>
  );
}

export default App;
