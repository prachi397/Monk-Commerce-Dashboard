import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ProductTable from "./ProductTable";
import { productData } from "./sampleData";

const AddProductModal = ({
  isModalOpen,
  handleModalClose,
  setIsModalOpen,
  handleAddSelectedProducts,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };
  return (
    <Modal
      open={isModalOpen}
      onClose={handleModalClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "900px",
          maxHeight: "80vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          overflow: "auto",
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" id="simple-modal-title">
            Select Products
          </Typography>
          <IconButton onClick={handleModalClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            placeholder="Search Product"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <ProductTable
          productData={productData}
          handleCancel={handleModalClose}
          searchTerm={searchTerm}
          setIsModalOpen={setIsModalOpen}
          handleAddSelectedProducts={handleAddSelectedProducts}
        />
      </Box>
    </Modal>
  );
};

export default AddProductModal;
