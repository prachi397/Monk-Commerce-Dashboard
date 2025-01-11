import { Box } from "@mui/material";
import React from "react";
import { useDrag, useDrop } from "react-dnd";

const DraggableVariant = ({ id, variantIndex, rowIndex, moveVariant, children }) => {
  const [, ref] = useDrag({
    type: "variant",
    item: { rowIndex, variantIndex },
  });

  const [, drop] = useDrop({
    accept: "variant",
    hover: (draggedItem) => {
      if (draggedItem.variantIndex !== variantIndex) {
        moveVariant(rowIndex, draggedItem.variantIndex, variantIndex);
        draggedItem.variantIndex = variantIndex;
      }
    },
  });

  return (
    <Box ref={(node) => drop(ref(node))} sx={{ display: "flex", alignItems: "center" }}>
      {children}
    </Box>
  );
};

export default DraggableVariant;
