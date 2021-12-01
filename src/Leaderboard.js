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

  geturl() {
    return `https://adventofcode.com/2021/leaderboard/private/view/${this.state.id}.json`;
  }

  async fetchboard() {
    var url = this.geturl();
    var options = {
      credentials: 'include',
      mode: 'no-cors'
    };

    console.log(`Fetching ${url}`);
    var response = await fetch(url, options);

    if(response.ok) {
      var data = await response.text();
      var json = response.json();

      this.setState({
        show: true,
        members: json.members,
        member_count: json.members.length
      });

      console.log("Updated leaderboard")
    }
    else {
      this.setState({
        show: false
      });

      console.log(`Updating leaderboard failed (${response.status}).. data returned: ${data}`);
    }

    // this.timer = setInterval(this.fetchboard(), (60 * 60 * 1000));
  }

  render() {
    if(this.state.show) {
      var plural = (this.state.member_count > 1) ? "people are" : "person is";
      return <div className="Leaderboard"><p>{this.state.member_count} ${plural} on the leaderboard, stats will be shown once more people join!</p></div>;
    }

    return "";
  }
}

export default Leaderboard;
