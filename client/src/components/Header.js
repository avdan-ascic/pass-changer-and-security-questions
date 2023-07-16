import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: "space-between" }}>
        <Typography variant="h6" color="inherit">
          Password Changer and Security Questions
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
