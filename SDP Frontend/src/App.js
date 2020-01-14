import React from 'react';
import {BrowserRouter as Router,Switch,Route,withRouter} from 'react-router-dom';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Profile from './Components/UserProfile/Profile';
import "antd/dist/antd.css";
import './App.css';

function App() {
  return (
    <Router>
      <div className="">
        <Switch>
          <Route path="/signin" exact component={() => <Login />}></Route>
          <Route
            path="/createaccount"
            exact
            component={() => <Register />}
          ></Route>
          <Route path="/profile/:username" render={(props) => <Profile {...props} />}></Route>
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
