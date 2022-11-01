import Tree from './Tree'
// import Leaderboard from './Leaderboard';
import './App.css';

function App() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;

  if(process.env.REACT_APP_LEADERBOARD_CODE) {
    var signup = <p><strong>Sign up at <span className="url">adventofcode.com</span> and join the leaderboard using code <span className="code">{ process.env.REACT_APP_LEADERBOARD_CODE }</span>!</strong></p>
  } else {
    var signup = <p>Find out more and practice on previous years events at <span className="url">adventofcode.com</span>!</p>;
  }

  if(month < 12) {
    var promo = (
      <>
        <h2>Starts 1<sup>st</sup> December</h2>
        { signup }
      </>
    );
  }

  return (
    <div className="App">
      <Tree />
      <div className="Body">
        <div className="Header">
          <h1>Advent of Code { year }</h1>
          <p><small>An Advent calender of small programming puzzles for a variety of skill sets and skill levels that can be solved in any programming language you like</small></p>
          { promo }
        </div>
      </div>
    </div>
  );
}

export default App;

//         <Leaderboard id="1565124" />
