import React from 'react';
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import "@webscopeio/react-textarea-autocomplete/style.css";
import Fuse from 'fuse.js';
import { Avatar } from 'antd';      
import TextareaAutosize from 'react-autosize-textarea';
class SRtext extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            plines: '',
            height: this.props.type==="reply"?'20px':'320px',
            caption: "",
            tags:[
                {
                uname:"Raj",
                fname:"Savaliya Raj",
                link:"https://specials-images.forbesimg.com/imageserve/5be1e2a3a7ea437059163919/960x0.jpg?cropX1=0&cropX2=1999&cropY1=0&cropY2=1999"
                },
                {
                    uname: "Rajno",
                    fname: "Savaliya Raj",
                    link: "https://specials-images.forbesimg.com/imageserve/5be1e2a3a7ea437059163919/960x0.jpg?cropX1=0&cropX2=1999&cropY1=0&cropY2=1999"
                },
                {
                    uname: "Martha",
                    fname: "Sovinuer sdf",
                    link: "https://specials-images.forbesimg.com/imageserve/5be1e2a3a7ea437059163919/960x0.jpg?cropX1=0&cropX2=1999&cropY1=0&cropY2=1999"
                },
                {
                    uname: "Rajesh",
                    fname: "Kuthropolli Rajesh",
                    link: "https://specials-images.forbesimg.com/imageserve/5be1e2a3a7ea437059163919/960x0.jpg?cropX1=0&cropX2=1999&cropY1=0&cropY2=1999"
                },
                {
                    uname: "Zackor",
                    fname: "Fantoe jack",
                    link: "https://specials-images.forbesimg.com/imageserve/5be1e2a3a7ea437059163919/960x0.jpg?cropX1=0&cropX2=1999&cropY1=0&cropY2=1999"
                },
            ]
            ,
            hashtags:[
                {
                    hashtag:"MeToo"
                },
                {
                    hashtag: "Happiness"
                },
                {
                    hashtag:"bts"
                }
            ],
            groups:[
                {
                    group:"RajviKhandan",
                    link:"https://specials-images.forbesimg.com/imageserve/5be1e2a3a7ea437059163919/960x0.jpg?cropX1=0&cropX2=1999&cropY1=0&cropY2=1999"
                },
                {
                    group: "TheSouls",
                    link: "https://specials-images.forbesimg.com/imageserve/5be1e2a3a7ea437059163919/960x0.jpg?cropX1=0&cropX2=1999&cropY1=0&cropY2=1999"
                },
                {
                    group: "Sharkanado",
                    link: "https://specials-images.forbesimg.com/imageserve/5be1e2a3a7ea437059163919/960x0.jpg?cropX1=0&cropX2=1999&cropY1=0&cropY2=1999"
                },
                {
                    group: "Amchi_Mumbai",
                    link: "https://specials-images.forbesimg.com/imageserve/5be1e2a3a7ea437059163919/960x0.jpg?cropX1=0&cropX2=1999&cropY1=0&cropY2=1999"
                },
            ]
        }
    }



    //taken Similars from server 
    renderTags=(token)=>{
        var options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "uname",
                "fname",
                "link"
            ]
        };
        var fuse = new Fuse(this.state.tags, options); // "list" is the item array
        var result = fuse.search(token);
        return result;
    }
    renderHash = (token) => {
        var options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "hashtag"
            ]
        };
        var fuse = new Fuse(this.state.hashtags, options); // "list" is the item array
        var result = fuse.search(token);
        return result;
    }
    renderGroup = (token) => {
        var options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "group",
                "link"
            ]
        };
        var fuse = new Fuse(this.state.groups, options); // "list" is the item array
        var result = fuse.search(token);
        return result;
    }

    //Tags renderer
    ItemTags = ({ entity: { fname, uname,link } }) => <div className="pa2 fw6" style={{fontSize:"28px"}} >
        <Avatar src={link} size={64} className="pa2"/>
        {"@"+uname}
        </div>;
    ItemHash = ({ entity: {hashtag} }) => <div className="pa2 fw6" style={{ fontSize: "28px" }} >
        {"#"+hashtag}
    </div>;
    ItemGroups = ({ entity: { group, link } }) => <div className="pa2 fw6" style={{ fontSize: "28px" }} >
        <Avatar src={link} size={64} className="pa2" />
        {"&" + group}
    </div>;
    Loading = ({ data }) => <div>Loading</div>;

    setCaption=(e)=>{
        document.body.addEventListener('keyup', function (e) {
            if (e.keyCode == 13) {
                return
            }   
        });
        if (String(e.target.value).length < 301) {
            var nlines = (String(e.target.value).split("\n").length - 1);
            if (nlines > this.state.plines && parseInt(this.state.height) < 530) {
                this.setState({ plines: this.state.plines + 1 }, () => {
                    this.setState({ height: String(parseInt(this.state.height) + 33) + "px" })
                })
            }
            else if (nlines < this.state.plines && parseInt(this.state.height) > 400) {
                this.setState({ plines: nlines }, () => {
                    this.setState({ height: String(parseInt(this.state.height) - 33) + "px" })
                });
            }
            this.setState({ caption: e.target.value }, () => {
                //this.props.caption(e.target.value);
            });
            var plines = (String(e.target.value).split("\n").length - 1);
            this.setState({ plines: plines });
        }
        else {
            return;
        }

    }

    render()
    {
        return(
            <div className="">
        
                <ReactTextareaAutocomplete
                    placeholder="here..."
                    textAreaComponent={TextareaAutosize}
                    value={this.state.caption}
                    onChange={this.setCaption}
                    spellcheck="false"
                    className=" w-100"
                    loadingComponent={this.Loading}
                    style={{
                        width: "100%",
                        height:this.state.height,
                        overflow:this.props.type==="reply"?"hidden":"scroll",
                        color:"black",
                        paddingLeft: "35px",
                        paddingRight:"35px",
                        paddingBottom:"35px",
                        paddingTop:"25px",
                        fontSize: "30px",
                        lineHeight: "40px",
                        letterSpacing:"1px",
                        border: "none",
                    }}
                    minChar={1}
                    trigger={{
                        "@": {
                            dataProvider: token => this.renderTags(token),
                            component: this.ItemTags,
                            output: (tags, trigger) => "@" + tags.uname
                        },
                        "#": {
                            dataProvider: token => this.renderHash(token),
                            component: this.ItemHash,
                            output: (tags, trigger) => "#" + tags.hashtag
                        },
                        "&": {
                            dataProvider: token => this.renderGroup(token),
                            component: this.ItemGroups,
                            output: (tags, trigger) => "&" + tags.group
                        }
                    }}
                />
            </div>
        );
    }
}

export default SRtext;