import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import InputComponent from "./InputComponent";

const Home = () => {
  const [rows, setRows] = useState([1]);

  const handleAddRow = () => {
    setRows([...rows, rows.length + 1]);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Add Products
      </Typography>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          boxShadow: "none",
          width: { xs: "100%", sm: "80%", md: "60%" },
        }}
      >
        <Table sx={{ borderCollapse: "collapse", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  border: "none",
                  fontWeight: "bold",
                }}
              >
                Product
              </TableCell>
              <TableCell
                sx={{
                  border: "none",
                  fontWeight: "bold",
                }}
              >
                Discount
              </TableCell>
            </TableRow>
          </TableHead>
          {/* Table Body */}
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell
                  sx={{
                    border: "none",
                    padding: { xs: "4px", sm: "8px 16px" },
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <strong>{idx + 1}. </strong> <InputComponent />
                </TableCell>
                <TableCell
                  sx={{
                    border: "none",
                    padding: { xs: "4px", sm: "8px 16px" },
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      background: "#008060",
                      "&:hover": { background: "#006b4f" },
                      fontSize: { xs: "12px", sm: "14px" },
                      padding: { xs: "6px 12px", sm: "8px 16px" },
                    }}
                  >
                    Add Discount
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="outlined"
        sx={{
          color: "#008060",
          marginTop: "20px",
          height: { xs: "40px", sm: "52px" },
          width: { xs: "150px", sm: "200px" },
          fontSize: { xs: "12px", sm: "14px" },
        }}
        onClick={handleAddRow}
      >
        Add Product
      </Button>
    </Box>
  );
};
export default Home;
