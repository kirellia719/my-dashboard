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
import { useDropzone } from "react-dropzone";

export default () => {
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const params = useParams();
   const folderId = params["*"];

   const fileInputRef = useRef(null);
   const folderInputRef = useRef(null);
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
   const handleFolderUpload = () => {
      folderInputRef.current.click();
   };

   const uploadFile = async (file, folderId) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);

      const toastId = toast.loading(`Đang tải ${file.name}...`, {
         autoClose: false,
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
            return data;
         }
      } catch (error) {
         toast.update(toastId, {
            render: `Error uploading ${file.name}`,
            type: "error",
            isLoading: false,
            autoClose: 5000,
         });
         return null;
      }
   };

   const uploadListFile = (fileList) => {
      try {
         let delay = 0;
         for (let file of fileList) {
            setTimeout(() => {
               const newFile = uploadFile(file, folderId);
               if (newFile) {
                  dispatch(AddFileAction(newFile));
               }
            }, delay);
            delay += 1000;
         }
      } catch (error) {}
   };

   const fileChange = (e) => {
      const files = [];
      for (let file of e.target.files) {
         files.push(file);
      }
      files.length > 0 && uploadListFile(files);
   };

   const onDrop = (acceptedFiles) => {
      uploadListFile(acceptedFiles);
   };

   const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      noClick: true,
      noKeyboard: true,
      directory: true,
   });

   // --------------------------------------- UPLOAD FOLDER --------------------------------
   const createFolderStructure = (files, rootFolderName) => {
      const root = { folderName: rootFolderName, children: [] };

      files.forEach((file) => {
         const parts = file.webkitRelativePath.split("/").slice(1);
         addToStructure(root, parts, file);
      });

      return root;
   };

   const addToStructure = (current, parts, file) => {
      if (parts.length === 1) {
         current.children.push(file);
      } else {
         let folder = current.children.find((child) => child.folderName === parts[0]);

         if (!folder) {
            folder = { folderName: parts[0], children: [] };
            current.children.push(folder);
         }
         addToStructure(folder, parts.slice(1), file);
      }
   };

   const folderChange = (event) => {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
         const rootFolderName = files[0].webkitRelativePath.split("/")[0];
         const structuredFolder = createFolderStructure(files, rootFolderName);
         uploadFolder(structuredFolder, folderId);
      }
   };

   const createFolder = async (name, folderId) => {
      try {
         const { data } = await api.post(`/file/folder/${folderId ? folderId : "root"}`, { name: name.trim() });
         return data;
      } catch (error) {}
   };

   const uploadFolder = async (folderStructure, folderId, level = 0) => {
      try {
         const { folderName, children } = folderStructure;
         const newFolder = await createFolder(folderName, folderId);
         if (newFolder) {
            let delay = 0;
            for (let child of children) {
               setTimeout(() => {
                  if (child instanceof File) {
                     uploadFile(child, newFolder._id);
                  } else {
                     uploadFolder(child, newFolder._id, level + 1);
                  }
               }, [delay]);
            }
            if (level == 0) {
               dispatch(AddFileAction(newFolder));
            }
         }
      } catch (error) {}
   };
   // ---------------------------------------------------------------------------------

   return (
      <div className="FileManagerPage">
         <input hidden type="file" ref={fileInputRef} onChange={fileChange} multiple />
         <input hidden type="file" ref={folderInputRef} onChange={folderChange} webkitdirectory="true" />
         <div className="header-breadcrumb">
            <Breadcrumb />
         </div>
         <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <div className="file-container custom-scrollbar">
               {loading ? <Loader /> : <ListContainer />}{" "}
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
                                    Upload Tệp
                                 </Dropdown.Item>
                                 <Dropdown.Item
                                    className="task-btn"
                                    onClick={() => {
                                       onClose();
                                       handleFolderUpload();
                                    }}
                                 >
                                    Upload Thư mục
                                 </Dropdown.Item>
                              </Dropdown.Menu>
                           </Popover>
                        );
                     }}
                  >
                     <IconButton size="lg" appearance="primary" icon={<PlusIcon />} circle />
                  </Whisper>
               </div>
            </div>
         </div>

         <NewFolderModal open={newFolder} onClose={() => setNewFolder(false)} />
      </div>
   );
};
