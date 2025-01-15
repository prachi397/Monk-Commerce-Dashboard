import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ProductTable from "./ProductTable";
import axios from "axios";
// import { productData } from "./sampleData";

const AddProductModal = ({
  isModalOpen,
  handleModalClose,
  setIsModalOpen,
  handleProductSelect,
  searchTerm,
  setSearchTerm,
}) => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); 

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (isModalOpen) {
      fetchProductData(searchTerm, currentPage, limit);
    }
    else {
      setProductData([]);
      setCurrentPage(1);
      setHasMore(true);
      setSearchTerm("");
    }
  }, [searchTerm, isModalOpen, currentPage]);


  //function to fetch the product data
  async function fetchProductData(search = "", page, limit) {
    const url = "https://stageapi.monkcommerce.app/task/products/search";
    const apiKey = "72njgfa948d9aS7gs5";
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(url, {
        params: { search, page, limit },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      });
      // setProductData((prevData) => [...prevData, ...response.data]);
      if (response.data.length === 0) {
        setHasMore(false); // No more data to load
      } else {
        setProductData((prevData) => [...prevData, ...response.data]);
      }
    } catch (err) {
      console.error("Error fetching data:", err.message);
    } finally {
      setLoading(false);
    }
  }
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1);  
    setProductData([]);
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
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <CircularProgress style={{ color: "green" }} />
          </Box>
        ) : (
          <ProductTable
            productData={productData}
            handleModalClose={handleModalClose}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setIsModalOpen={setIsModalOpen}
            handleProductSelect={handleProductSelect}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            hasMore = {hasMore}
            loading={loading}
          />
        )}
      </Box>
    </Modal>
  );
};

export default AddProductModal;
