import React from "react";
import ReactDOM from "react-dom";
import {Segment, Grid, Button} from "semantic-ui-react";
import {Link} from "react-router-dom";
import axios from "axios";

export default class HomePage extends React.Component {
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
            <Link to="/newsong"><Button>Add a New Song</Button></Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
