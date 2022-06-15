import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import theme from "../styles/Theme";
import { useTheme } from "@emotion/react";
import { FiLogIn } from "react-icons/fi";
import { connect } from "react-redux";
import Store from "../Store";
import { authInfo } from "../slices/Constants";
import { Link } from "react-router-dom";

const pages = ["currencies", "calculator", "watchlist"];
const settings = ["settings", "watchlist", "logout"];
const bases = ["USD", "EUR", "UAD", "SAR"];

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  paddingTop: "2px",
  paddingBottom: "2px",
  backgroundColor: theme.palette.grey.light,
  "&:hover": {
    backgroundColor: theme.palette.grey.main,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.8em",
  "& .MuiSvgIcon-root": { color: theme.palette.grey.dark },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    color: theme.palette.grey.dark,
    fontWeight: 700,
    fontSize: "0.8em",
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Navbar = (props) => {
  const [anchorElNav, setAnchorElNav] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElCurrency, setAnchorElCurrency] = React.useState(null);
  const [userMenu, setUserMenu] = React.useState(false);
  const [currencyMenu, setCurrencyMenu] = React.useState(false);
  const { palette } = useTheme(theme);
  const handleOpenNavMenu = () => {
    setAnchorElNav(!anchorElNav);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenMenus = (menu) => {
    menu === "user" ? setUserMenu(!userMenu) : setCurrencyMenu(!currencyMenu);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <React.Fragment>
      <AppBar
        sx={{
          backgroundColor: "#fff",
          border: `1px solid ${palette.grey.main}`,
          borderRight: "none",
          borderLeft: "nonde",
          boxShadow: "none",
          py: 1.5,
          color: palette.black.main,
          "& .MuiButton-root": {
            color: palette.black.main,
            textTransform: "capitalize",
            fontSize: "0.95em",
            fontWeight: 700,
            "&:hover": {
              color: palette.sky.dark,
              background: "inherit",
            },
          },
          "& .MuiTypography-root": {
            color: palette.black.main,
          },
          "& .MuiInputBase-input": {
            color: palette.black.main,
          },
          "& .MuiSvgIcon-root": {
            color: palette.black.main,
          },
          "& .MuiIconButton-root": {
            "&:hover": {
              backgroundColor: palette.sky.main,
            },
          },
          "& .MuiToolbar-root": {
            minHeight: "auto",
          },
          "& .MuiAvatar-root": {
            width: 30,
            height: 30,
          },
          "& .signup": {
            color: "#fff",
            py: 1,
            px: 2,
            fontSize: "0.8em",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#1976d2",
              color: "#fff",
            },
          },
          "& .login": {
            fontSize: "0.8em",
          },
        }}
        position="static"
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Link style={{ textDecoration: "none" }} to="/">
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".2rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Srrafa
              </Typography>
            </Link>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              {/* <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
              <MenuItem>
                <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
                  <Tooltip title="Open settings">
                    <Typography onClick={handleOpenUserMenu} textAlign="center">
                      Accounnt
                    </Typography>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </MenuItem>
            </Menu> */}
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".2rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Srrafa.com
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Link
                  key={page}
                  style={{ textDecoration: "none" }}
                  to={`/${page}`}
                >
                  <Button
                    // onClick={handleCloseNavMenu}
                    sx={{
                      m: 1,
                      my: 0,
                      py: 0,
                      color: "white",
                      display: "block",
                    }}
                  >
                    {page}
                  </Button>
                </Link>
              ))}
            </Box>
            {props.authedUser !== null ? (
              <Box
                sx={{
                  flexGrow: 0,
                  display: { xs: "none", md: "flex" },
                }}
              >
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 1 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src={
                        props.authedUser.profile_pic
                          ? `${props.host}${props.authedUser.profile_pic}`
                          : ""
                      }
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{
                    mt: "45px",
                    display: { xs: "none", md: "flex" },
                    "& a": {
                      color: "inherit",
                      textDecoration: "none",
                      "&:hover": {
                        color: "inherit",
                        textDecoration: "none",
                      },
                    },
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <Link key={setting} to={`/${setting}`}>
                      <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    </Link>
                  ))}
                </Menu>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 0 }}>
                <Button
                  className="login"
                  onClick={() =>
                    Store.dispatch(authInfo({ com: "login", state: "open" }))
                  }
                >
                  Log in
                </Button>
                <Button
                  className="signup"
                  onClick={() =>
                    Store.dispatch(authInfo({ com: "signup", state: "open" }))
                  }
                  sx={{ py: 0 }}
                  color="primary"
                  variant="contained"
                >
                  Sign up
                </Button>
              </Box>
            )}
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <Box
              sx={{ ml: 1, flexGrow: 0, display: { xs: "none", md: "flex" } }}
            >
              <Tooltip title="Select Base Currency">
                <IconButton
                  onClick={() =>
                    Store.dispatch(
                      authInfo({ com: "changeCur", state: "open" })
                    )
                  }
                  sx={{ p: 1 }}
                >
                  <Avatar
                    alt="Currency"
                    src={
                      props.authedUser
                        ? `https://countryflagsapi.com/svg/${props.authedUser.home_currency
                            .substring(0, 2)
                            .toLowerCase()}`
                        : `https://countryflagsapi.com/svg/${props.geoData.currency
                            .substring(0, 2)
                            .toLowerCase()}`
                    }
                  />
                </IconButton>
              </Tooltip>
              {/* <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElCurrency}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElCurrency)}
                onClose={handleCloseCurrencyMenu}
              >
                {bases.map((base) => (
                  <MenuItem key={base} onClick={handleCloseCurrencyMenu}>
                    <Typography textAlign="center">{base}</Typography>
                  </MenuItem>
                ))}
              </Menu> */}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Collapse
        sx={{ display: { xs: "flex", md: "none" } }}
        in={anchorElNav}
        timeout="auto"
        unmountOnExit
      >
        <List
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: "background.paper",
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Nested List Items
            </ListSubheader>
          }
        >
          <ListItemButton onClick={() => handleOpenMenus("base")}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Base Currency" />
            {currencyMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={currencyMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {bases.map((base, ind) => {
                return (
                  <ListItemButton key={ind} sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary={base} />
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse>
          {pages.map((page, ind) => {
            return (
              <ListItemButton key={ind}>
                <ListItemIcon>
                  <SendIcon />
                </ListItemIcon>
                <ListItemText primary={page} />
              </ListItemButton>
            );
          })}

          <ListItemButton onClick={() => handleOpenMenus("user")}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Account" />
            {userMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={userMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {settings.map((setting, ind) => {
                return (
                  <ListItemButton key={ind} sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary={setting} />
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse>
        </List>
      </Collapse>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { authedUser } = state.user;
  const { geoData } = state.constants;
  console.log(authedUser);
  const { host } = state.constants;
  return { authedUser, host, geoData };
};

export default connect(mapStateToProps, { authInfo })(Navbar);
