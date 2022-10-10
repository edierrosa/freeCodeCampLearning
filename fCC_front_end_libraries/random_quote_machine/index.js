const { useState, useEffect } = React;

const App = () => {
  const [quote, setQuote] = useState({});

  // Fetch quote
  const fetchQuote = async () => {
    const resp = await fetch("https://type.fit/api/quotes");
    const data = await resp.json();
    setQuote(data[Math.floor(Math.random() * data.length)]);
  };

  // Fetch quote on load
  useEffect(() => {
    fetchQuote();
  }, []);
  return (
    <section className="d-flex vh-100 align-items-center justify-content-center ">
      <div id="quote-box">
        <p id="text" className="lead">
          '{quote.text}'
        </p>
        <hr />
        <h4 id="author" className="">
          {quote.author || "Unknown"}
        </h4>
        <div className="d-flex justify-content-between mt-4">
          <button
            id="new-quote"
            className="btn btn-outline-dark btn-sm align-self-center"
            onClick={fetchQuote}
          >
            New Quote
          </button>
          <a href="https://twitter.com/intent/tweet" target="_blank">
            <i id="tweet-quote" className="bi bi-twitter"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
