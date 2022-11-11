const { useState } = React;

const keyboardKeys = [
  {
    id: "seven",
    value: 7,
    classId: "number",
  },
  {
    id: "eight",
    value: 8,
    classId: "number",
  },
  {
    id: "nine",
    value: 9,
    classId: "number",
  },
  {
    id: "four",
    value: 4,
    classId: "number",
  },
  {
    id: "five",
    value: 5,
    classId: "number",
  },
  {
    id: "six",
    value: 6,
    classId: "number",
  },
  {
    id: "one",
    value: 1,
    classId: "number",
  },
  {
    id: "two",
    value: 2,
    classId: "number",
  },
  {
    id: "three",
    value: 3,
    classId: "number",
  },
  {
    id: "zero",
    value: 0,
    classId: "number",
  },
  {
    id: "decimal",
    value: ".",
    classId: "decimal",
  },
  {
    id: "divide",
    value: "/",
    classId: "operator",
  },
  {
    id: "multiply",
    value: "*",
    classId: "operator",
  },
  {
    id: "subtract",
    value: "-",
    classId: "operator",
  },
  {
    id: "add",
    value: "+",
    classId: "operator",
  },
];

const App = () => {
  const [total, setTotal] = useState("0");
  const [expression, setExpression] = useState("0");

  const handleExpression = (e) => {
    const expressionArray = expression.split(/[+*\/-]/gm);
    const lastExpressionNumber = expressionArray[expressionArray.length - 1];

    if (e.target.value === "decimal" && lastExpressionNumber) {
      if (lastExpressionNumber.includes(".")) {
        return;
      }
    }

    if (e.target.value === "operator" && e.target.id !== "subtract") {
      if (isNaN(expression.slice(-1))) {
        if (expression.slice(-1) === "-" && isNaN(expression.slice(-2, -1))) {
          setExpression(
            (expression.slice(0, -2) + e.target.innerText).toString()
          );
          return;
        }
        setExpression(
          (expression.slice(0, -1) + e.target.innerText).toString()
        );
        return;
      }
    }

    if (e.target.value === "number" && expression === "0") {
      setExpression(e.target.innerText);
      return;
    }

    setExpression((prevExpression) =>
      (prevExpression + e.target.innerText).toString()
    );

    if (e.target.value === "number") {
      setTotal(eval(expression + e.target.innerText));
      return;
    }
  };

  const handleEquals = () => {
    if (isNaN(expression.slice(-1))) {
      return;
    }
    setExpression(eval(expression).toString());
  };

  const handleClear = () => {
    setTotal("0");
    setExpression("0");
  };

  const handleDelete = () => {
    let newValue = expression.slice(0, -1).toString();
    setExpression(newValue);
  };

  return (
    <section className="d-flex align-items-center justify-content-center">
      <div id="calculator" className="container">
        <Display total={total} expression={expression} />
        <KeyBoard
          handleExpression={handleExpression}
          handleDelete={handleDelete}
          handleClear={handleClear}
          handleEquals={handleEquals}
        />
      </div>
    </section>
  );
};

const Display = ({ total, expression }) => {
  return (
    <div className="row">
      <div className="col p-1 text-right">
        <p className="secondary-display m-0">{total}</p>
        <div id="display" className="primary-display m-0">
          {expression}
        </div>
      </div>
    </div>
  );
};

const KeyBoard = ({
  handleExpression,
  handleDelete,
  handleClear,
  handleEquals,
}) => {
  return (
    <div className="row">
      <div className="col-9 p-0">
        <button
          className="btn btn-secondary border-white"
          id="clear"
          value="clear"
          onClick={handleClear}
        >
          AC
        </button>
        <button
          className="btn btn-secondary border-white"
          id="delete"
          value="delete"
          onClick={handleDelete}
        >
          DEL
        </button>
        {keyboardKeys
          .filter((key) => key.classId !== "operator")
          .map((key) => {
            return (
              <Key key={key.id} {...key} handleExpression={handleExpression} />
            );
          })}
      </div>
      <div className="col-3 p-0">
        {keyboardKeys
          .filter(
            (key) => key.classId !== "number" && key.classId !== "decimal"
          )
          .map((key) => {
            return (
              <Key key={key.id} {...key} handleExpression={handleExpression} />
            );
          })}
        <button
          className="btn btn-secondary border-white"
          id="equals"
          value="equals"
          onClick={handleEquals}
        >
          =
        </button>
      </div>
    </div>
  );
};

const Key = ({ id, value, classId, handleExpression }) => {
  return (
    <button
      className={
        classId !== "number" && classId !== "decimal"
          ? "btn btn-secondary border-white"
          : "btn bg-light border-white"
      }
      id={id}
      value={classId}
      onClick={handleExpression}
    >
      {value}
    </button>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
