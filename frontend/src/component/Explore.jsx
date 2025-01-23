import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MapBoxMap from "./explore/MapboxMap";
import DropTaskPopup from "./explore/droptask";
import './styles/explore.css'

const Explore = () => {
  const { q_id } = useParams();
  const [center, setCenter] = useState(null);
  const [inputActive, setInputActive] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [index, setIndex] = useState(0);
  const promptText = "WHERE ARE YOU HEADED TO?";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let addChar;
    function tick() {
      setTypedText((prev) => prev + promptText[index]);
      // console.log(promptText[index.current], index.current);
      setIndex((prev) => prev + 1);
    }
    if (index < promptText.length && !hasSearched && inputActive) {
      addChar = setInterval(tick, 100);
    }
    return () => clearInterval(addChar)


  }, [typedText, inputActive, hasSearched]);




  // useEffect(() => {
  //   if (!sessionStorage.getItem("jwtToken")) {
  //     alert("Please login first");
  //     window.location.href = `/${q_id}`;
  //     return;
  //   }

  //   if (q_id) {
  //     console.log(`Received q_id: ${q_id}`);
  //   }
  // }, [q_id]);

  return (
    <div className="landingContainer">
      <MapBoxMap showControls={false} q_id={q_id} setInputActive={setInputActive} setHasSearched={setHasSearched} setTypedText={setTypedText} inputActive={inputActive} setIndex={setIndex}/>
      {!inputActive && !hasSearched && <div className="titlee">DPINS</div>}
      {inputActive && !hasSearched && <h1 className="prompt">{typedText}</h1>}

    </div>
  );
};

export default Explore;
