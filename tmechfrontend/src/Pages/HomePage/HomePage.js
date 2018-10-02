import React from "react";
import ReactDOM from "react-dom";
import {Message, Image, Dropdown, Form, Header, Icon, Container, Input, Segment, Grid, Button} from "semantic-ui-react";
import {Link} from "react-router-dom";
import axios from "axios";
import {Helmet} from 'react-helmet';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
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
      selected_song_ids: [],
      recommended_songs: [],
      played_song_id: "",
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeSearch_text = this.handleChangeSearch_text.bind(this);
    this.handleResultSelect = this.handleResultSelect.bind(this);
    this.handleAddList = this.handleAddList.bind(this);
  }

  handleAddList(event){
    axios.post("http://127.0.0.1:8000/add_list/",
    {
      list: this.state.selected_song_ids
    })
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
      axios.post("http://127.0.0.1:8000/get_rec/",
      {
        current_list: [...this.state.selected_song_ids, spotify_id]
      }).then(response=>{
        this.setState({
          recommended_songs: response.data,
          played_song_id: response.data[0].spotify_id,
        })
        console.log(response.data)
      })
      this.setState({
        selected_songs: [...this.state.selected_songs, selectedSong],
        selected_song_ids: [...this.state.selected_song_ids, spotify_id],
      })
  }


  render(){
    return (
      <Container style={{ paddingTop: '3em', paddingLeft:'3em', paddingRight: '3em', animationName:'moveUp', animationDuration:'4s'}} fluid>
        {
          this.state.search_result[0].title.length == 0 &&
          <div style={{paddingTop:'22em'}}>
          </div>
        }
        <Helmet>
          <style>{"body {background-color:#FFFFFF;}"}</style>
        </Helmet>
        <Header color='yellow' textAlign='center' style={{ fontSize : '50px'}}>tunemech</Header>
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
                          <Image src={song.album_image}/>
                        </Grid.Column>
                        <Grid.Column width = {13}>
                          <Grid>
                            <Grid.Row style = {{"padding-bottom":"0", "padding-top":"27px"}}>
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
              <Grid.Column centered width={6}>
                <Header as='h1'>Your List</Header>
              {
                this.state.selected_songs.map((song) =>(
                  <Segment className="selected_songs">
                    <Grid>
                      <Grid.Row style = {{"padding":"0"}}>
                        <Grid.Column width = {3} style = {{"padding-left":"0"}}>
                          <Image src={song.album_image} />
                        </Grid.Column>
                        <Grid.Column width = {12}>
                          <Grid>
                            <Grid.Row style = {{"padding-bottom":"0", "padding-top":"42px"}}>
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
                        <Grid.Column width = {1}>
                          <Icon link name = 'close' size='large' style = {{marginTop:'5px'}}/>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Segment>
                ))
              }
              <Button floated = 'right' onClick = {this.handleAddList}>
                Add
              </Button>
              </Grid.Column>
            }
            {
              this.state.recommended_songs.length > 0 &&
              <Grid.Column width={5}>
                <Header as='h1' center>Our Recommendations</Header>
              {
                this.state.recommended_songs.map((song) =>(
                  <Segment className="recommended_songs">
                    <Grid>
                      <Grid.Row style = {{"padding":"0"}}>
                        <Grid.Column width = {3} style = {{"padding-left":"0"}}>
                          <Image src={song.album_image} />
                        </Grid.Column>
                        <Grid.Column width = {13}>
                          <Grid>
                            <Grid.Row style = {{"padding-bottom":"0", "padding-top":"27px"}}>
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
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}
