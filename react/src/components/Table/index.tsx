import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

interface Column {
  id: "id" | "description" | "browser" | "device" | "label";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "id", label: "ID", minWidth: 170 },
  { id: "description", label: "Description", minWidth: 100 },
  {
    id: "browser",
    label: "Browser",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "device",
    label: "Device",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "label",
    label: "Label",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toFixed(2),
  },
];

interface Data {
  id: number;
  description: string;
  browser: string;
  device: string;
  label: string;
}

function createData(
  id: number,
  description: string,
  browser: string,
  device: string,
  label: string
): Data {
  return { id, description, browser, device, label };
}

const rows = [
  {
    id: 10329,
    description:
      "Stayed here with husband and sons on the way to an Alaska Cruise. We all loved the hotel, great experience. Ask for a room on the North tower, facing north west for the best views. We had a high floor, with a stunning view of the needle, the city, and even the cruise ships! We ordered room service for dinner so we could enjoy the perfect views. Room service dinners were delicious, too! You are in a perfect spot to walk everywhere, so enjoy the city. Almost forgot- Heavenly beds were heavenly, too!",
    browser: "InternetExplorer",
    device: "Desktop",
    label: "happy",
  },
  {
    id: 10331,
    description:
      "We had - rooms. One was very nice and clearly had been updated more recently than the other. The other was clean and the bed was comfy but it needed some updating (carpet was old and wrinkled for example). Great location for visiting Inner Harbor, getting to Fells Point, Orioles games etc. SuperShuttle from BWI worked great both ways. TV remotes in both rooms were terrible but we didn't watch much TV so not a big deal. Wireless was sketchy on --th and --th floors but again, didn't need it much - we were on vacation so it didn't really matter. Breakfast was good each morning. Would stay again if in town.",
    browser: "InternetExplorer",
    device: "Desktop",
    label: "happy",
  },
];

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column: Column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
