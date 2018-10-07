import React from "react";
import {Message, Image, Label, Input, Form, Header, Icon, Container, Segment, Grid, Button} from "semantic-ui-react";
import axios from "axios";
import {Helmet} from 'react-helmet';
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
      is_loading: false,
      has_written: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeSearch_text = this.handleChangeSearch_text.bind(this);
    this.handleResultSelect = this.handleResultSelect.bind(this);
    this.handleAddList = this.handleAddList.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleReset(event){
    console.log("Reset")
    axios.post("http://127.0.0.1:8000/reset/")
  }

  handleAddList(event){
    axios.post("http://127.0.0.1:8000/add_list/",
    {
      list: this.state.selected_songs
    })
  }

  handleChangeSearch_text(event){
    this.setState({
      has_written: true,
      search_text: event.target.value
    }, function() {
      this.handleSubmit(event);
    });
  }

  handleSubmit(event){
    this.setState({
      is_loading: true,
    })
    axios.post("http://127.0.0.1:8000/search_songs/",
    {
      query: this.state.search_text
    }).then(response=>{
      this.setState({
        is_loading: false,
        search_result: response.data
      })
    })
  }

  handleResultSelect(song, index){
    let i = index
    this.state.search_result.splice(i, 1)
    axios.post("http://127.0.0.1:8000/get_rec/",
    {
      current_list: [...this.state.selected_songs, song]
    }).then(response=>{
      if(response.data && response.data[0]){
        this.setState({
          recommended_songs: response.data,
          played_song_id: response.data[0]["spotify_id"],
        });
      }
      else{
        this.setState({
          recommended_songs: [],
          played_song_id: "",
        });
      }
    })
    this.setState({
      selected_songs: [...this.state.selected_songs, song],
    })
  }


  render(){
    return (
      <Container style={{ paddingTop: '3em', paddingLeft:'3em', paddingRight: '3em'}} fluid>
        {
          (!this.state.has_written) &&
          <div style={{paddingTop:'22em'}}>
          </div>
        }
        <Helmet>
          <style>{"body {background-color:#FFFFFF;}"}</style>
        </Helmet>
        <Header color='yellow' textAlign='center' style={{ fontSize : '50px'}}>tunemech</Header>
        <Grid>
          {
            this.state.played_song_id && this.state.played_song_id.length > 0 &&
            <Grid.Row centered>
              <Grid.Column width={6}>
                <iframe title="spotifyPlayer" src={"https://open.spotify.com/embed?uri=spotify:track:"+this.state.played_song_id} width='100%' height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
              </Grid.Column>
            </Grid.Row>
          }
          <Grid.Row centered>
            <Grid.Column width={5}>
              <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                  <Input
                    loading={this.state.is_loading}
                    onChange={this.handleChangeSearch_text}
                    placeholder="Search a song..."
                  />
                </Form.Field>
              </Form>
              {
                this.state.search_result.length>0 && this.state.search_result[0]["title"].length>0 &&
                this.state.search_result.map((song, i) =>(
                  <Segment key={song["spotify_id"]} className="search_result" onClick={() => this.handleResultSelect(song, i)}>
                    <Grid>
                      <Grid.Row style = {{"padding":"0"}}>
                        <Grid.Column width = {3} style = {{"paddingLeft":"0"}}>
                          <Image src={song.album_image}/>
                        </Grid.Column>
                        <Grid.Column width = {13}>
                          <Grid>
                            <Grid.Row style = {{"paddingBottom":"0", "paddingTop":"27px"}}>
                              <div style = {{"fontSize":"18pt"}}>{song.title}</div>
                            </Grid.Row>
                            <Grid.Row>
                              <Grid.Column width = {6} style = {{"paddingLeft":"0"}}>
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
                this.state.search_result.length === 0 &&
                <Message color="yellow">
                  No result found!
                </Message>
              }
            </Grid.Column>
            {
              this.state.selected_songs.length>0 && this.state.selected_songs[0]["title"].length>0 &&
              <Grid.Column centered="true" width={6}>
                <Header as='h1'>Your List</Header>
              {
                this.state.selected_songs.map((song) =>(
                  <Segment key={song["spotify_id"]} className="selected_songs">
                    <Grid>
                      <Grid.Row style = {{"padding":"0"}}>
                        <Grid.Column width = {3} style = {{"paddingLeft":"0"}}>
                          <Image src={song.album_image} />
                        </Grid.Column>
                        <Grid.Column width = {12}>
                          <Grid>
                            <Grid.Row style = {{"paddingBottom":"0", "paddingTop":"42px"}}>
                              <div style = {{"fontSize":"18pt"}}>{song.title}</div>
                            </Grid.Row>
                            <Grid.Row>
                              <Grid.Column width = {6} style = {{"paddingLeft":"0"}}>
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
                <Header as='h1' center="true">Our Recommendations</Header>
              {
                this.state.recommended_songs.map((song) =>(
                  <Segment key={song.spotify_id} className="recommended_songs">
                    <Grid>
                      <Grid.Row style = {{"padding":"0"}}>
                        <Grid.Column width = {3} style = {{"paddingLeft":"0"}}>
                          <Image src={song.album_image} />
                        </Grid.Column>
                        <Grid.Column width = {13}>
                          <Grid>
                            <Grid.Row style = {{"paddingBottom":"0", "paddingTop":"27px"}}>
                              <div style = {{"fontSize":"18pt"}}>{song.title}</div>
                              <Label color='yellow' circular>{song.mech}</Label>
                            </Grid.Row>
                            <Grid.Row>
                              <Grid.Column width = {6} style = {{"paddingLeft":"0"}}>
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
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}
