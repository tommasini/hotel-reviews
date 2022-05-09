import React, { useEffect, useState } from "react";
import Select from "../Select";
import Table from "../Table";
import Tabs from "../Tabs";
import api from "../../api";

type Props = {};

const Lab5: React.FC<Props> = () => {
  //Level3
  const [selectedClass, setSelectedClass] = useState("happy");
  const [isUnigramOrBigram, setIsUnigramOrBigram] = useState("unigram");
  const [selectedMetric, setSelectedMetric] = useState("binary");

  const classes = ["happy", "unhappy"];
  const unigramOrBigram = ["unigram", "bigram"];
  const metrics = ["binary", "occurrences", "tf", "tfidf", "all"];

  const [level3data, setLevel3Data] = useState<any>();

  const fetchLevel3Data = async () => {
    const { data } = await api.get("/results");
    console.log("data", data);
    setLevel3Data(data);
  };

  useEffect(() => {
    fetchLevel3Data();
  }, []);

  const Lvl3 = () => {
    if (!level3data) {
      return <div></div>;
    }

    const columns = Object.keys(
      level3data?.[
        selectedClass === "happy" ? "happyResults" : "notHappyResults"
      ]?.[
        isUnigramOrBigram === "bigram"
          ? "bigramsTermsAvgMetrics"
          : "termsAvgMetrics"
      ]
    );

    const rows =
      level3data?.[
        selectedClass === "happy" ? "happyResults" : "notHappyResults"
      ]?.[
        isUnigramOrBigram === "bigram"
          ? "bigramsTermsAvgMetrics"
          : "termsAvgMetrics"
      ][selectedMetric];

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
          <div>
            <Table columns={columns} rows={rows} />
          </div>
        </div>
      </div>
    );
  };

  return <Lvl3 />;
};
export default Lab5;
