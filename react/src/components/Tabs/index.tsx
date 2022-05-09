import * as React from "react";
//@ts-ignore
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

type Props = {
  lvl3: React.ReactNode;
  lvl4: React.ReactNode;
};

const Tabs: React.FC<Props> = (props) => {
  const { lvl3, lvl4 } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          //@ts-ignore
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Lvl3" {...a11yProps(0)} />
          <Tab label="Lvl4" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={0} index={0}>
        {lvl3}
      </TabPanel>
      <TabPanel value={1} index={1}>
        {lvl4}
      </TabPanel>
    </Box>
  );
};

export default Tabs;
