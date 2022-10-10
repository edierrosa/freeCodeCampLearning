const { marked } = marked;
const { useState, useEffect } = React;

marked.setOptions({
  breaks: true,
});

const App = () => {
  const [markedText, setMarkedText] = useState(test);

  const handleChange = (e) => {
    setMarkedText(e.target.value);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <a href="https://www.markdownguide.org/" target="_blank">
          <i className="bi bi-markdown"></i>
        </a>
        <h4 className="m-2">Markdown Previewer</h4>
      </div>
      <div className="row">
        <div className="editor-wrapper col-lg-6">
          <textarea
            id="editor"
            className="h-100 w-100"
            type="text"
            onChange={handleChange}
            value={markedText}
            style={{ resize: "none", outline: "none" }}
          ></textarea>
        </div>
        <div className="col-lg-6">
          <div
            id="preview"
            dangerouslySetInnerHTML={{
              __html: marked.parse(markedText),
            }}
          />
        </div>
      </div>
    </div>
  );
};

const test = `# React Markdown Previewer (h1 size)

## sub-heading (h2)

link [links](https://www.freecodecamp.org)

inline  code, \`<div></div>\`

> Block Quotes!

1. list item
- list item

\`\`\`
const yourFunction = () => {
  console.log("code block")
} 
\`\`\`

**bold text**


![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
`;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
