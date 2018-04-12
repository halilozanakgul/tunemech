import React from "react";
import ReactDOM from "react-dom";
import {Segment, Grid, Form, Button} from "semantic-ui-react";
import {Link} from "react-router-dom";
import axios from "axios";

export default class NewSong extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      title: "",
      artist: "",
      album: "",
      spotify_url: ""
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeAlbum = this.handleChangeAlbum.bind(this);
    this.handleChangeArtist = this.handleChangeArtist.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeSpotifyURL = this.handleChangeSpotifyURL.bind(this);
  }

  handleChangeAlbum(event){
    this.setState({
      album: event.target.value
    });
  }

  handleChangeArtist(event){
    this.setState({
      artist: event.target.value
    });
  }

  handleChangeTitle(event){
    this.setState({
      title: event.target.value
    });
  }

  handleChangeSpotifyURL(event){
    this.setState({
      spotify_url: event.target.value
    });
  }

  handleSubmit(event){
    axios.post("http://127.0.0.1:8000/newsong/",
    {
      title: this.state.title,
      album: this.state.album,
      artist: this.state.artist,
      spotify_url: this.state.spotify_url
    }).then(response=>{
      window.location.reload();
    });
    event.preventDefault();
  }

  render(){
    return (
      <Grid>
        <Grid.Row centered>
          <Grid.Column width={12}>
            <Segment>
              <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                  <label>Title</label>
                  <input value={this.state.title} onChange={this.handleChangeTitle}/>
                </Form.Field>
                <Form.Field>
                  <label>Artist</label>
                  <input value={this.state.artist} onChange={this.handleChangeArtist}/>
                </Form.Field>
                <Form.Field>
                  <label>Album</label>
                  <input value={this.state.album} onChange={this.handleChangeAlbum}/>
                </Form.Field>
                <Form.Field>
                  <label>Spotify URL</label>
                  <input value={this.state.spotify_url} onChange={this.handleChangeSpotifyURL}/>
                </Form.Field>
                <Button type="submit">Add Song</Button>
                <Link to="/"><Button>Go Back</Button></Link>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
