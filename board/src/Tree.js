import React from 'react';
import './Tree.css';

class Bauble extends React.Component {
  constructor() {
    super();
    this.start = Math.floor(Math.random() * 6);
    this.state = { clicks: 0 };
    this.nextColour = this.nextColour.bind(this);
    this.setColour()
  }

  render() {
    return (
      <span className={this.classes} onClick={this.nextColour}>()</span>
    );
  }

  setColour(skip = 0) {
    var colour = (this.start + skip) % 6;
    this.classes = `Bauble b${colour}`;
  }

  nextColour() {
    var clicks = this.state.clicks + 1;
    this.setColour(clicks);
    this.setState({ clicks: clicks });
  }
}

class Magic extends React.Component {
  render() {
    return <span onClick={this.reload}>.</span>;
  }

  reload() {
    window.location.reload();
  }
}

function Star() {
  return (
    <span className="Star">{`/\\
<  >
\\/`}</span>
  );
}

function Trunk() {
  return (
    <span className="Trunk">{`|   |`}</span>
  );
}

function Pot() {
  return (
    <span className="Pot">{`
|'''''|
\\_____/`}</span>
  );
}

function Tree() {
  // yes, I know it's very ugly, don't judge...
  return (
    <div className="Forest">
      <div className="Tree">
        <pre><Star />{`
/\\
/  \\
/++++\\
/  `}<Bauble />{`  \\
/      \\
/~'~'~'~'\\
/  `}<Bauble />{`  `}<Bauble />{`  \\
/          \\
/*&*&*&*&*&*&\\
/  `}<Bauble />{`  `}<Bauble />{`  `}<Bauble />{`  \\
/              \\
/++++++++++++++++\\
/  `}<Bauble />{`  `}<Bauble />{`  `}<Bauble />{`  `}<Bauble />{`  \\
/                  \\
/~'~'~'~'~'~'~'~'~'~'\\
/  `}<Bauble />{`  `}<Bauble />{`  `}<Bauble />{`  `}<Bauble />{`  `}<Bauble />{`  \\
/*&*&*&*&*&*&*&*&*&*&*&\\
/                        \\
/,`}<Magic />{`,.,.,.,.,.,.,.,.,.,.,.,.\\
`}<Trunk /><Pot />
        </pre>
      </div>
    </div>
  );
}

export default Tree;
