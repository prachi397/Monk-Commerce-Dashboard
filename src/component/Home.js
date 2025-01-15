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
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import InputComponent from "../component/InputComponent";
import { Close } from "@mui/icons-material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableRow from "./DraggableRow";
import DraggableVariant from "./DraggableVariant";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

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
const handleAddSelectedProducts = (rowIndex, products) => {
  setSelectedProducts((prevSelectedProducts) => {
    const updatedProducts = { ...prevSelectedProducts };
    products.forEach((product, idx) => {
      if (!updatedProducts[rowIndex + idx]) {
        updatedProducts[rowIndex + idx] = [];
      }
      updatedProducts[rowIndex + idx].push(product);
    });
    return updatedProducts;
  });
  setRows((prevRows) => {
    const newRows = [...prevRows];
    if (products.length > 1) {
      for (let i = 1; i < products.length; i++) {
        newRows.push(newRows.length + 1);
      }
    }
    return newRows;
  });
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
      if (!currentProduct || !Array.isArray(currentProduct))
        return updatedSelectedProducts;
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

  // Function to handle Add Discount button
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

  const moveRow = (fromIndex, toIndex) => {
    const updatedRows = [...rows];
    const [movedRow] = updatedRows.splice(fromIndex, 1);
    updatedRows.splice(toIndex, 0, movedRow);
    const updatedExpandedRows = { ...expandedRows };
    if (expandedRows[fromIndex]) {
      updatedExpandedRows[fromIndex] = false;
    } 
    setRows(updatedRows);
    setExpandedRows(updatedExpandedRows);  
    setSelectedProducts((prev) => {
      const reorderedProducts = {};
      updatedRows.forEach((row, idx) => {
        reorderedProducts[idx] = prev[row - 1];
      });
      return reorderedProducts;
    });
    setDiscounts((prev) => {
      const reorderedDiscounts = {};
      updatedRows.forEach((row, idx) => {
        reorderedDiscounts[idx] = prev[row - 1];
      });
      return reorderedDiscounts;
    });
  };  

  // Move variants within a row
  const moveVariant = (rowIndex, fromIndex, toIndex) => {
    const updatedProducts = { ...selectedProducts };
    const product = updatedProducts[rowIndex]?.[0];
    if (product && product.variants) {
      const updatedVariants = [...product.variants];
      const [movedVariant] = updatedVariants.splice(fromIndex, 1);
      updatedVariants.splice(toIndex, 0, movedVariant);
      updatedProducts[rowIndex][0].variants = updatedVariants;
      setSelectedProducts(updatedProducts);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
            width: { xs: "100%", sm: "80%", md: "70%" },
            marginTop: { xs: "10px", sm: "20px" },
          }}
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
                  <DraggableRow
                    key={idx}
                    id={row}
                    index={idx}
                    moveRow={moveRow}
                  >
                    <TableCell
                      sx={{
                        border: "none",
                        padding: { xs: "4px", sm: "8px 16px" },
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <DragIndicatorIcon
                        sx={{
                          cursor: "move",
                          color: "#888",
                        }}
                      />
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
                            width:{xs:"70px", sm:"200px"},
                            background: "#008060",
                            "&:hover": { background: "#006b4f" },
                            fontSize: { xs: "10px", sm: "14px" },
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
                            value={discounts[idx].discountValue||0}
                            onChange={(e) =>
                              handleDiscountChange(
                                idx,
                                "discountValue",
                                e.target.value
                              )
                            }
                            variant="outlined"
                            sx={{ width: "25%", marginRight: "8px" }}
                            type="number"
                            size="small"
                          />
                          <FormControl sx={{width:"22%"}}>
                            <Select
                              value={discounts[idx].discountType}
                              onChange={(e) =>
                                handleDiscountChange(
                                  idx,
                                  "discountType",
                                  e.target.value
                                )
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
                            {expandedRows[idx]
                              ? "Hide variants"
                              : "Show variants"}
                          </Button>
                        )}
                    </TableCell>
                  </DraggableRow>
                  {selectedProducts[idx] &&
                    Array.isArray(selectedProducts[idx]) &&
                    selectedProducts[idx].map((product, productIdx) => (
                      <React.Fragment key={productIdx}>
                        {expandedRows[idx] && product?.variants?.length > 0
                          ? product.variants.map((variant, variantIdx) => (
                              <DraggableVariant
                                key={variant.id}
                                id={variant.id}
                                variantIndex={variantIdx}
                                rowIndex={idx}
                                moveVariant={moveVariant}
                              >
                                <TableCell
                                  colSpan={2}
                                  sx={{ border: "none", padding: "0" }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginBottom: "8px",
                                      width: "500px",
                                    }}
                                  >
                                    <DragIndicatorIcon
                                      sx={{
                                        cursor: "move",
                                        color: "#888",
                                        marginLeft: "60px",
                                      }}
                                    />
                                    <TextField
                                      value={variant.title}
                                      variant="outlined"
                                      disabled
                                       size="small"
                                      sx={{
                                        width: {
                                          xs: "55%", 
                                          sm: "80%",  
                                        },
                                        marginRight: "30px",
                                      }}
                                      InputProps={{
                                        style: {
                                          borderRadius: "30px",
                                        },
                                      }}
                                    />
                                    <IconButton
                                      onClick={() =>
                                        handleRemoveVariant(idx, variant.id)
                                      }
                                      sx={{
                                        visibility: product.variants.length > 1 ? "visible" : "hidden", 
                                      }}
                                    >
                                      <Close />
                                    </IconButton>
                                  </Box>
                                </TableCell>
                              </DraggableVariant>
                            ))
                          : null}
                      </React.Fragment>
                    ))}
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="outlined"
          color="#008060"
          sx={{
            color:"#008060",
            marginTop: "20px",
            height: { xs: "40px", sm: "52px" },
            width: { xs: "150px", sm: "350px" },
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
          <Alert
            onClose={handleCloseAlert}
            severity="warning"
            sx={{ width: "100%" }}
          >
            Please select a product before adding a discount!
          </Alert>
        </Snackbar>
      </Box>
    </DndProvider>
  );
};

export default Home;
