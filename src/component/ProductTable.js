import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  CircularProgress,
} from "@mui/material";
import Paper from "@mui/material/Paper";

const ProductTable = memo(
  ({
    productData,
    handleModalClose,
    setSearchTerm,
    hasMore,
    setCurrentPage,
    loading,
    handleProductSelect,
    setIsModalOpen,
  }) => {
    const [selectedItems, setSelectedItems] = useState({});
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const tableRef = useRef(null);

    console.log("Visibl", productData);

    useState(() => {
      if (productData && productData?.length > 0) {
        const initialSelectedItems = productData.reduce((acc, product) => {
          const variantsState = product.variants.reduce(
            (variantAcc, variant) => ({ ...variantAcc, [variant.id]: false }),
            {}
          );
          acc[product.id] = { selected: false, variants: variantsState };
          return acc;
        }, {});
        setSelectedItems(initialSelectedItems);
      }
    }, [productData]);

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

    // Debounce Scroll Handler
    const handleScrollDebounce = useRef(false);

    //function to perform scrolling
    const handleScroll = () => {
      if (loading || !hasMore || handleScrollDebounce.current) return;
      if (
        tableRef.current.scrollHeight - tableRef.current.scrollTop <=
        tableRef.current.clientHeight + 10
      ) {
        handleScrollDebounce.current = true;
        setIsFetching(true);
        setTimeout(() => {
          setCurrentPage((prev) => prev + 1);
          setIsFetching(false);
          handleScrollDebounce.current = false;
        }, 1000);
      }
    };

    useEffect(() => {
      const tableContainer = tableRef.current;
      if (tableContainer) {
        tableContainer.addEventListener("scroll", handleScroll);
      }
      return () => {
        if (tableContainer) {
          tableContainer.removeEventListener("scroll", handleScroll);
        }
      };
    }, [handleScroll]);

    const memoizedRows = useMemo(() => productData, [productData]);

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

    //function to add products
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
      setSelectedProducts(selectedList);
      handleProductSelect(selectedList);
      setIsModalOpen(false);
      setSearchTerm("");
    };

    return (
      <Box>
        <Box sx={{ maxHeight: "50vh", overflowY: "auto" }} ref={tableRef}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableBody>
                {memoizedRows.map((product) => (
                  <>
                    <TableRow>
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
                          <Typography variant="body1">
                            {product.title}
                          </Typography>
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
                                !!selectedItems[product.id]?.variants?.[
                                  variant.id
                                ]
                              }
                              onChange={() =>
                                handleVariantCheckboxChange(
                                  product.id,
                                  variant.id
                                )
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
                {(loading || isFetching) && ( // Show loader during debounce
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress style={{ color: "green" }} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            bottom: 0,
          }}
        >
          <Typography>
            {" "}
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
              onClick={() => handleAddProducts(selectedItems)}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Box>
    );
  },
  (prevProps, nextProp) => {
    return prevProps.productData === nextProp.productData;
  }
);

export default ProductTable;
