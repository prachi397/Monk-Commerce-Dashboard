import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
  Typography,
  Avatar,
  Box,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import Paper from "@mui/material/Paper";

const ProductTable = ({
  productData,
  handleModalClose,
  searchTerm,
  handleProductSelect,
  setIsModalOpen,
}) => {
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);

  useState(() => {
    const initialSelectedItems = productData.reduce((acc, product) => {
      const variantsState = product.variants.reduce(
        (variantAcc, variant) => ({ ...variantAcc, [variant.id]: false }),
        {}
      );
      acc[product.id] = { selected: false, variants: variantsState };
      return acc;
    }, {});
    setSelectedItems(initialSelectedItems);
  });

  const filteredProducts = productData.filter((product) =>
    product.title.toLowerCase().includes(searchTerm)
  );

  const handleParentCheckboxChange = (productId, variants) => {
    if (selectedProductId && selectedProductId !== productId) {
      setOpenAlert(true);
      return;
    }
    setSelectedItems((prevSelected) => {
      const isParentSelected = prevSelected[productId]?.selected || false;
      const newVariantsState = variants.reduce(
        (acc, variant) => ({
          ...acc,
          [variant.id]: !isParentSelected,
        }),
        {}
      );
      setSelectedProductId(!isParentSelected ? productId : null);
      return {
        ...prevSelected,
        [productId]: {
          selected: !isParentSelected,
          variants: newVariantsState,
        },
      };
    });
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleVariantCheckboxChange = (productId, variantId) => {
    if (selectedProductId && selectedProductId !== productId) {
      setOpenAlert(true);
      return;
    }
    setSelectedItems((prevSelected) => {
      const isVariantSelected =
        prevSelected[productId]?.variants?.[variantId] || false;
      const updatedVariants = {
        ...prevSelected[productId]?.variants,
        [variantId]: !isVariantSelected,
      };

      const anyVariantSelected = Object.values(updatedVariants).some(
        (val) => val
      );
      setSelectedProductId(anyVariantSelected ? productId : null);
      return {
        ...prevSelected,
        [productId]: {
          selected: anyVariantSelected,
          variants: updatedVariants,
        },
      };
    });
  };

  const handleAddProducts = () => {
    const selectedList = productData
      .map((product) => {
        const selectedVariants = Object.entries(
          selectedItems[product.id]?.variants || {}
        )
          .filter(([_, isSelected]) => isSelected)
          .map(([variantId]) =>
            product.variants.find(
              (variant) => variant.id.toString() === variantId
            )
          );

        if (selectedVariants.length > 0) {
          return {
            productId: product.id,
            title: product.title,
            image: product.image,
            variants: selectedVariants,
          };
        }
        return null;
      })
      .filter((item) => item !== null);
    handleProductSelect(selectedList);
    setIsModalOpen(false);
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableBody>
            {filteredProducts.map((product) => (
              <>
                <TableRow key={`product-${product.id}`}>
                  <TableCell
                    rowSpan={product.variants.length + 1}
                    style={{ padding: "4px", height: "40px" }}
                  ></TableCell>
                  <TableCell
                    colSpan={3}
                    style={{ padding: "4px", height: "40px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Checkbox
                        checked={!!selectedItems[product.id]?.selected}
                        onChange={() =>
                          handleParentCheckboxChange(
                            product.id,
                            product.variants
                          )
                        }
                        sx={{
                          "&.Mui-checked": {
                            color: "green",
                          },
                        }}
                      />
                      <Avatar
                        src={product.image.src}
                        alt={product.title}
                        sx={{ marginRight: 2 }}
                      />
                      <Typography variant="body1">{product.title}</Typography>
                    </div>
                  </TableCell>
                </TableRow>
                {product.variants.map((variant) => (
                  <TableRow key={`variant-${variant.id}`}>
                    <TableCell
                      colSpan={3}
                      style={{ padding: "4px", height: "40px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "40px",
                        }}
                      >
                        <Checkbox
                          checked={
                            !!selectedItems[product.id]?.variants?.[variant.id]
                          }
                          onChange={() =>
                            handleVariantCheckboxChange(product.id, variant.id)
                          }
                          sx={{
                            "&.Mui-checked": {
                              color: "green",
                            },
                          }}
                        />
                        <Typography
                          variant="body2"
                          style={{ marginRight: "16px" }}
                        >
                          {variant.title}
                        </Typography>
                        <Typography variant="body2">
                          ${variant.price}
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography>
          {
            Object.keys(selectedItems).filter(
              (productId) =>
                selectedItems[productId]?.selected ||
                Object.values(selectedItems[productId]?.variants || {}).some(
                  (isSelected) => isSelected
                )
            ).length
          }{" "}
          Product Selected
        </Typography>
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button
            variant="outlined"
            color="black"
            sx={{ color: "black" }}
            onClick={handleModalClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ background: "#008060" }}
            onClick={handleAddProducts}
          >
            Add
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
              You can select only one product at a time.
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductTable;
