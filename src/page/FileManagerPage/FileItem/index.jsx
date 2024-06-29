import "./style.scss";

import api from "api";

import DocIcon from "./image-icon/doc-icon.png";
import FolderIcon from "./image-icon/folder-icon.png";
import ImageIcon from "./image-icon/image-icon.png";
import { useNavigate } from "react-router-dom";
import { Dropdown, Popover, Whisper } from "rsuite";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const typeMapping = {
   "image/png": "image",
   "application/vnd.google-apps.folder": "folder",
};

const mappingIcon = {
   image: ImageIcon,
   folder: FolderIcon,
};

export default ({
   id,
   mimeType,
   name = "noname",
   webContentLink,
   selected = false,
   onClick,
}) => {
   const [open, setOpen] = useState(false);
   const targetRef = useRef(null);

   const type = typeMapping[mimeType];
   const navigate = useNavigate();
   const isFolder = type === "folder";

   const handleOpenFolder = () => {
      isFolder && navigate(`/file-manager/${id}`);
   };

   const handleContextMenu = (event) => {
      event.preventDefault();
      setOpen(true);
   };

   const handleClickOutside = (event) => {
      if (targetRef.current && !targetRef.current.contains(event.target)) {
         setOpen(false);
      }
   };

   const handleDownload = () => {
      window.open(webContentLink);
   };

   const FolderContext = (
      <Popover full>
         <Dropdown.Menu>
            <Dropdown.Item onClick={handleOpenFolder}>Mở</Dropdown.Item>
         </Dropdown.Menu>
      </Popover>
   );

   const FileContext = (
      <Popover full>
         <Dropdown.Menu>
            <Dropdown.Item>Xem</Dropdown.Item>
            <Dropdown.Item onClick={handleDownload}>Tải xuống</Dropdown.Item>
         </Dropdown.Menu>
      </Popover>
   );

   useEffect(() => {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("contextmenu", handleClickOutside);

      return () => {
         document.removeEventListener("contextmenu", handleClickOutside);
         document.removeEventListener("click", handleClickOutside);
      };
   }, []);

   return (
      <div
         ref={targetRef}
         onClick={handleContextMenu}
         onContextMenu={handleContextMenu}
      >
         <Whisper
            trigger="click"
            placement="auto"
            open={open}
            speaker={isFolder ? FolderContext : FileContext}
         >
            <div
               className={`FileItem ${selected ? "selected" : ""}`}
               title={name}
               onDoubleClick={handleOpenFolder}
               ref={targetRef}
            >
               <img src={mappingIcon[type]} alt="" className="file-icon" />
               <div className="file-name">{name}</div>
            </div>
         </Whisper>
      </div>
   );
};
