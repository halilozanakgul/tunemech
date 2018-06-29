import React from "react";
import ReactDOM from "react-dom";
import {Form, Header, Container, Input, Segment, Grid, Button} from "semantic-ui-react";
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
          spotify_url: "",
        }
      ],
      search_text: "",
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeSearch_text = this.handleChangeSearch_text.bind(this);
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
      console.log(response);
    })
    event.preventDefault();
  }

  render(){
    return (
      <Container style={{ marginTop: '3em'}}>
        <Header color="yellow" textAlign='center' style={{'font-size' : '50px'}}>tunemech</Header>
        <Grid>
          <Grid.Row centered>
            <Grid.Column width={8}>
              <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                  <input value={this.state.search_text} onChange={this.handleChangeSearch_text}/>
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}
