import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import {Icon,Row,Col} from 'antd';
import Profile from './Components/UserProfile/Profile';
import "antd/dist/antd.css";
import './App.css';
import 'tachyons';
import CreatePost from './Components/UserProfile/CreatePost';
import VideoPlayer from './Components/Videoplayer/VideoPlayer';
import Home from './Components/Home';
import Main from './Components/Main';
import SearchStuff from './Components/Content/SearchStuff';

class App extends React.Component {
  state={
    loading:false,
    userobj:null,
    loggedIn:localStorage.getItem("!@#$")!==null,
    home:"text-dark",
    search:"text-dark",
    palace:"text-dark",
    signin:"",
    user:"text-dark"
  }

  changeColor=(id)=>{
    if(id===1)
    {
      this.setState({ home: "", search: "text-dark", palace: "text-dark", signin: "text-dark", user: "text-dark"})
    }
    else if(id===2)
    {
      this.setState({ home: "text-dark", search: "", palace: "text-dark", signin: "text-dark", user: "text-dark" })
    }
    else if(id===3)
    {
      this.setState({ home: "text-dark", search: "text-dark", palace: "", signin: "text-dark", user: "text-dark" })
    }
    else if (id === 4) {
      this.setState({ home: "text-dark", search: "text-dark", palace: "text-dark", signin: "text-dark", user: "" })
    }
    else if (id === 5) {
      this.setState({ home: "text-dark", search: "text-dark", palace: "text-dark", signin: "", user: "text-dark" })
    }
    
  }

  loadOn=()=>{
    this.setState({loading:true});
  }

  loadOff=()=>{
    this.setState({loading:false});
  }

  setHomeUser=(obj)=>{
    this.setState({
      loggedIn: true, userobj: obj, home: "text-dark",
      search: "text-dark",
      palace: "text-dark",
      signin: "text-dark",
      user: ""});
  }

  getUserObj=(obj)=>{
    this.setState({userobj:obj});
  }

  logOut=()=>{
    this.setState({
      loggedIn: false, home: "text-dark",
      search: "text-dark",
      palace: "text-dark",
      signin: "",
      user: "text-dark" });

  }


  render()
  {
    return (
      <Router >
        <Switch>
          <Route
            path="/home"
            exact
            render={() => <Home userobj={this.state.userobj} loadOn={this.loadOn}
              loadOff={this.loadOff} />}
          >
          </Route>
          <Route
            path="/signin"
            exact
            component={() => <Login setHomeUser={this.setHomeUser} />}
          >
          </Route>
          <Route
            path="/"
            exact
            component={() => <Main />}
          >
          </Route>
          <Route
            path="/createaccount"
            exact
            component={() => <Register setHomeUser={this.setHomeUser} />}
          ></Route>
          <Route
            path="/search"
            exact
            component={() => <SearchStuff/>}
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
                getNewPost={this.getNewPost}
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


          <div className="text-center pt-1  border  bg-white" >
            <Row type="flex" gutter={15} className="mb-1" justify="center" align="middle">
              {this.state.loggedIn ?<Col >
              <Link to="/home">
                  <Icon
                  onClick={()=>this.changeColor(1)}
                    className={"pointer font-weight-bolder "+this.state.home }
                    type="home"
                    style={{
                      fontSize: "200%",
                      border: "10px solid white",
                      borderRadius: "50px"
                    }}
                  />{" "}
              </Link>
              </Col>:null}
              <Col >
              
              <Link to="/search">
                  <Icon
                    onClick={()=>this.changeColor(2)}
                    className={"pointer "+this.state.search}
                    type="search"
                    style={{
                      fontSize: "200%",
                      border: "10px solid white",
                      borderRadius: "50px"
                    }}
                  />{" "}
              </Link>
              </Col>
              
              {this.state.loggedIn ? (
                <Col >
                  <Link to={`/profile/${localStorage.getItem("!@#$")}/create`}>
                    <Icon
                      type="plus-circle"
                      className="buttonHov m-1 pointer"
                      style={{
                        fontSize: "200%",
                        border: "10px solid white",
                        borderRadius: "50px"
                      }}
                      theme="filled"
                    />
                  </Link>
                </Col>
              ) : null}
              {/*<Col >
              <Link to="/postspalace">
                  <Icon
                    onClick={() => this.changeColor(3)}
                    className={"pointer "+this.state.palace}
                    type="appstore"
                    style={{
                      fontSize: "200%",
                      border: "10px solid white",
                      borderRadius: "50px"
                    }}
                  />{" "}
              </Link>
              </Col>*/}

              {this.state.loggedIn?
                <Col >
              <Link to={`/profile/${localStorage.getItem('!@#$')}`}>
                    <Icon
                      onClick={() => this.changeColor(4)}
                      type="user"
                      className={"pointer "+this.state.user}
                      style={{
                        fontSize: "200%",
                        border: "10px solid white",
                        borderRadius: "50px"
                      }}
                    />
              </Link>
              </Col> : 
              <Link to="/signin">
                  <Icon
                    onClick={() => this.changeColor(5)}
                    type="login"
                    className={"pointer "+this.state.signin}
                    style={{
                      fontSize: "200%",
                      border: "10px solid white",
                      borderRadius: "50px"
                    }}
                  /></Link>}
            </Row>
          </div>
        </div>
      </Router>
    );
  }

}

export default App;
