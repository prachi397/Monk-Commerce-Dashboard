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
  TextField,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import InputComponent from "../component/InputComponent";
import { Close } from "@mui/icons-material"; // Importing Material UI Close icon

const Home = () => {
  const [rows, setRows] = useState([1]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [expandedRows, setExpandedRows] = useState({});

  const handleAddRow = () => {
    setRows([...rows, rows.length + 1]);
  };

  // Function to handle adding products to the selected products list for a specific row
  const handleAddSelectedProducts = (rowIndex, product) => {
    setSelectedProducts((prevSelectedProducts) => ({
      ...prevSelectedProducts,
      [rowIndex]: product,
    }));
  };

  // Function to toggle visibility of variants for a particular row
  const handleToggleVariants = (rowIndex) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [rowIndex]: !prevExpandedRows[rowIndex],
    }));
  };

  // Function to handle removing a variant
  const handleRemoveVariant = (rowIndex, variantIndex) => {
    const updatedProducts = selectedProducts[rowIndex].filter(
      (product, index) => index !== variantIndex
    );
    setSelectedProducts((prevSelectedProducts) => ({
      ...prevSelectedProducts,
      [rowIndex]: updatedProducts,
    }));
  };

  console.log(selectedProducts);
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
        sx={{ boxShadow: "none", width: { xs: "100%", sm: "80%", md: "60%" } }}
      >
        <Table sx={{ borderCollapse: "collapse", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "none", fontWeight: "bold" }}>
                Product
              </TableCell>
              <TableCell sx={{ border: "none", fontWeight: "bold" }}>
                Discount
              </TableCell>
            </TableRow>
          </TableHead>
          {/* Table Body */}
          <TableBody>
            {rows.map((row, idx) => (
              <>
                <TableRow key={idx} sx={{ border: "none" }}>
                  <TableCell
                    sx={{
                      border: "none",
                      padding: { xs: "4px", sm: "8px 16px" },
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <strong>{idx + 1}. </strong>
                    <InputComponent
                      handleAddSelectedProducts={handleAddSelectedProducts}
                      selectedProduct={selectedProducts[idx]}
                      rowIndex={idx}
                    />
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
                    {/* Show/Hide Variants Button */}
                    {selectedProducts[idx] &&
                      Array.isArray(selectedProducts[idx]) && (
                        <Button
                          sx={{
                            border: "none",
                            textDecoration: "underline",
                            display: "block",
                            marginTop: "8px",
                          }}
                          onClick={() => handleToggleVariants(idx)}
                        >
                          {expandedRows[idx]
                            ? "Hide variants"
                            : "Show variants"}
                        </Button>
                      )}
                  </TableCell>
                </TableRow>
                {selectedProducts[idx] &&
                  Array.isArray(selectedProducts[idx]) &&
                  selectedProducts[idx].map((product, productIdx) => (
                    <TableRow key={productIdx} sx={{ border: "none" }}>
                      <TableCell colSpan={2} sx={{ border: "none", padding:"0" }}>
                        {expandedRows[idx] && product?.variants?.length > 0 ? (
                          <div>
                            <ul>
                              {product.variants.map((variant, variantIdx) => (
                                <li
                                  key={variantIdx}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "8px",
                                  }}
                                >
                                  <TextField
                                    value={variant.title}
                                    variant="outlined"
                                    disabled
                                    sx={{
                                      width: "80%",
                                      marginRight: "8px",
                                    }}       
                                    InputProps={{
                                      style: {
                                        borderRadius: "30px", 
                                  
                                      },
                                    }}
                                  />
                                  <IconButton
                                  >
                                    <Close /> 
                                  </IconButton>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="outlined"
        color= "#008060"
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
