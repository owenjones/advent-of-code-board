import React from 'react';
import { Tooltip } from 'react-tooltip';
import "./Leaderboard.css";

class Leaderboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      members: [],
      member_count: 0,
      error: false,
    };
  }

  componentDidMount() {
    this.fetchboard();
    setInterval(() => { this.fetchboard() }, (5 * 60 * 1000)); // call API every five minutes
  }

  async fetchboard() {
    var url = process.env.REACT_APP_LEADERBOARD_API_URL;

    console.log(`Fetching ${url}`);
    var response = await fetch(url);

    if (response.ok) {
      try {
        var data = await response.json();
        console.log(data);

        if (data.status != 200) {
          var error = data.error;
          console.error(error);
        } else {
          var error = false;
        }

        this.setState({
          error: error,
          members: data.members,
          member_count: data.members.length,
        });

        console.log("Updated leaderboard")
      }
      catch (e) {
        var error = `Updating leaderboard failed: ${e}`;

        this.setState({
          error: error
        });

        console.error(error);
      }
    }
    else {
      var error = `Updating leaderboard failed (${response.status})`;

      this.setState({
        error: error
      });

      console.error(error);
    }
  }

  row(member) {
    var name = member.name ? member.name : <i>anonymous user</i>;
    return <p>{name}: <span className="stars">{member.stars}*</span> ({member.score})</p>
  }

  render() {
    if (this.state.members.length > 0) {
      var leaderboard = (
        <div className="Leaderboard">
          <div className="inner">
            {this.state.members.map(m => this.row(m))}
          </div>
        </div>
      );
    }

    if (this.state.error) {
      var error = (
        <>
          <div className="LeaderboardError" data-tooltip-id="error-tooltip" data-tooltip-content={this.state.error}>!</div>
          <Tooltip id="error-tooltip" effect="solid" event="click" />
        </>
      );
    }

    return (
      <>
        {leaderboard}
        {error}
      </>
    )
  }
}

export default Leaderboard;
