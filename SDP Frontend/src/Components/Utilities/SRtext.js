import React from 'react';
import './utilities.css';
import { Mentions, Avatar } from "antd";
import axios from 'axios';

const { Option } = Mentions;
const serverUrl = "http://localhost:3001/";

class SRtext extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buffer: [],
      input: "",
      loading: false,
      caption:""
    };
  }

  gettags = (_) => {
      this.setState({loading:true});
    axios
      .get(`${serverUrl}search/tag?tag=${_}`)
      .then(response => {
        this.setState({ loading: false });
        this.setState({ buffer: response.data });
      })
      .catch(function(error) {});
  };
  getuser = (_) => {
    this.setState({ loading: true });
    axios
      .get(`${serverUrl}search/user?user=${_}`)
      .then(response => {
        this.setState({ loading: false });
        this.setState({ buffer: response.data });
      })
      .catch(function(error) {});
  };
  getgroup = (_) => {
    this.setState({ loading: true });
    axios
      .get(`${serverUrl}search/group?group=${_}`)
      .then(response => {
        this.setState({ loading: false });
        this.setState({ buffer: response.data });
      })
      .catch(function(error) {});
  };

  onSearch = (_, prefix) => {
      this.setState({prefix:prefix},()=>{
    if(prefix==="#")
    {
        this.gettags(_);
    }
    else if(prefix==="&")
    {
        this.getgroup(_);
    }
    else if(prefix=="@")
    {
        this.getuser(_);
    }
      })
  };



  render() {
    return (
      <div>
        <Mentions
          loading={this.state.loading}
          style={{   textAlign:"left",fontSize:"1rem",fontWeight:"500", 
          width: "100%" }}
          rows={this.props.rows}
          placeholder="@user &group #tag"
          prefix={["@", "#", "&"]}
          maxLength={1000}
          onSearch={this.onSearch}
          onChange={val => {
            this.props.getCaption(val);
          }}
        >
          {(this.state.buffer || []).map(value => {
            if (this.state.prefix !== "#") {
              return (
                <Option key={value.name} value={value.name}>
                  <Avatar
                    src={value.avatar}
                    size="large"
                    style={{
                      width: 40,
                      height: 40,
                      marginRight: 4,
                      top: -1,
                      position: "relative"
                    }}
                  />
                  {" " + value.name}
                </Option>
              );
            } else {
              return (
                <Option key={value} value={value}>
                  {value}
                </Option>
              );
            }
          })}
        </Mentions>
      </div>
    );
  }
}


export default SRtext;
