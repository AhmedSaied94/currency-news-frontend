import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { Sparklines, SparklinesSpots, SparklinesLine } from "react-sparklines";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const rows = [
  { addtofav: 1, id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { addtofav: 1, id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { addtofav: 1, id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { addtofav: 1, id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  {
    addtofav: 1,
    id: 5,
    lastName: "Targaryen",
    firstName: "Daenerys",
    age: null,
  },
  { addtofav: 1, id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { addtofav: 1, id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { addtofav: 1, id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { addtofav: 1, id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const MainTable = () => {
  const [fav, setFav] = React.useState(false);
  const columns = [
    {
      field: "addtofav",
      width: 30,
      headerName: "",
      align: "center",
      renderCell: (id) => {
        return (
          <IconButton onClick={() => setFav(!fav)}>
            {fav ? (
              <FavoriteIcon color="warning" />
            ) : (
              <FavoriteBorderIcon color="warning" />
            )}
          </IconButton>
        );
      },
    },
    {
      field: "#",
      headerName: "#",
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "coin",
      headerName: "Coin",
      width: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "sympol",
      headerName: "Sympol",
      width: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      width: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "24h",
      headerName: "24h",
      type: "number",
      width: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "7d",
      headerName: "7d",
      type: "number",
      width: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "24h Best",
      headerName: "24h Best",
      type: "number",
      width: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "7d Best",
      headerName: "7d Best",
      type: "number",
      width: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "last7graph",
      headerName: "Last 7 Graph",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      align: "center",
      headerAlign: "center",
      width: 160,
      color: "#000",
      renderCell: (values) => {
        console.log(values);
        return (
          <Sparklines
            style={{ width: "100%", height: "100%", padding: "5px" }}
            data={values.value ? values.value : [1, 1]}
          >
            <SparklinesLine style={{ strokeWidth: 3 }} color="green" />
            <SparklinesSpots
              size={2}
              style={{ strokeWidth: 3, stroke: "green", fill: "white" }}
            />
          </Sparklines>
        );
      },
    },
  ];
  const num = [
    "USD",
    "EUR",
    "AED",
    "SAR",
    "KJH",
    "ODN",
    "LKM",
    "FDN",
    "YGN",
    "CAD",
    "EGP",
    "RFM",
  ];
  return (
    <div
      style={{
        margin: "1rem ",
        height: 600,
      }}
    >
      <div></div>
      <Stack sx={{ m: 2, mt: 5, flexWrap: "wrap" }} direction="row" spacing={1}>
        {num.map((n) => {
          return (
            <Chip
              // sx={{ mt: "0.5rem !important" }}
              clickable
              avatar={<Avatar alt="Natacha" src="https://picsum.photos/200" />}
              label={n}
              variant="outlined"
            />
          );
        })}
        <Chip clickable icon={<AddCircleRoundedIcon />} variant="outlined" />
      </Stack>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        sx={{
          borderRadius: 0,
          borderRight: 0,
          borderLeft: 0,
        }}
      />
    </div>
  );
};

export default MainTable;
