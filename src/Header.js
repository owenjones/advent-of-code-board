import "./Header.css"

function Header(props) {
  if(process.env.REACT_APP_LEADERBOARD_CODE) {
    var leaderboard_signup = <p><strong>Sign up at <span className="url">adventofcode.com</span> and join the leaderboard using code <span className="code">{process.env.REACT_APP_LEADERBOARD_CODE}</span>!</strong></p>
  }

  return (
    <div className="Header">
      <h1>Advent of Code 2022</h1>
      <p>An Advent calender of small programming puzzles for a variety of skill sets and skill levels that can be solved in any programming language you like</p>
      <h2>Starts 1<sup>st</sup> December</h2>
      <p>Find out more and practice on previous years events at <span className="url">adventofcode.com</span></p>
    </div>
  );
}

export default Header;
