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
} from "@mui/material";
import Paper from "@mui/material/Paper";

const ProductTable = ({ productData }) => {
  const [selectedItems, setSelectedItems] = useState({});

  useState(() => {
    const initialSelectedItems = productData.reduce((acc, product) => {
      const variantsState = product.variants.reduce(
        (variantAcc, variant) => ({ ...variantAcc, [variant.id]: false }),
        {}
      );
      acc[product.id] = { selected: false, variants: variantsState };
      return acc;
    }, {});
    return initialSelectedItems;
  });

  const handleParentCheckboxChange = (productId, variants) => {
    setSelectedItems((prevSelected) => {
      const isParentSelected = prevSelected[productId]?.selected || false;
      const newVariantsState = variants.reduce(
        (acc, variant) => ({
          ...acc,
          [variant.id]: !isParentSelected,
        }),
        {}
      );
      return {
        ...prevSelected,
        [productId]: {
          selected: !isParentSelected,
          variants: newVariantsState,
        },
      };
    });
  };

  const handleVariantCheckboxChange = (productId, variantId) => {
    setSelectedItems((prevSelected) => {
      const isVariantSelected =
        prevSelected[productId]?.variants?.[variantId] || false;
      const updatedVariants = {
        ...prevSelected[productId]?.variants,
        [variantId]: !isVariantSelected,
      };

      const allVariantsSelected = Object.values(updatedVariants).every(
        (val) => val
      );

      return {
        ...prevSelected,
        [productId]: {
          selected: allVariantsSelected,
          variants: updatedVariants,
        },
      };
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableBody>
          {productData.map((product) => (
            <React.Fragment key={product.id}>
              <TableRow>
                <TableCell
                  rowSpan={product.variants.length + 1}
                  style={{ padding: "4px", height: "40px" }}
                ></TableCell>
                <TableCell colSpan={3} style={{ padding: "4px", height: "40px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                      checked={!!selectedItems[product.id]?.selected}
                      onChange={() =>
                        handleParentCheckboxChange(product.id, product.variants)
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
                <TableRow key={variant.id}>
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
                            color: "green", // Checked state color
                          },
                        }}
                      />
                      <Typography
                        variant="body2"
                        style={{ marginRight: "16px" }}
                      >
                        {variant.title}
                      </Typography>
                      <Typography variant="body2">${variant.price}</Typography>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
