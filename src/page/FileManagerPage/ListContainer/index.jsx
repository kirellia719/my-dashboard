import { useSelector } from "react-redux";
import FileItem from "../FileItem";
import { useState, useRef, useEffect } from "react";
import "./style.scss";

const ListContainer = () => {
   const [selectedItems, setSelectedItems] = useState([]);
   const [newSelectItems, setNewSelectItems] = useState([]);

   const [isSelecting, setIsSelecting] = useState(false);
   const [selectionBox, setSelectionBox] = useState(null);
   const [ctrlKeyPressed, setCtrlKeyPressed] = useState(false);

   const containerRef = useRef(null);

   let { files } = useSelector((state) => state.Files);
   const itemsData = files.map((file) => ({ ...file, id: file._id }));

   const handleStart = (clientX, clientY) => {
      const containerRect = containerRef.current.getBoundingClientRect();
      setSelectionBox({
         startX: clientX - containerRect.left,
         startY: clientY - containerRect.top,
         endX: clientX - containerRect.left,
         endY: clientY - containerRect.top,
      });
      setIsSelecting(true);
      if (ctrlKeyPressed) {
         setNewSelectItems([...selectedItems]);
      }
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
      if (ctrlKeyPressed) {
         setSelectedItems((prevSelectedItems) => {
            const newSelectedItems = new Set([...prevSelectedItems, ...newSelectItems]);
            return Array.from(newSelectedItems);
         });
      }
      setNewSelectItems([]);
      setSelectionBox(null);
   };

   const handleMouseDown = (e) => {
      if (e.target.closest(".FileItem")) {
         return;
      } else {
         setCtrlKeyPressed(e.ctrlKey);
         handleStart(e.clientX, e.clientY);
      }
   };

   const handleMouseMove = (e) => {
      handleMove(e.clientX, e.clientY);
   };

   const handleMouseUp = () => {
      handleEnd();
   };

   const handleTouchStart = (e) => {
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

         if (ctrlKeyPressed) {
            setNewSelectItems(selectedIds);
         } else {
            setSelectedItems(selectedIds);
         }
      }
   }, [isSelecting, selectionBox, ctrlKeyPressed]);

   useEffect(() => {
      const handleKeyDown = (e) => {
         if (e.key === "Control") setCtrlKeyPressed(true);
      };

      const handleKeyUp = (e) => {
         if (e.key === "Control") setCtrlKeyPressed(false);
      };

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
      document.addEventListener("mouseup", handleEnd);

      return () => {
         document.removeEventListener("keydown", handleKeyDown);
         document.removeEventListener("keyup", handleKeyUp);
         document.removeEventListener("mouseup", handleEnd);
      };
   }, []);

   const handleCtrlClick = (itemId) => {
      setSelectedItems((prevSelectedItems) => {
         if (prevSelectedItems.includes(itemId)) {
            return prevSelectedItems.filter((id) => id !== itemId);
         } else {
            return [...prevSelectedItems, itemId];
         }
      });
   };

   const handleItemClick = (id) => {
      setSelectedItems((prevSelectedItems) => {
         if (prevSelectedItems.length == 1 && prevSelectedItems.includes(id)) {
            return [];
         } else {
            return [id];
         }
      });
   };

   return (
      <>
         <button onClick={() => console.log(selectedItems)}>{ctrlKeyPressed ? "Ctr" : "not"}</button>
         <div
            className="list-container"
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
         >
            <div className="list-item">
               {itemsData.map((item) => (
                  <FileItem
                     {...item}
                     key={item.id}
                     id={`item-${item.id}`}
                     selected={selectedItems.includes(item.id) || newSelectItems.includes(item.id)}
                     onClick={(e) => {
                        if (e.ctrlKey) {
                           handleCtrlClick(item.id);
                        } else {
                           handleItemClick(item.id);
                        }
                     }}
                  />
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
         </div>
      </>
   );
};

export default ListContainer;
