import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { readDeck, createCard } from "../utils/api/index";
import CardForm from "./CardForm";

function AddCard({card}) {
  const [deck, setDeck] = useState({}); 
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  // const [card, setCard] = useState({});
  const { deckId } = useParams();
  const history = useHistory();

  //pulls correct deck in order to add cards
  useEffect(() => {
    const abortController = new AbortController();
    async function loadDeck() {
      try {
        const pullDeck = await readDeck(deckId, abortController.signal);
        setDeck(pullDeck);
      }
      catch (error) {
        console.log("error reading deck list");
      }
    }
    loadDeck();

    return () => abortController.abort();

  }, [deckId])


  const submitHandler = async (e) => {
    e.preventDefault();
      const abortController = new AbortController();
      const newCard = {
        front, 
        back, 
        deckId
      }
      await createCard(deckId, newCard, abortController.signal);
      // setCard({});
      history.push(`/decks`);
};

const onChangeFrontHandler = (e) => {
  setFront(e.target.value);
  // setCard({
    console.log("change handler")
  // ...card,
  // [e.target.name]: e.target.value,
  // });
};

const onChangeBackHandler = (e) => {
  setBack(e.target.value);
  // setCard({
    console.log("change handler")
  // ...card,
  // [e.target.name]: e.target.value,
  // });
};


  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to={`/decks/${deckId}/cards/new`}>{deck.name}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Add Card</li>
        </ol>
      </nav>
      <h1>{`${deck.name}: Add Card`}</h1>
      <div className="card-info">
      <CardForm 
          handleSubmit={submitHandler}
          onChangeFrontHandler={onChangeFrontHandler}
          onChangeBackHandler={onChangeBackHandler}
          front={front}
          back={back}
          deckId={deckId}
          save="Save"
          cancel="Cancel"
          />
      </div>
      
    </div>
  )
}

export default AddCard;
