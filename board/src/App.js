import Tree from './Tree'
import Leaderboard from './Leaderboard';
import './App.css';

function App() {
  var date = new Date();
  var month = date.getMonth() + 1; // getMonth returns month 0-indexed

  // Which event to show?
  // before November: previous years event, as it was
  // in November: blank event with "Starts 1st December" message
  // in December: current years event

  var year = (month > 10) ? date.getFullYear() : (date.getFullYear() - 1);

  var promostr = "An Advent calender of small programming puzzles for a variety of skill sets and skill levels that can be solved in any programming language you like";

  if (month == 11) {
    var promo = (
      <>
        <p>{promostr}</p>
        <h2>Starts 1<sup>st</sup> December</h2>
      </>
    );
  } else {
    var promo = <p>{promostr}</p>;
  }

  if (process.env.REACT_APP_LEADERBOARD_CODE) {
    var signupstr = <>Sign up at <span className="url">adventofcode.com</span> and join the leaderboard<br />using code <span className="code">{process.env.REACT_APP_LEADERBOARD_CODE}</span>!</>
  } else {
    var signupstr = <>Find out more and practice on previous year's events at <span className="url">adventofcode.com</span>!</>;
  }

  var signup = (<p><strong>{signupstr}</strong></p>);

  return (
    <div className="App">
      <Tree />
      <div className="Body">
        <div className="Header">
          <h1>Advent of Code {year}</h1>
          {promo}
          {signup}
        </div>
        <Leaderboard />
      </div>
    </div>
  );
}

export default App;
