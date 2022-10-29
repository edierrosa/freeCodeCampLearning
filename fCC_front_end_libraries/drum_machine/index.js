const { useState, useEffect } = React;

const keyboardKeys = [
  {
    id: 1,
    name: "Q",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
  },
  {
    id: 2,
    name: "W",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
  },
  {
    id: 3,
    name: "E",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
  },
  {
    id: 4,
    name: "A",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
  },
  {
    id: 5,
    name: "S",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
  },
  {
    id: 6,
    name: "D",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
  },
  {
    id: 7,
    name: "Z",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
  },
  {
    id: 8,
    name: "X",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
  },
  {
    id: 9,
    name: "C",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
  },
];

const App = () => {
  const [displayText, setDisplayText] = useState("fCC Drum Machine");

  const handleClick = (e) => {
    e.target.children[0].play();
    setDisplayText(e.target.innerText);
  };

  const handleKeyPress = (e) => {
    const id = e.key.toUpperCase();
    const element = document.getElementById(id);
    if (element) {
      element.children[0].play();
      setDisplayText(element.innerText);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  });

  return (
    <div
      id="drum-machine"
      className="d-flex vh-100 text-center align-items-center justify-content-center m-5"
    >
      <div className="row">
        <div className="col-lg">
          <div className="row justify-content-center">
            <Display keyName={displayText} />
          </div>
        </div>
        <div className="col-lg">
          <div className="row justify-content-center">
            {keyboardKeys.map((key) => {
              return (
                <DrumPad key={key.id} {...key} handleClick={handleClick} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const Display = ({ keyName }) => {
  return (
    <div id="display">
      <h1>{keyName}</h1>
    </div>
  );
};

const DrumPad = ({ id, name, audio, handleClick }) => {
  return (
    <div
      id={name}
      className="drum-pad bg-light col-3 border rounded m-1"
      onClick={handleClick}
    >
      <audio id={name} className="clip" src={audio}></audio>
      {name}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
