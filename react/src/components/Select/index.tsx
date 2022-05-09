import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { setegid } from "process";

export default function BasicSelect({
  label,
  menuItems,
  selected,
  setSelected,
  disabled = false,
}: {
  label: string;
  menuItems: string[];
  selected: string;
  setSelected: (arg: string) => void;
  disabled?: boolean;
}) {
  // const [selected, setSelected] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelected(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selected}
          label
          onChange={handleChange}
          disabled={disabled}
        >
          {menuItems.map((menuItem) => (
            <MenuItem value={menuItem.toLowerCase()}>{menuItem}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
