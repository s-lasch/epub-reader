import React, { useRef, useState, useEffect } from "react";
import "./styles.css";
import { ReactReader, ReactReaderStyle } from "react-reader";

/**
 * Eragon.epub                      - Swedish
 * Brisingr.epub                    - Swedish
 * Gulag_Archipelago.epub           - English
 */
import Ebook from "./humanism.epub";

const ownStyles = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "lightblue"
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
    </>
  );
}
