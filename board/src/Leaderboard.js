import React from 'react';
import ReactTooltip from 'react-tooltip';
import "./Leaderboard.css";

class Leaderboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      show: false,
      members: [],
      member_count: 0,
      error: false,
    };
  }

  componentDidMount() {
    this.fetchboard();
    setInterval(() => { this.fetchboard() }, (60 * 1000)); // call API every minute
  }

  async fetchboard() {
    var url = process.env.REACT_APP_LEADERBOARD_API_URL;

    console.log(`Fetching ${url}`);
    var response = await fetch(url);

    if(response.ok) {
      try {
        var data = await response.json();
        console.log(data);

        this.setState({
          show: true,
          members: data.members,
          member_count: data.members.length,
        });

        console.log("Updated leaderboard")

        if(data.status != 200) {
          this.setState({
            error: data.error
          })
        } else {
          this.setState({
            error: false
          })
        }
      }
      catch(e) {
        var error = `Updating leaderboard failed: ${ e }`;

        this.setState({
          show: false,
          error: error
        });

        console.error(error);
      }
    }
    else {
      var error = `Updating leaderboard failed (${ response.status })`;

      this.setState({
        show: false,
        error: error
      });

      console.error(error);
    }
  }

  render() {
    if(this.state.show) {
      var plural = (this.state.member_count != 1) ? "people are" : "person is";
      var leaderboard = (
        <div className="Leaderboard">
          <p>{ this.state.member_count } { plural } on the leaderboard, stats will be shown once more people join!</p>
        </div>
      );
    }

    if(this.state.error) {
      var error = (
        <div className="LeaderboardError" data-tip={ this.state.error }>!</div>
        <ReactTooltip effect="solid" event="click" />
      );
    }

    return (
      <>
        { leaderboard }
        { error }
      </>
    )
  }
}

export default Leaderboard;
