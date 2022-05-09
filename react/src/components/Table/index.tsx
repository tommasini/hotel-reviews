import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const BasicTable: React.FC<any> = ({ columns, rows }) => {
  console.log("rows", rows);
  console.log("columns", columns);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column: any, index: number) => {
              <TableCell align="right" key={index}>
                {console.log("column" + index, typeof column)}
                {column}
              </TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(rows).map((row: any, index: number) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              {row.binary && <TableCell align="right">{row.binary}</TableCell>}
              {row.occurrences && (
                <TableCell align="right">{row.occurrences}</TableCell>
              )}
              {row.tf && <TableCell align="right">{row.tf}</TableCell>}
              {row.tfidf && <TableCell align="right">{row.tfidf}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;
