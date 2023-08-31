import logo from './logo.svg';
import './App.css';
import React, { useRef, useState, useEffect } from "react";
import "./styles.css";
import { ReactReader, ReactReaderStyle } from "react-reader";

function App() {
/**
 * Eragon.epub                      - Swedish
 * Brisingr.epub                    - Swedish
 * Gulag_Archipelago.epub           - English
 */
import Ebook from "./Eragon.epub";

const ownStyles = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "red"
  }
};

const loc = null;

export default function App() {
  const [selections, setSelections] = useState([]);
  const renditionRef = useRef(null);

  const [location, setLocation] = useState(loc);
  const locationChanged = (epubcifi) => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    setLocation(epubcifi);
    console.log(location);
  };


  useEffect(() => {
    if (renditionRef.current) {
      function setRenderSelection(cfiRange, contents) {
        setSelections(
          selections.concat({
            text: renditionRef.current.getRange(cfiRange).toString(),
            cfiRange
          })
        );
        renditionRef.current.annotations.add(
          "highlight",
          cfiRange,
          {},
          null,
          "hl",
          {
            fill: "yellow",
            "fill-opacity": "0.5"
          }
        );
        contents.window.getSelection().removeAllRanges();
      }
      renditionRef.current.on("selected", setRenderSelection);
      console.log(selections);
      return () => {
        renditionRef.current.off("selected", setRenderSelection);
      };
    }
  }, [setSelections, selections]);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    <>
      <div className="App" style={{ position: "relative", height: "100vh" }}>
        <ReactReader
          location={location}
          locationChanged={locationChanged}
          url={Ebook}
          styles={ownStyles}
          getRendition={(rendition) => {
            renditionRef.current = rendition;
            renditionRef.current.themes.default({
              "::selection": {
                background: "yellow"
              }
            });
            setSelections([]);
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          right: "1rem",
          zIndex: 1,
          backgroundColor: "white"
        }}
      >
        Selection:
        <ul>
          {selections.map(({ text, cfiRange }, i) => (
            <li key={i}>
              {text}{" "}
              <button
                onClick={() => {
                  renditionRef.current.display(cfiRange);
                }}
              >
                Show
              </button>
              <button
                onClick={() => {
                  renditionRef.current.annotations.remove(
                    cfiRange,
                    "highlight"
                  );
                  setSelections(selections.filter((item, j) => j !== i));
                }}
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
