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
      value:"",
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
          style={{ textAlign:"left",fontSize:"1rem",fontWeight:"500", 
          width: "100%" }}
          rows={this.props.rows}
          placeholder={this.props.place===undefined?"@user &group #tag":this.props.place}
          prefix={["@", "#", "&"]}
          maxLength={1000}
          value={this.props.done}
          onSearch={this.onSearch}
          onChange={val => {
            if(this.props.limit===250)
            {
              if(val.length<251)
              { 
                this.setState({ value: val });
                this.props.getCaption(val);
              }
            }
            else{
              if(val.length<1000)
              {
                this.setState({ value: val });
                this.props.getCaption(val);
              }
            }
          }}
        >
          {(this.state.buffer || []).map(value =>
                <Option key={value.name} style={{fontWeight:600}} value={value.name}>
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
              {value.by!=undefined?<span>{"#"+value.name + " : "+ value.number}</span>:value.name}
                </Option>
          )}
        </Mentions>
      </div>
    );
  }
}


export default SRtext;
