import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import api from "./api";
import Table from "./components/Table";
import Select from "./components/Select";

function App() {
  const [corpus, setCorpus] = useState(null);

  const fetch = async () => {
    const res = await api.get("/corpus");

    console.log("res", res);
    //setCorpus(res);
  };

  const fetchById = async (id: number) => {
    const res = await api.get(`/corpus/${id}`);

    console.log("res", res);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div>
      <Select />
      <Table />
    </div>
  );
}

export default App;
