import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import {Icon,Row,Col} from 'antd';
import Profile from './Components/UserProfile/Profile';
import "antd/dist/antd.css";
import './App.css';
import 'tachyons';
import CreatePost from './Components/UserProfile/CreatePost';
class App extends React.Component {
  state={
    loading:false,
    userobj:null,
    loggedIn:localStorage.getItem("!@#$")!==undefined,
  }

  loadOn=()=>{
    this.setState({loading:true});
  }

  loadOff=()=>{
    this.setState({loading:false});
  }

  setHomeUser=()=>{
    this.setState({loggedIn:true});
  }

  getUserObj=(obj)=>{
    this.setState({userobj:obj});
  }


  logOut=()=>{
    this.setState({  loggedIn: false });

  }

  render()
  {
    return (
      <Router>
        <Switch>
          <Route
            path="/signin"
            exact
            component={() => <Login setHomeUser={this.setHomeUser} />}
          ></Route>
          <Route
            path="/createaccount"
            exact
            component={() => <Register setHomeUser={this.setHomeUser} />}
          ></Route>
          <Route
            path="/profile/:username"
            exact
            render={props => (
              <Profile
                logOut={this.logOut}
                getUserObj={this.getUserObj}
                loadOn={this.loadOn}
                loadOff={this.loadOff}
                {...props}
              />
            )}
          ></Route>
          <Route
            path="/profile/:username/create"
            exact
            render={props => (
              <CreatePost
                loadOn={this.loadOn}
                homeuser={this.state.homeuser}
                userobj={this.state.userobj}
                loadOff={this.loadOff}
                {...props}
              />
            )}
          ></Route>
        </Switch>
        <div className="  fixed-bottom">
          {this.state.loading ? (
            <div className="bar"></div>
          ) : (
            <div className="nobar"></div>
          )}
          <div className="text-center  border  bg-light">
            <Row type="flex" className="mb-2" justify="center" align="middle">
              <Col span={1}>
                <Icon
                  type="appstore"
                  style={{
                    fontSize: "2rem",
                    border: "10px solid white",
                    borderRadius: "50px"
                  }}
                />{" "}
              </Col>
              {this.state.loggedIn ? (
                <Col span={1}>
                  <Link to={`/profile/${localStorage.getItem("!@#$")}/create`}>
                    <Icon
                      type="plus-circle"
                      className="buttonHov m-1"
                      style={{
                        fontSize: "2rem",
                        border: "10px solid white",
                        borderRadius: "50px"
                      }}
                      theme="filled"
                    />
                  </Link>
                </Col>
              ) : null}
              <Col span={1}>
                <Icon
                  type="user"
                  style={{
                    fontSize: "2rem",
                    border: "10px solid white",
                    borderRadius: "50px"
                  }}
                />{" "}
              </Col>
            </Row>
          </div>
        </div>
      </Router>
    );
  }

}

export default App;
