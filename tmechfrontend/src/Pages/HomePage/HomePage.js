import React from "react";
import ReactDOM from "react-dom";
import {Segment, Grid} from "semantic-ui-react";

export default class HomePage extends React.Component {
  render(){
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Segment>
              Ozan
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
