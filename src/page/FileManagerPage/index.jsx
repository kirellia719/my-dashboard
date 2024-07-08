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

   const fileChange = (e) => {
      const files = [];
      for (let file of e.target.files) {
         files.push(file);
      }
      if (files.length > 0) {
         uploadDrive(files);
         fileInputRef.current.value = null;
      }
   };

   const onDrop = (acceptedFiles) => {
      const structedFiles = buildFileStructure(acceptedFiles);
      uploadDrive(structedFiles);
   };
   const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      noClick: true,
      noKeyboard: true,
      directory: true,
   });

   const folderChange = (event) => {
      const files = Array.from(event.target.files);
      const structure = buildFileStructure(files);
      uploadDrive(structure);
      folderInputRef.current.value = null;
   };

   // ---------------------------------------------------------------------

   const uploadFile = async (file, folderId, level = 0) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);

      let toastId;
      try {
         if (level == 0) {
            toastId = toast.loading(`Đang tải ${file.name}...`, {
               autoClose: false,
            });
         }
         const { data } = await api.post(`/file/upload/${folderId ? folderId : "root"}`, formData);
         if (data) {
            if (level == 0) {
               toast.update(toastId, {
                  render: `${file.name} tải lên thành công!`,
                  type: "success",
                  isLoading: false,
                  autoClose: 3000,
                  closeOnClick: true,
               });
            }
            return data;
         }
      } catch (error) {
         console.log(error);
         toast.update(toastId, {
            render: `Error uploading ${file.name}`,
            type: "error",
            isLoading: false,
            autoClose: 5000,
         });
         return null;
      }
   };

   const buildFileStructure = (files) => {
      const root = [];

      files.forEach((file) => {
         let pathParts = (file.webkitRelativePath || file.path).split("/");
         if (pathParts[0] == "") {
            pathParts.shift();
         }

         let temp = root;

         for (let i = 0; i < pathParts.length - 1; i++) {
            const findFolder = temp.find((item) => item?.folderName && item?.folderName == pathParts[i]);
            if (findFolder) {
               temp = findFolder.children;
            } else {
               const newFolder = { folderName: pathParts[i], children: [] };
               temp.push(newFolder);
               temp = newFolder.children;
            }
         }

         temp.push(file);
      });

      return root;
   };

   const createFolder = async (name, folderId) => {
      try {
         const { data } = await api.post(`/file/folder/${folderId ? folderId : "root"}`, { name: name.trim() });
         return data;
      } catch (error) {}
   };

   const uploadFolder = async (folderStructure, folderId, level = 0) => {
      let toastId;

      try {
         const { folderName, children } = folderStructure;
         if (level === 0) {
            toastId = toast.loading(`Đang tạo ${folderName}...`, {
               autoClose: false,
            });
         }

         const newFolder = await createFolder(folderName, folderId);
         if (newFolder) {
            for (let i = 0; i < children.length; i++) {
               const child = children[i];
               if (child instanceof File) {
                  await uploadFile(child, newFolder._id, level + 1);
               } else {
                  await uploadFolder(child, newFolder._id, level + 1);
               }
            }
            if (level == 0) {
               toast.update(toastId, {
                  render: `${folderName} tạo thành công!`,
                  type: "success",
                  isLoading: false,
                  autoClose: 3000,
                  closeOnClick: true,
               });
               dispatch(AddFileAction(newFolder));
            }
         } else {
            toast.dismiss(toastId);
         }
      } catch (error) {
         console.log(error);
      }
   };
   // ---------------------------------------------------------------------------------

   const uploadDrive = async (structure) => {
      try {
         for (let item of structure) {
            if (item instanceof File) {
               const newFile = await uploadFile(item, folderId);
               if (newFile) {
                  dispatch(AddFileAction(newFile));
               }
            } else {
               uploadFolder(item, folderId, 0);
            }
         }
      } catch (error) {}
   };

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
