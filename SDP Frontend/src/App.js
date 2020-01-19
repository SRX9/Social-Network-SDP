import React from 'react';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Profile from './Components/UserProfile/Profile';
import "antd/dist/antd.css";
import './App.css';

class App extends React.Component {
  state={
    loading:false
  }

  loadOn=()=>{
    this.setState({loading:true});
  }

  loadOff=()=>{
    this.setState({loading:false});
  }

  render()
  {
    return (
      <Router>
          <Switch>
            <Route path="/signin" exact component={() => <Login loadOn={this.loadOn} loadOff={this.loadOff} />}></Route>
            <Route
              path="/createaccount"
              exact
              component={() => <Register loadOn={this.loadOn} loadOff={this.loadOff}/>}
            ></Route>
            <Route path="/profile/:username" render={(props) => <Profile loadOn={this.loadOn} loadOff={this.loadOff} {...props} />}></Route>
          </Switch>
        <div className="  fixed-bottom">
          {this.state.loading ? <div className="bar">
          </div> : <div className="nobar">
            </div>}
          <div className="text-center p-3 border  bg-light">
            <h5 className="d-inline p-1">Search</h5>
            <span className="p-1" style={{ fontSize: "2vh" }}>&bull;</span>
            <h5 className="d-inline p-1">Home</h5>
            <span className="p-1" style={{ fontSize: "2vh" }}>&bull;</span>
            <h5 className="d-inline p-1">Browse</h5>

          </div>
        </div>
      </Router>
    );
  }

}

export default App;
