import React, { useEffect, useState, useCallback } from "react";
import Select from "../Select";
import Table from "../Table";
import Tabs from "../Tabs";
import api from "../../api";

type Props = {};

const Lab5: React.FC<Props> = () => {
  const [tabValue, setTabValue] = useState(0);

  const labelTitle = (arg: string) => {
    switch (arg) {
      case "termsAvgMetrics":
        return "Average Metrics";
      case "termsSumMetrics":
        return "Sum Metrics";
      case "bigramsTermsAvgMetrics":
        return "Bigrams Average Metrics";
      case "bigramsTermsSumMetrics":
        return "Bigrams Sum Metrics";
    }
  };

  //Level3
  const [selectedClass, setSelectedClass] = useState("happy");
  const [isUnigramOrBigram, setIsUnigramOrBigram] = useState("unigram");
  const [selectedMetric, setSelectedMetric] = useState("binary");

  const classes = ["happy", "unhappy"];
  const unigramOrBigram = ["unigram", "bigram"];
  const metrics = ["binary", "occurrences", "tf", "tfidf", "all"];

  const [level3data, setLevel3Data] = useState<any>(null);

  const fetchLevel3Data = async () => {
    const { data } = await api.get("/results");
    console.log("data", data);
    setLevel3Data(data);
  };

  useEffect(() => {
    tabValue === 0 && fetchLevel3Data();
  }, [tabValue]);

  const Lvl3 = () => {
    if (!level3data) {
      return <div></div>;
    }

    const uniOrBigram1 =
      isUnigramOrBigram === "bigram"
        ? "bigramsTermsAvgMetrics"
        : "termsAvgMetrics";

    const uniOrBigram2 =
      isUnigramOrBigram === "bigram"
        ? "bigramsTermsSumMetrics"
        : "termsSumMetrics";

    const rows1 =
      level3data?.[
        selectedClass === "happy" ? "happyResults" : "notHappyResults"
      ]?.[uniOrBigram1][selectedMetric === "all" ? "binary" : selectedMetric];

    const rows2 =
      level3data?.[
        selectedClass === "happy" ? "happyResults" : "notHappyResults"
      ]?.[uniOrBigram2][selectedMetric === "all" ? "binary" : selectedMetric];

    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Select
            label={"Class"}
            menuItems={classes}
            selected={selectedClass}
            setSelected={setSelectedClass}
          />
          <Select
            label={"Unigram or Bigram"}
            menuItems={unigramOrBigram}
            selected={isUnigramOrBigram}
            setSelected={setIsUnigramOrBigram}
          />
          <Select
            label={"Metric"}
            menuItems={metrics}
            selected={selectedMetric}
            setSelected={setSelectedMetric}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "100px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor={uniOrBigram1}>{labelTitle(uniOrBigram1)}</label>
            <Table
              id={uniOrBigram1}
              rows={rows1}
              selectedMetric={selectedMetric}
            />
            <div style={{ padding: "10px" }} />
            <label htmlFor={uniOrBigram2}>{labelTitle(uniOrBigram2)}</label>
            <Table
              id={uniOrBigram2}
              rows={rows2}
              selectedMetric={selectedMetric}
            />
          </div>
        </div>
      </div>
    );
  };

  //Level4
  const [level4data, setLevel4Data] = useState<any>(null);
  const [kValues, setKValues] = useState({ k1: 1, k2: 1 });

  const fetchLevel4Data = useCallback(
    async (values: { k1: number; k2: number }) => {
      const res = await api.get(`/processk?unik=${values.k1}&bik=${values.k2}`);

      const { data } = await api.get("/results");
      console.log("res", data);

      setLevel4Data(data);
    },
    [kValues]
  );

  useEffect(() => {
    console.log("tabValue", tabValue);
    if (tabValue === 1) {
      setSelectedMetric("tfidf");
      fetchLevel4Data(kValues);
    }
  }, [kValues, tabValue]);

  const Lvl4 = () => {
    const handleChangeKValues = (e: any) => {
      const id = e.target.id;
      const value = e.target.value;
      console.log("id,value", id, value);

      setKValues({ ...kValues, [id]: value });
    };

    const uniOrBigram1 =
      isUnigramOrBigram === "bigram"
        ? "bigramsTermsAvgMetrics"
        : "termsAvgMetrics";

    const uniOrBigram2 =
      isUnigramOrBigram === "bigram"
        ? "bigramsTermsSumMetrics"
        : "termsSumMetrics";

    const rows1 =
      level4data?.[
        selectedClass === "happy" ? "happyResults" : "notHappyResults"
      ]?.[uniOrBigram1][selectedMetric === "all" ? "binary" : selectedMetric];

    const rows2 =
      level4data?.[
        selectedClass === "happy" ? "happyResults" : "notHappyResults"
      ]?.[uniOrBigram2][selectedMetric === "all" ? "binary" : selectedMetric];

    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Select
            label={"Class"}
            menuItems={classes}
            selected={selectedClass}
            setSelected={setSelectedClass}
          />
          <Select
            label={"Unigram or Bigram"}
            menuItems={unigramOrBigram}
            selected={isUnigramOrBigram}
            setSelected={setIsUnigramOrBigram}
          />
          <Select
            label={"Metric"}
            menuItems={metrics}
            selected={selectedMetric}
            setSelected={setSelectedMetric}
            disabled={true}
          />

          <div>
            <label htmlFor="k1">K1</label>
            <input
              id="k1"
              type={"number"}
              value={kValues.k1}
              onChange={handleChangeKValues}
            />
            <label htmlFor="k2">K2</label>
            <input
              id="k2"
              type={"number"}
              value={kValues.k2}
              onChange={handleChangeKValues}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "100px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor={uniOrBigram1}>{labelTitle(uniOrBigram1)}</label>
            <Table
              id={uniOrBigram1}
              rows={rows1}
              selectedMetric={selectedMetric}
            />
            <div style={{ padding: "10px" }} />
            <label htmlFor={uniOrBigram2}>{labelTitle(uniOrBigram2)}</label>
            <Table
              id={uniOrBigram2}
              rows={rows2}
              selectedMetric={selectedMetric}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Tabs
      tabValue={tabValue}
      setTabValue={setTabValue}
      lvl3={<Lvl3 />}
      lvl4={<Lvl4 />}
    />
  );
};
export default Lab5;
