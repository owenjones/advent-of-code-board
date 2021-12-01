import "./Header.css"

function Header(props) {
  return (
    <div className="Header">
      <h1>Advent of Code 2021</h1>
      <p>An Advent calender of small programming puzzles for a variety of skill sets and skill levels that can be solved in any programming language you like.</p>
      <p><strong>Sign up at <span className="url">adventofcode.com</span> and join the leaderboard using code <span className="code">{process.env.REACT_APP_LEADERBOARD_CODE}</span>!</strong></p>
    </div>
  );
}

export default Header;
