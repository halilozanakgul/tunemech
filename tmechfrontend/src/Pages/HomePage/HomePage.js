import React from "react";
import ReactDOM from "react-dom";
import {Message, Image, Dropdown, Form, Header, Container, Input, Segment, Grid, Button} from "semantic-ui-react";
import {Link} from "react-router-dom";
import axios from "axios";
import "./HomePage.css";

export default class HomePage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      songs :[
        {
          title: "",
          artist: "",
          album: "",
          spotify_url: "",
        }
      ],
      search_text: "",
      selected_songs: [],
      search_result: [
        {
          title: "",
          artist: "",
          album: "",
          spotify_url: "",
          spotify_id: "",
          album_image: "",
        }
      ],
      recommended_songs: [],
      played_song_id: "",
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeSearch_text = this.handleChangeSearch_text.bind(this);
    this.handleResultSelect = this.handleResultSelect.bind(this);
  }

  handleChangeSearch_text(event){
    this.setState({
      search_text: event.target.value
    });
  }

  handleSubmit(event){
    axios.post("http://127.0.0.1:8000/search_songs/",
    {
      query: this.state.search_text
    }).then(response=>{
      console.log(response)
      this.setState({
        search_result: response.data
      })
      console.log(this.state.search_result);
    })
  }

  handleResultSelect(spotify_id){
    let i = 0
    let selectedSong = {}
    for(i=0; i<this.state.search_result.length; i++)
      if(this.state.search_result[i].spotify_id == spotify_id){
        selectedSong = this.state.search_result[i]
        break
      }
      this.state.search_result.splice(i, 1)
      this.setState({
        selected_songs: [...this.state.selected_songs, selectedSong],
        recommended_songs: [...this.state.recommended_songs, selectedSong],
        played_song_id: spotify_id,
      })
  }


  render(){
    return (
      <Container style={{ paddingTop: '3em', paddingLeft:'3em', paddingRight: '3em'}} fluid>
        <Header color="yellow" textAlign='center' style={{'font-size' : '50px'}}>tunemech</Header>
        <Grid>
          {
            this.state.played_song_id.length > 0 &&
            <Grid.Row centered>
              <Grid.Column width={6}>
                <iframe src={"https://open.spotify.com/embed?uri=spotify:track:"+this.state.played_song_id} width='100%' height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
              </Grid.Column>
            </Grid.Row>
          }
          <Grid.Row centered>
              <Grid.Column width={5}>
              <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                  <input value={this.state.search_text} onChange={this.handleChangeSearch_text} placeholder="Search a song..."/>
                </Form.Field>
              </Form>
              {
                this.state.search_result.length>0 && this.state.search_result[0]["title"].length>0 &&
                this.state.search_result.map((song) =>(
                  <Segment className="search_result" onClick={() => this.handleResultSelect(song.spotify_id)}>
                    <Grid>
                      <Grid.Row style = {{"padding":"0"}}>
                        <Grid.Column width = {3} style = {{"padding-left":"0"}}>
                          <Image src={song.album_image} />
                        </Grid.Column>
                        <Grid.Column width = {13}>
                          <Grid>
                            <Grid.Row style = {{"padding-bottom":"0", "padding-top":"32px"}}>
                              <div style = {{"font-size":"18pt"}}>{song.title}</div>
                            </Grid.Row>
                            <Grid.Row>
                              <Grid.Column width = {6} style = {{"padding-left":"0"}}>
                                <div style={{"color":"grey"}}>Artist:{song.artist}</div>
                              </Grid.Column>
                              <Grid.Column width = {10}>
                                <div style={{"color":"grey"}}>Album:{song.album}</div>
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Segment>
                ))
              }
              {
                this.state.search_result.length == 0 &&
                <Message color="yellow">
                  No result found!
                </Message>
              }
            </Grid.Column>
            {
              this.state.selected_songs.length>0 && this.state.selected_songs[0]["title"].length>0 &&
              <Grid.Column width={6}>
              {
                this.state.selected_songs.map((song) =>(
                  <Segment className="selected_songs">
                    <Grid>
                      <Grid.Row style = {{"padding":"0"}}>
                        <Grid.Column width = {3} style = {{"padding-left":"0"}}>
                          <Image src={song.album_image} />
                        </Grid.Column>
                        <Grid.Column width = {13}>
                          <Grid>
                            <Grid.Row style = {{"padding-bottom":"0", "padding-top":"32px"}}>
                              <div style = {{"font-size":"18pt"}}>{song.title}</div>
                            </Grid.Row>
                            <Grid.Row>
                              <Grid.Column width = {6} style = {{"padding-left":"0"}}>
                                <div style={{"color":"grey"}}>Artist:{song.artist}</div>
                              </Grid.Column>
                              <Grid.Column width = {10}>
                                <div style={{"color":"grey"}}>Album:{song.album}</div>
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Segment>
                ))
              }
              </Grid.Column>
            }
            {
              this.state.recommended_songs.length > 0 &&
              <Grid.Column width={5}>
              </Grid.Column>
            }
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}
