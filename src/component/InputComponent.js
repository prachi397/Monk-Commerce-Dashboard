import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { Edit as EditIcon } from "@mui/icons-material";
import AddProductModal from "./AddProductModal";

const InputComponent = ({
  handleAddSelectedProducts,
  selectedProduct,
  rowIndex,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleEditClick() {
    setIsModalOpen(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
  }

  function handleProductSelect(product) {
    handleAddSelectedProducts(rowIndex, product);
    setIsModalOpen(false);
  }

  return (
    <Box sx={{ width: { xs: "100%", sm: "85%" } }}>
      <TextField
        placeholder="Select Product"
        variant="outlined"
        size="small"
        value={selectedProduct && selectedProduct[0] ? selectedProduct[0]?.title : ""}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleEditClick} edge="end">
                <EditIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ width: "100%" }}
      />
      <AddProductModal
        isModalOpen={isModalOpen}
        handleModalClose={handleModalClose}
        setIsModalOpen={setIsModalOpen}
        handleProductSelect={handleProductSelect}
      />
    </Box>
  );
};
export default InputComponent;
