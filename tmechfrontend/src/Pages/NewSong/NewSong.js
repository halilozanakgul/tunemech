import React from "react";
import ReactDOM from "react-dom";
import {Segment, Grid} from "semantic-ui-react";
import axios from "axios";

export default class NewSong extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      songs :[
        {
          title: "",
          artist: "",
          album: "",
          spotify_url: ""
        }
      ]
    }
  }
  componentWillMount(){
      axios.get("http://127.0.0.1:8000/songs/")
        .then(response=>{
          this.setState({
            songs: response.data
          });
        }
      );
  }
  render(){
    return (
      <Grid>
        <Grid.Row centered>
          <Grid.Column width={12}>
            <Segment>
              {this.state.songs.map(song=>(
                <div>
                  {song.title}:{song.artist}
                </div>
              ))}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
