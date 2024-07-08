import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const Upload = () => {
   const [fileStructure, setFileStructure] = useState([]);

   const onDrop = useCallback((acceptedFiles) => {
      setFileStructure(buildFileStructure(acceptedFiles));
   }, []);

   const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      directory: true,
      useFsAccessApi: false,
   });

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

   return (
      <div>
         <div {...getRootProps()} style={dropzoneStyle}>
            <input {...getInputProps()} webkitdirectory="true" />
            <p>Kéo và thả file hoặc folder vào đây, hoặc nhấp để chọn file/folder</p>
         </div>
         <pre>{JSON.stringify(fileStructure, null, 2)}</pre>
      </div>
   );
};

const dropzoneStyle = {
   border: "2px dashed #ccc",
   borderRadius: "4px",
   padding: "20px",
   textAlign: "center",
};

export default Upload;
