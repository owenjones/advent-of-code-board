import React from 'react';
import ReactTooltip from 'react-tooltip';
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

    if(response.ok) {
      try {
        var data = await response.json();
        console.log(data);

        if(data.status != 200) {
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
      catch(e) {
        var error = `Updating leaderboard failed: ${ e }`;

        this.setState({
          error: error
        });

        console.error(error);
      }
    }
    else {
      var error = `Updating leaderboard failed (${ response.status })`;

      this.setState({
        error: error
      });

      console.error(error);
    }
  }

  render() {
    var leaderboard = (
      <div className="Leaderboard">
        { this.state.members.map(m => (<p>{ m.name }: <span className="stars">{ m.stars }*</span></p>)) }
      </div>
    );

    if(this.state.error) {
      var error = (
        <>
          <div className="LeaderboardError" data-tip={ this.state.error }>!</div>
          <ReactTooltip effect="solid" event="click" />
        </>
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
