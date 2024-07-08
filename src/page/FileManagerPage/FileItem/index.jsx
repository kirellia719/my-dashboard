import "./style.scss";

import FileIcon from "./image-icon/file-icon.png";
import DocIcon from "./image-icon/doc-icon.png";
import JSIcon from "./image-icon/js-icon.png";
import RarIcon from "./image-icon/rar-icon.png";
import VideoIcon from "./image-icon/video-icon.png";
import PDFIcon from "./image-icon/pdf-icon.png";
import ExcelIcon from "./image-icon/excel-icon.png";
import FolderIcon from "./image-icon/folder-icon.png";
import ImageIcon from "./image-icon/image-icon.png";
import CSSIcon from "./image-icon/css-icon.png";

import { NavLink } from "react-router-dom";
import { useRef } from "react";

const mappingIcon = {
   "image/jpeg": ImageIcon,
   "image/png": ImageIcon,
   "image/svg+xml": ImageIcon,

   "application/pdf": PDFIcon,

   "application/msword": DocIcon,
   "application/vnd.openxmlformats-officedocument.wordprocessingml.document": DocIcon,
   "application/vnd.ms-powerpoint": DocIcon,
   "application/vnd.openxmlformats-officedocument.presentationml.presentation": DocIcon,

   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ExcelIcon,
   "video/mp4": VideoIcon,
   "application/octet-stream": RarIcon,
   "text/javascript": JSIcon,

   "text/css": CSSIcon,
   "application/x-zip-compressed": RarIcon,

   folder: FolderIcon,
};

export default ({ _id, type, name = "noname", selected, id, onClick }) => {
   const targetRef = useRef(null);

   const isFolder = type === "folder";

   const icon = mappingIcon[type] || FileIcon;

   return (
      <div className="center">
         {isFolder ? (
            <NavLink
               to={`/file-manager/${_id}`}
               className={`FileItem ${selected ? "selected" : ""}`}
               title={name}
               ref={targetRef}
            >
               <img src={icon} alt="" className="file-icon" />
               <div className="file-name">{name}</div>
            </NavLink>
         ) : (
            <div
               to={`/file-manager/${_id}`}
               className={`FileItem ${selected ? "selected" : ""}`}
               title={name}
               id={id}
               onClick={onClick}
            >
               <img src={icon} alt="" className="file-icon" />
               <div className="file-name">{name}</div>
            </div>
         )}
      </div>
   );
};
