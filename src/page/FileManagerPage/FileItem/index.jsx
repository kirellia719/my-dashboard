import "./style.scss";

import api from "api";

import DocIcon from "./image-icon/doc-icon.png";
import RarIcon from "./image-icon/rar-icon.png";
import VideoIcon from "./image-icon/video-icon.png";
import PDFIcon from "./image-icon/pdf-icon.png";
import ExcelIcon from "./image-icon/excel-icon.png";
import FolderIcon from "./image-icon/folder-icon.png";
import ImageIcon from "./image-icon/image-icon.png";

import { processAPI, toast } from "../../../utils/function";

import { NavLink, useNavigate } from "react-router-dom";
import { Dropdown, Popover } from "rsuite";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { DeleteFileAction } from "../../../redux/FileManagerReducer";

const mappingIcon = {
   "image/jpeg": ImageIcon,
   "image/png": ImageIcon,
   "application/pdf": PDFIcon,
   "application/msword": DocIcon,
   "application/vnd.openxmlformats-officedocument.wordprocessingml.document": DocIcon,
   "application/vnd.ms-powerpoint": DocIcon,
   "application/vnd.openxmlformats-officedocument.presentationml.presentation": DocIcon,
   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ExcelIcon,
   "video/mp4": VideoIcon,
   "application/octet-stream": RarIcon,
   folder: FolderIcon,
};

export default ({ _id, type, name = "noname", driveId, selected, id, onClick }) => {
   const dispatch = useDispatch();

   const [loading, setLoading] = useState(false);
   const targetRef = useRef(null);

   const navigate = useNavigate();
   const isFolder = type === "folder";

   const handleOpenFolder = () => {
      isFolder && navigate(`/file-manager/${_id}`);
   };

   const handleDownload = async () => {
      try {
         const { data } = await api.get(`/file/link/${driveId}`);
         window.open(data);
      } catch (error) {}
   };

   const handleDeleteFolder = async () => {
      setLoading(true);
      try {
         const { message } = await api.delete(`/file/folder/${_id}`);
         if (message) {
            dispatch(DeleteFileAction(_id));
            toast(message, "success");
            setRemove(false);
         }
      } catch (error) {
         processAPI({ status: 500, message: error.message });
      }
      setLoading(false);
   };

   const FolderContext = (
      <Popover full>
         <Dropdown.Menu>
            <Dropdown.Item onClick={handleOpenFolder}>Mở</Dropdown.Item>
            <Dropdown.Item onClick={() => setRemove(true)}>Xóa</Dropdown.Item>
         </Dropdown.Menu>
      </Popover>
   );

   const FileContext = (
      <Popover full>
         <Dropdown.Menu>
            <Dropdown.Item>Xem</Dropdown.Item>
            <Dropdown.Item onClick={handleDownload}>Tải xuống</Dropdown.Item>
            <Dropdown.Item onClick={() => setRemove(true)}>Xóa</Dropdown.Item>
         </Dropdown.Menu>
      </Popover>
   );

   const [remove, setRemove] = useState(false);

   return (
      <div className="center">
         {isFolder ? (
            <NavLink
               to={`/file-manager/${_id}`}
               className={`FileItem ${selected ? "selected" : ""}`}
               title={name}
               ref={targetRef}
            >
               <img src={mappingIcon[type]} alt="" className="file-icon" />
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
               <img src={mappingIcon[type]} alt="" className="file-icon" />
               <div className="file-name">{name}</div>
            </div>
         )}
      </div>
   );
};
