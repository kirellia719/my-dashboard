import "./style.scss";

import api from "api";

import PlusIcon from "@rsuite/icons/Plus";
import { Dropdown, IconButton, Loader, Popover, Whisper } from "rsuite";

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AddFileAction, GetFilesAction } from "../../redux/FileManagerReducer";
import Breadcrumb from "./Breadcrumb";
import NewFolderModal from "./NewFolderModal";
import { toast } from "react-toastify";
import ListContainer from "./ListContainer";
export default () => {
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const params = useParams();
   const folderId = params["*"];

   const fileInputRef = useRef(null);

   const [newFolder, setNewFolder] = useState(false);

   useEffect(() => {
      const fetchFiles = async () => {
         setLoading(true);
         try {
            const { data } = await api.get(`/file/${folderId ? folderId : "root"}`);
            if (data) {
               dispatch(GetFilesAction(data));
            }
         } catch (error) {}
         setLoading(false);
      };

      fetchFiles();
   }, [folderId]);

   const handleNewFolder = () => {
      setNewFolder(true);
   };

   const handleFileUpload = () => {
      fileInputRef.current.click();
   };

   const uploadFile = async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);

      const toastId = toast.loading(`Đang tải ${file.name}...`, {
         autoClose: false,
         // className: "custom-toast",
      });

      try {
         const { data } = await api.post(`/file/upload/${folderId ? folderId : "root"}`, formData);
         if (data) {
            toast.update(toastId, {
               render: `${file.name} tải lên thành công!`,
               type: "success",
               isLoading: false,
               autoClose: 3000,
               closeOnClick: true,
            });
            dispatch(AddFileAction(data));
         }
      } catch (error) {
         toast.update(toastId, {
            render: `Error uploading ${file.name}`,
            type: "error",
            isLoading: false,
            autoClose: 5000,
         });
      }
   };

   const fileChange = (e) => {
      const fileList = e.target.files;
      try {
         let delay = 0;
         for (let file of fileList) {
            setTimeout(() => uploadFile(file), [delay]);
            delay += 1000;
         }
      } catch (error) {}
   };

   return (
      <div className="FileManagerPage">
         <input hidden type="file" ref={fileInputRef} onChange={fileChange} multiple />
         <div className="header-breadcrumb">
            <Breadcrumb />
         </div>
         <div className="file-container custom-scrollbar">{loading ? <Loader /> : <ListContainer />}</div>
         <div className="task-menu">
            <Whisper
               placement="topEnd"
               trigger="click"
               speaker={({ onClose, left, top, className, ...rest }, ref) => {
                  return (
                     <Popover ref={ref} className={className} full>
                        <Dropdown.Menu>
                           <Dropdown.Item
                              className="task-btn"
                              onClick={() => {
                                 onClose();
                                 handleNewFolder();
                              }}
                           >
                              Tạo thư mục
                           </Dropdown.Item>
                           <Dropdown.Item
                              className="task-btn"
                              onClick={() => {
                                 onClose();
                                 handleFileUpload();
                              }}
                           >
                              Upload
                           </Dropdown.Item>
                        </Dropdown.Menu>
                     </Popover>
                  );
               }}
            >
               <IconButton size="lg" appearance="primary" icon={<PlusIcon />} circle />
            </Whisper>
         </div>
         <NewFolderModal open={newFolder} onClose={() => setNewFolder(false)} />
      </div>
   );
};
