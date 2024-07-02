import { useState, useRef, useEffect } from "react";
import "./style.css";

const itemsData = [
   { id: 1, name: "Item 1" },
   { id: 2, name: "Item 2" },
   { id: 3, name: "Item 3" },
   // Add more items here
];

const App = () => {
   const [selectedItems, setSelectedItems] = useState([]);
   const [isSelecting, setIsSelecting] = useState(false);
   const [selectionBox, setSelectionBox] = useState(null);
   const containerRef = useRef(null);

   const handleItemClick = (id) => {
      setSelectedItems((prevSelectedItems) =>
         prevSelectedItems.includes(id)
            ? prevSelectedItems.filter((itemId) => itemId !== id)
            : [...prevSelectedItems, id]
      );
   };

   const handleStart = (clientX, clientY) => {
      const containerRect = containerRef.current.getBoundingClientRect();
      setSelectionBox({
         startX: clientX - containerRect.left,
         startY: clientY - containerRect.top,
         endX: clientX - containerRect.left,
         endY: clientY - containerRect.top,
      });
      setIsSelecting(true);
   };

   const handleMove = (clientX, clientY) => {
      if (!isSelecting) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      setSelectionBox((prev) => ({
         ...prev,
         endX: clientX - containerRect.left,
         endY: clientY - containerRect.top,
      }));
   };

   const handleEnd = () => {
      setIsSelecting(false);
      setSelectionBox(null);
      console.log(selectedItems);
   };

   const handleMouseDown = (e) => {
      if (e.target.classList.contains("item")) return;

      handleStart(e.clientX, e.clientY);
   };

   const handleMouseMove = (e) => {
      handleMove(e.clientX, e.clientY);
   };

   const handleMouseUp = () => {
      handleEnd();
   };

   const handleTouchStart = (e) => {
      if (e.target.classList.contains("item")) return;

      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
   };

   const handleTouchMove = (e) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
   };

   const handleTouchEnd = () => {
      handleEnd();
   };

   const isWithinSelectionBox = (box, itemRect) => {
      const { top, left, bottom, right } = itemRect;
      const { startX, startY, endX, endY } = box;
      const x1 = Math.min(startX, endX);
      const x2 = Math.max(startX, endX);
      const y1 = Math.min(startY, endY);
      const y2 = Math.max(startY, endY);

      return !(right < x1 || left > x2 || bottom < y1 || top > y2);
   };

   useEffect(() => {
      if (isSelecting && selectionBox) {
         const containerRect = containerRef.current.getBoundingClientRect();
         const selectedIds = itemsData
            .filter((item) => {
               const itemElem = document.getElementById(`item-${item.id}`);
               if (!itemElem) return false;

               const itemRect = itemElem.getBoundingClientRect();
               const relativeItemRect = {
                  top: itemRect.top - containerRect.top,
                  left: itemRect.left - containerRect.left,
                  bottom: itemRect.bottom - containerRect.top,
                  right: itemRect.right - containerRect.left,
               };

               return isWithinSelectionBox(selectionBox, relativeItemRect);
            })
            .map((item) => item.id);

         setSelectedItems(selectedIds);
      }
   }, [isSelecting, selectionBox]);

   return (
      <div
         className="container"
         ref={containerRef}
         onMouseDown={handleMouseDown}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onTouchStart={handleTouchStart}
         onTouchMove={handleTouchMove}
         onTouchEnd={handleTouchEnd}
      >
         {itemsData.map((item) => (
            <div
               key={item.id}
               id={`item-${item.id}`}
               seletected={selectedItems.includes(item.id)}
               onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleItemClick(item.id);
               }}
            >
               {item.name}
            </div>
         ))}
         {isSelecting && selectionBox && (
            <div
               className="selection-box"
               style={{
                  top: Math.min(selectionBox.startY, selectionBox.endY),
                  left: Math.min(selectionBox.startX, selectionBox.endX),
                  width: Math.abs(selectionBox.endX - selectionBox.startX),
                  height: Math.abs(selectionBox.endY - selectionBox.startY),
               }}
            />
         )}
      </div>
   );
};

export default App;
