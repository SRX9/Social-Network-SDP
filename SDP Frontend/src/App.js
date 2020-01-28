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

  logOut=()=>{
    this.setState({  loggedIn: false });

  }

  render()
  {
    return (
      <Router>
          <Switch>
            <Route path="/signin" exact component={() => <Login  setHomeUser={this.setHomeUser}  />}></Route>
            <Route
              path="/createaccount"
              exact
            component={() => <Register setHomeUser={this.setHomeUser} />}
            ></Route>
          <Route path="/profile/:username" exact render={(props) => <Profile logOut={this.logOut} setHomeUser={this.setHomeUser} loadOn={this.loadOn} loadOff={this.loadOff} {...props} />}></Route>
            <Route path="/profile/:username/create" exact render={(props) => <CreatePost loadOn={this.loadOn} homeuser={this.state.homeuser} loadOff={this.loadOff} {...props} />}></Route>

          </Switch>
        <div className="  fixed-bottom">
          {this.state.loading ? <div className="bar">
          </div> : <div className="nobar">
            </div>}
          <div className="text-center p-3 border  bg-light">
            <Row type="flex" justify="center  " align="middle"> 
             <Col span={1}>
                <h5  >Search</h5>
              </Col>
              {this.state.loggedIn?
              <Col span={2}>
                <div style={{paddingLeft:"0px",paddingRight:"0px"}}>
                  <Link to={`/profile/${localStorage.getItem("!@#$")}/create`}>
                    <h5 className="  myblue  cur fixed-bottom "
                      style={{ fontSize: "65px", marginBottom: "10px" }}>
                      <Icon type="plus-circle" className="buttonHov"
                        style={{ border: "10px solid white", borderRadius: "50px" }} theme="filled" />
                    </h5>
                  </Link>
                </div>
              </Col>:null}
              <Col span={1}>
                <h5 > Browse</h5>
              </Col>
              </Row>
          </div>
        </div>
      </Router>
    );
  }

}

export default App;
