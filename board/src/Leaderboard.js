import React from 'react';
import "./Leaderboard.css";

class Leaderboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      show: false,
      members: [],
      member_count: 0
    };
  }

  componentDidMount() {
    this.fetchboard();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  async fetchboard() {
    var url = process.env.REACT_APP_LEADERBOARD_API_URL;

    console.log(`Fetching ${url}`);
    var response = await fetch(url);

    if(response.ok) {
      var data = await response.json();
      console.log(data);

      this.setState({
        show: true,
        members: data.members,
        member_count: data.members.length
      });

      console.log("Updated leaderboard")
    }
    else {
      this.setState({
        show: false
      });

      console.log(`Updating leaderboard failed (${response.status}).. data returned: ${data}`);
    }

    this.timer = setInterval(this.fetchboard(), (15 * 60 * 1000));
  }

  render() {
    if(this.state.show) {
      var plural = (this.state.member_count != 1) ? "people are" : "person is";
      return (
        <div className="Leaderboard">
          <p>{this.state.member_count} {plural} on the leaderboard, stats will be shown once more people join!</p>
        </div>
      );
    }

    return "";
  }
}

export default Leaderboard;
