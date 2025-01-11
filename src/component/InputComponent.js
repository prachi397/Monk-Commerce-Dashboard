import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { Edit as EditIcon } from "@mui/icons-material";
import AddProductModal from "./AddProductModal";

const InputComponent = ({handleAddSelectedProducts}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

  function handleEditClick() {
    setIsModalOpen(true);
  }

  function handleModalClose(){
    setIsModalOpen(false);
  }

  return (
    <Box sx={{ width: { xs: "100%", sm: "85%" } }}>
      <TextField
        placeholder="Select Product"
        variant="outlined"
        size="small"
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
      <AddProductModal isModalOpen={isModalOpen} handleModalClose={handleModalClose} setIsModalOpen={setIsModalOpen} handleAddSelectedProducts={handleAddSelectedProducts}/>
    </Box>
  );
};
export default InputComponent;
