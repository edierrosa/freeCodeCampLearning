const { useState, useEffect, useRef } = React;

const timeFormat = (timer) => {
  let minutes = Math.floor(timer / 60);
  let seconds = timer % 60;
  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
};

const App = () => {
  const [sessionBreak, setSessionBreak] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState("25 + 5 Clock");
  const [timer, setTimer] = useState(1500);
  const [isTimerOn, setTimerOn] = useState(false);

  const audioRef = useRef(null);

  const handleTimer = () => {
    if (isTimerOn) {
      setTimerOn(false);
    }
    if (
      (!isTimerOn && timerLabel === "Session") ||
      (!isTimerOn && timerLabel === "Break")
    ) {
      setTimerOn(true);
    }
    if (!isTimerOn && timerLabel === "25 + 5 Clock") {
      setTimer(sessionLength * 60);
      setTimerLabel("Session");
      setTimerOn(true);
    }
  };

  const handleReset = () => {
    setTimerOn(false);
    setSessionBreak(5);
    setSessionLength(25);
    setTimer(1500);
    setTimerLabel("25 + 5 Clock");
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handleIncrement = (e) => {
    if (e.target.id === "break-increment" && sessionBreak < 60) {
      setSessionBreak(sessionBreak + 1);
    }

    if (e.target.id === "session-increment" && sessionLength < 60) {
      setSessionLength(sessionLength + 1);
    }
  };

  const handleDecrement = (e) => {
    if (e.target.id === "break-decrement" && sessionBreak > 1) {
      setSessionBreak(sessionBreak - 1);
    }

    if (e.target.id === "session-decrement" && sessionLength > 1) {
      setSessionLength(sessionLength - 1);
    }
  };

  useEffect(() => {
    if (!isTimerOn && timerLabel === "Break") {
      setTimer(sessionBreak * 60);
    }
  }, [sessionBreak]);

  useEffect(() => {
    if (!isTimerOn) {
      setTimer(sessionLength * 60);
    }
  }, [sessionLength]);

  useEffect(() => {
    if (isTimerOn) {
      if (timer === 0) {
        audioRef.current.play();
      }
      if (timer < 0 && timerLabel === "Session") {
        setTimerLabel("Break");
        setTimer(sessionBreak * 60);
      }
      if (timer < 0 && timerLabel === "Break") {
        setTimerLabel("Session");
        setTimer(sessionLength * 60);
      }
      const timerLoop = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(timerLoop);
    }
  });

  return (
    <main className="d-flex align-items-center justify-content-center">
      <div className="container text-center p-3">
        <div className="container-fluid p-3">
          <h3 id="timer-label">{timerLabel}</h3>
          <h1 id="time-left">{timeFormat(timer)}</h1>
          <div className="session-controls">
            <i
              id="start_stop"
              onClick={handleTimer}
              className={`bi bi-${isTimerOn ? "pause" : "play"}-circle`}
            />
            <i
              id="reset"
              onClick={handleReset}
              className="bi bi-arrow-repeat"
            />
          </div>
        </div>
        <div className="row align-items-md-stretch">
          <div className="col-md-6 p-2">
            <h3 id="break-label">Break Length</h3>
            <div>
              <i
                id="break-increment"
                className="bi bi-arrow-up-circle"
                onClick={handleIncrement}
              />
              <span id="break-length">{sessionBreak}</span>
              <i
                id="break-decrement"
                className="bi bi-arrow-down-circle"
                onClick={handleDecrement}
              />
            </div>
          </div>
          <div className="col-md-6 p-2">
            <h3 id="session-label">Session Length</h3>
            <div>
              <i
                id="session-increment"
                className="bi bi-arrow-up-circle"
                onClick={handleIncrement}
              />
              <span id="session-length">{sessionLength}</span>
              <i
                id="session-decrement"
                className="bi bi-arrow-down-circle"
                onClick={handleDecrement}
              />
              <audio
                id="beep"
                ref={audioRef}
                preload="auto"
                src="https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
