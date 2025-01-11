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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import InputComponent from "../component/InputComponent";
import { Close } from "@mui/icons-material"; 

const Home = () => {
  const [rows, setRows] = useState([1]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [discounts, setDiscounts] = useState({});
  const [openAlert, setOpenAlert] = useState(false); 

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
  const handleRemoveVariant = (rowIndex, variantId) => {
    setSelectedProducts((prevSelectedProducts) => {
      const updatedSelectedProducts = { ...prevSelectedProducts };
      const currentProduct = updatedSelectedProducts[rowIndex];
  
      if (!currentProduct || !Array.isArray(currentProduct)) return updatedSelectedProducts;
  
      const updatedVariants = currentProduct[0]?.variants.filter(
        (variant) => variant.id !== variantId
      );
  
      if (updatedVariants.length === 0) {
        delete updatedSelectedProducts[rowIndex];
        setDiscounts((prevDiscounts) => {
          const updatedDiscounts = { ...prevDiscounts };
          delete updatedDiscounts[rowIndex];
          return updatedDiscounts;
        });
      } else {
        updatedSelectedProducts[rowIndex][0].variants = updatedVariants;
      }
  
      return updatedSelectedProducts;
    });
  };

  // Handle discount value and type change
  const handleDiscountChange = (rowIndex, field, value) => {
    setDiscounts((prevDiscounts) => ({
      ...prevDiscounts,
      [rowIndex]: {
        ...prevDiscounts[rowIndex],
        [field]: value,
      },
    }));
  };

  // Function to handle "Add Discount" click
  const handleAddDiscount = (rowIndex) => {
    if (!selectedProducts[rowIndex] || !selectedProducts[rowIndex].length) {
      setOpenAlert(true);
      return;
    }
    setDiscounts((prev) => ({
      ...prev,
      [rowIndex]: { discountValue: "", discountType: "%" },
    }));
  };

  const handleCloseAlert = () => {
    setOpenAlert(false); 
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
        sx={{ boxShadow: "none", width: { xs: "100%", sm: "80%", md: "70%" } }}
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
                    {/* show "Add Discount" button */}
                    {!discounts[idx] ? (
                      <Button
                        variant="contained"
                        sx={{
                          background: "#008060",
                          "&:hover": { background: "#006b4f" },
                          fontSize: { xs: "12px", sm: "14px" },
                          padding: { xs: "6px 12px", sm: "8px 16px" },
                        }}
                        onClick={() => handleAddDiscount(idx)}
                      >
                        Add Discount
                      </Button>
                    ) : (
                      // Show input fields for discount value and discount type
                      <>
                        <TextField
                          value={discounts[idx].discountValue}
                          onChange={(e) =>
                            handleDiscountChange(idx, "discountValue", e.target.value)
                          }
                          variant="outlined"
                          sx={{ width: "20%", marginRight: "8px" }}
                          type="number"
                          size="small"
                        />
                        <FormControl sx={{ width: "20%" }}>
                          <InputLabel>Discount Type</InputLabel>
                          <Select
                            value={discounts[idx].discountType}
                            onChange={(e) =>
                              handleDiscountChange(idx, "discountType", e.target.value)
                            }
                            size="small"
                          >
                            <MenuItem value="%">% Off</MenuItem>
                            <MenuItem value="flat">Flat Off</MenuItem>
                          </Select>
                        </FormControl>
                      </>
                    )}
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
                          {expandedRows[idx] ? "Hide variants" : "Show variants"}
                        </Button>
                      )}
                  </TableCell>
                </TableRow>
                {selectedProducts[idx] &&
                  Array.isArray(selectedProducts[idx]) &&
                  selectedProducts[idx].map((product, productIdx) => (
                    <TableRow key={productIdx} sx={{ border: "none" }}>
                      <TableCell colSpan={2} sx={{ border: "none", padding: "0" }}>
                        {expandedRows[idx] && product?.variants?.length > 0 ? (
                          <div>
                            <ul>
                              {product.variants.map((variant) => (
                                <li
                                  key={variant.id}
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
                                    onClick={() => handleRemoveVariant(idx, variant.id)}
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
        color="primary"
        sx={{
          marginTop: "20px",
          height: { xs: "40px", sm: "52px" },
          width: { xs: "150px", sm: "200px" },
          fontSize: { xs: "12px", sm: "14px" },
        }}
        onClick={handleAddRow}
      >
        Add Product
      </Button>

      {/* Snackbar Alert */}
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity="warning" sx={{ width: "100%" }}>
          Please select a product before adding a discount!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
