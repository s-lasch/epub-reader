import React, { useRef, useState, useEffect } from "react";
import "./styles.css";
import { ReactReader, ReactReaderStyle } from "react-reader";

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
    <>
      <div className="App" style={{ position: "relative", height: "100vh" }}>
        <form name="upload" method="POST" enctype="multipart/form-data" data-netlify="true">
            <label for="file">Select an EPUB file:</label>
            <input type="file" name="file" accept=".epub" required />
            <br><br/>
            <input type="submit" value="Upload" />
        </form>
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
