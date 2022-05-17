import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const BasicTable: React.FC<any> = ({ rows, selectedMetric }) => {
  console.log("metric", selectedMetric);
  const headetStyle = { fontWeight: "bold" };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          {selectedMetric === "all" ? (
            <TableRow>
              <TableCell style={headetStyle}>Name</TableCell>
              <TableCell style={headetStyle}>Ranking</TableCell>
              <TableCell style={headetStyle}>Binary</TableCell>
              <TableCell style={headetStyle}>Occurrences</TableCell>
              <TableCell style={headetStyle}>tf</TableCell>
              <TableCell style={headetStyle}>tfid</TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell style={headetStyle}>Name</TableCell>
              <TableCell style={headetStyle}>Ranking</TableCell>
              {selectedMetric === "binary" && (
                <TableCell style={headetStyle}>Binary</TableCell>
              )}
              {selectedMetric === "occurrences" && (
                <TableCell style={headetStyle}>Occurrences</TableCell>
              )}
              {selectedMetric === "tf" && (
                <TableCell style={headetStyle}>tf</TableCell>
              )}
              {selectedMetric === "tfidf" && (
                <TableCell style={headetStyle}>tfid</TableCell>
              )}
            </TableRow>
          )}
        </TableHead>
        <TableBody>
          {selectedMetric && selectedMetric === "all"
            ? Object.values(rows).map((row: any, index: number) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  {row.binary && (
                    <TableCell align="right">{row.binary}</TableCell>
                  )}
                  {row.occurrences && (
                    <TableCell align="right">{row.occurrences}</TableCell>
                  )}
                  {row.tf && <TableCell align="right">{row.tf}</TableCell>}
                  {row.tfidf && (
                    <TableCell align="right">{row.tfidf}</TableCell>
                  )}
                </TableRow>
              ))
            : Object.values(rows).map((row: any, index: number) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  {selectedMetric === "binary" && (
                    <TableCell align="left">{row.binary}</TableCell>
                  )}
                  {selectedMetric === "occurrences" && (
                    <TableCell align="left">{row.occurrences}</TableCell>
                  )}
                  {selectedMetric === "tf" && (
                    <TableCell align="left">{row.tf}</TableCell>
                  )}
                  {selectedMetric === "tfidf" && (
                    <TableCell align="left">{row.tfidf}</TableCell>
                  )}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;
