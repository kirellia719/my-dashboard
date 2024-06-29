import "./style.scss";

import api from "api";

import { Loader } from "rsuite";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FileItem from "./FileItem";
import { useDispatch, useSelector } from "react-redux";
import { GetFilesAction } from "../../redux/FileManagerReducer";
import Breadcrumb from "./Breadcrumb";

export default () => {
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const params = useParams();
   const folderId = params["*"];
   useEffect(() => {
      const fetchFiles = async () => {
         console.log("fetch", folderId);
         setLoading(true);
         try {
            const { data } = await api.get(
               `/file/${folderId ? folderId : "root"}`
            );
            dispatch(GetFilesAction(data));
         } catch (error) {}
         setLoading(false);
      };

      fetchFiles();
   }, [folderId]);

   const { files } = useSelector((state) => state.Files);
   return (
      <div className="FileManagerPage">
         <div className="header-breadcrumb">
            <Breadcrumb />
         </div>
         <div className="file-manager-container custom-scrollbar">
            {loading ? (
               <Loader />
            ) : (
               <div className="list-item">
                  {files.map((f) => (
                     <FileItem {...f} key={f.id} />
                  ))}
               </div>
            )}
         </div>
      </div>
   );
};
