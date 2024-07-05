import "./style.scss";

import api from "api";

import { useDispatch, useSelector } from "react-redux";
import FileItem from "../FileItem";
import { useState, useRef, useEffect } from "react";
import { Button, ButtonGroup, Dropdown, Input, List, Modal, Notification, Panel, Popover } from "rsuite";
import { toast } from "react-toastify";
import { DeleteFileAction } from "../../../redux/FileManagerReducer";
import ModalRename from "./ModalRename";

const defaultContextMenu = { visible: false, x: 0, y: 0, itemId: null };

const ListContainer = () => {
   const [selectedItems, setSelectedItems] = useState([]);
   const [newSelectItems, setNewSelectItems] = useState([]);

   const [isSelecting, setIsSelecting] = useState(false);
   const [selectionBox, setSelectionBox] = useState(null);
   const [ctrlKeyPressed, setCtrlKeyPressed] = useState(false);

   const [contextMenu, setContextMenu] = useState(defaultContextMenu);
   const [modalDelete, setModalDelete] = useState(false);
   const [modalRename, setModalRename] = useState(false);

   const [sortContextMenu, setSortContextMenu] = useState(defaultContextMenu);

   const containerRef = useRef(null);
   const dispatch = useDispatch();

   let { files } = useSelector((state) => state.Files);
   const itemsData = files
      .map((file) => ({ ...file, id: file._id }))
      .sort((a, b) => {
         if (a.type === "folder" && b.type !== "folder") {
            return -1;
         } else if (a.type !== "folder" && b.type === "folder") {
            return 1;
         } else {
            return a.name.localeCompare(b.name);
         }
      });

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
      if (!e.target.closest(".btn-context")) {
         setContextMenu(defaultContextMenu);
      }
      if (e.button !== 0 || e.target.closest(".FileItem") || contextMenu.visible || modalDelete || modalRename) {
         return;
      } else {
         setCtrlKeyPressed(e.ctrlKey);
         handleStart(e.clientX, e.clientY);
      }
   };

   const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);

   const handleMouseUp = () => handleEnd();

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

   const deleteFile = async (file) => {
      const toastId = toast.loading(`Đang xóa ${file.name}...`, {
         autoClose: 2000,
      });

      try {
         const { data, message } = await api.delete(`/file/folder/${file._id}`);
         if (message) {
            toast.update(toastId, {
               render: `${file.name} đã xóa!`,
               type: "success",
               isLoading: false,
               autoClose: 3000,
            });
            dispatch(DeleteFileAction(file._id));
         }
      } catch (error) {
         console.log(error);
         toast.update(toastId, {
            render: `Lỗi khi xóa ${file.name}`,
            type: "error",
            isLoading: false,
            autoClose: 3000,
            closeOnClick: true,
         });
      }
   };

   const handleDelete = async () => {
      try {
         const fileList = itemsData.filter((item) => selectedItems.includes(item._id));
         let delay = 0;
         setSelectedItems([]);
         for (let file of fileList) {
            setTimeout(() => deleteFile(file), [delay]);
            delay += 500;
         }
      } catch (error) {}
   };

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
         if (prevSelectedItems.length === 1 && prevSelectedItems.includes(id)) {
            return [];
         } else {
            return [id];
         }
      });
   };

   const handleContextMenu = (e, itemId) => {
      e.preventDefault();
      const containerRect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - containerRect.left;
      const relativeY = e.clientY - containerRect.top;

      if (!selectedItems.includes(itemId)) {
         setSelectedItems([itemId]);
      }

      setContextMenu({
         visible: true,
         x: relativeX,
         y: relativeY,
         itemId: itemId,
      });
   };

   const renderDownload = () => {
      const handleDownload = async (id) => {
         setContextMenu(defaultContextMenu);
         const { data } = await api.get(`/file/download/${id}`);
         if (data) {
            window.open(data);
         }
      };

      const handleView = async (id) => {
         setContextMenu(defaultContextMenu);
         const { data } = await api.get(`/file/view/${id}`);
         if (data) {
            window.open(data);
         }
      };
      if (selectedItems.length == 1) {
         const item = itemsData.find((item) => item._id === selectedItems[0]);
         if (item && item.type !== "folder") {
            return (
               <>
                  <Button onClick={() => handleView(item.driveId)} appearance="subtle" className="btn-context">
                     Xem
                  </Button>
                  <Button onClick={() => handleDownload(item.driveId)} appearance="subtle" className="btn-context">
                     Tải xuống
                  </Button>
               </>
            );
         }
      }
      return null;
   };

   const openSort = (e) => {
      e.preventDefault();
      if (!e.target.classList) return;
      if (!e.target.classList.contains("list-container")) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - containerRect.left;
      const relativeY = e.clientY - containerRect.top;

      setContextMenu({
         visible: true,
         x: relativeX,
         y: relativeY,
      });
   };

   const ManySelected = (
      <ButtonGroup vertical>
         <Button
            appearance="subtle"
            className="btn-context"
            onClick={() => {
               setModalDelete(true);
               setContextMenu(defaultContextMenu);
            }}
         >
            Xóa
         </Button>
      </ButtonGroup>
   );

   const ItemSelected = (
      <ButtonGroup vertical>
         {renderDownload()}
         <Button
            appearance="subtle"
            className="btn-context"
            onClick={() => {
               setModalRename(true);
               setContextMenu(defaultContextMenu);
            }}
         >
            Đổi tên
         </Button>
         <Button
            appearance="subtle"
            className="btn-context"
            onClick={() => {
               setModalDelete(true);
               setContextMenu(defaultContextMenu);
            }}
         >
            Xóa
         </Button>
      </ButtonGroup>
   );

   const SortSelect = (
      <ButtonGroup vertical>
         {renderDownload()}
         <Button
            appearance="subtle"
            className="btn-context"
            onClick={() => {
               setSort(0);
               setContextMenu(defaultContextMenu);
            }}
         >
            Theo loại
         </Button>
      </ButtonGroup>
   );

   return (
      <>
         <div
            className={`list-container ${isSelecting ? "crosshair" : ""}`}
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onContextMenu={openSort}
         >
            <div className="list-item">
               {itemsData.map((item) => (
                  <div key={item.id} id={`item-${item.id}`} onContextMenu={(e) => handleContextMenu(e, item.id)}>
                     <FileItem
                        {...item}
                        selected={selectedItems.includes(item.id) || newSelectItems.includes(item.id)}
                        onClick={(e) => {
                           if (e.ctrlKey) {
                              handleCtrlClick(item.id);
                           } else {
                              handleItemClick(item.id);
                           }
                        }}
                     />
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
               {contextMenu.visible && (
                  <Notification
                     className="context-menu"
                     style={{ position: "absolute", top: contextMenu.y, left: contextMenu.x }}
                  >
                     {selectedItems.length == 0 ? SortSelect : selectedItems.length > 1 ? ManySelected : ItemSelected}
                  </Notification>
               )}

               <Modal open={modalDelete} onClose={() => setModalDelete(false)}>
                  <Panel header="Xác nhận xóa các file sau">
                     <List>
                        {selectedItems.map((s) => (
                           <List.Item key={s}>{itemsData.find((i) => i._id == s)?.name}</List.Item>
                        ))}
                     </List>
                  </Panel>
                  <Modal.Footer>
                     <Button onClick={() => setModalDelete(false)}>Hủy</Button>
                     <Button
                        appearance="primary"
                        onClick={() => {
                           handleDelete();
                           setModalDelete(false);
                        }}
                     >
                        Xác nhận
                     </Button>
                  </Modal.Footer>
               </Modal>

               {modalRename && (
                  <ModalRename
                     open={modalRename}
                     onClose={() => setModalRename(false)}
                     onSubmit={() => {
                        setModalRename(false);
                     }}
                     item={itemsData.find((item) => item._id === selectedItems[0])}
                  />
               )}
            </div>
         </div>
      </>
   );
};

export default ListContainer;
