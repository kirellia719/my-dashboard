import React, { useState } from "react";

const FolderUpload = () => {
   const [folderStructure, setFolderStructure] = useState(null);
   console.log(folderStructure);

   const handleFileChange = (event) => {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
         const rootFolderName = files[0].webkitRelativePath.split("/")[0];
         const structuredFolder = createFolderStructure(files, rootFolderName);
         setFolderStructure(structuredFolder);
      }
   };

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
         current.children.push({ name: file.name, file: file });
      } else {
         let folder = current.children.find((child) => child.folderName === parts[0]);

         if (!folder) {
            folder = { folderName: parts[0], children: [] };
            current.children.push(folder);
         }

         addToStructure(folder, parts.slice(1), file);
      }
   };

   const traverse = (node) => {
      if (node.children) {
         node.children.forEach((child) => {
            if (child.file) {
               console.log(`File: ${child.name}`);
            } else {
               console.log(`Folder: ${child.folderName}`);
               traverse(child); // Recursively traverse subfolders
            }
         });
      }
   };

   return (
      <div>
         <input type="file" webkitdirectory="true" onChange={handleFileChange} />
         {folderStructure && (
            <div>
               <pre>{JSON.stringify(folderStructure, null, 2)}</pre>
               <button onClick={() => traverse(folderStructure)}>Traverse</button>
            </div>
         )}
      </div>
   );
};

export default FolderUpload;
