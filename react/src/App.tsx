import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import api from "./api";
import Table from "./components/Table";
import Select from "./components/Select";

function App() {
  const [corpus, setCorpus] = useState(null);

  const [textNumber, setTextNumber] = useState<any>();
  const [result, setResult] = useState<any>(null);

  const handleChangeText = (event: any) => {
    setTextNumber({ ...textNumber, text: event.target.value });
  };

  const handleChangeNumber = (event: any) => {
    const { value } = event.target;

    setTextNumber({ ...textNumber, number: value });
  };

  const fetch = async () => {
    const res = await api.get("/corpus");

    console.log("res", res);
    //@ts-ignore
    setCorpus(res);
  };

  const fetchById = async (id: number) => {
    const res = await api.get(`/corpus/${id}`);

    console.log("res", res);
  };

  useEffect(() => {
    fetch();
  }, []);

  const onClick = async () => {
    const res = await api.post('/cleander', {text: textNumber.text, number: textNumber.number})

    const setResult(res);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red",
      }}
    >
      {/* 
        * lab1    
        *
          <Select />
          <Table corpus={corpus} /> 
        */}

      <div
        style={{
          width: "300px",
          height: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <label htmlFor="text">Colocar texto</label>
        <input id="text" onChange={handleChangeText} />
        <label htmlFor="number">colocar número</label>
        <input
          id="number"
          type="number"
          maxLength={1}
          onChange={handleChangeNumber}
        />

        <button onClick={onClick}>Click</button>

        {result &&(<div>
          <h1>{result.cleanedText}</h1>
          <h1>{result.stemmedText}</h1>
          <h1>{result.tokenization}</h1>
        </div>)}
      </div>
    </div>
  );
}

export default App;
