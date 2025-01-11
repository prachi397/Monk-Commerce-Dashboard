import React from "react";
import { useDrag, useDrop } from "react-dnd";

const DraggableRow = ({ id, index, moveRow, children }) => {
  const [, ref] = useDrag({
    type: "row",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "row",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <tr ref={(node) => drop(ref(node))}>
      {children}
    </tr>
  );
};

export default DraggableRow;
