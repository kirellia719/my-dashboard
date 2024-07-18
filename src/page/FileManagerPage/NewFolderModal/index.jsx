import { Button, Form, Input, Modal } from "rsuite";
import { useEffect, useRef, useState } from "react";
import api from "api";
import { useParams } from "react-router-dom";

import { processAPI, toast } from "../../../utils/function";
import { useDispatch } from "react-redux";
import { AddFileAction } from "../../../redux/FileManagerReducer";

export default ({ open, onClose }) => {
   const dispatch = useDispatch();
   const [name, setName] = useState("");
   const [loading, setLoading] = useState(false);
   const nameRef = useRef(null);

   const folderId = useParams()["*"];

   const createFolder = async (name, folderId) => {
      try {
         const { data } = await api.post(`/file/folder/${folderId ? folderId : "root"}`, { name: name.trim() });
         return data;
      } catch (error) {}
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!loading) {
         setLoading(true);
         const newFolder = await createFolder(name, folderId);
         if (newFolder) {
            dispatch(AddFileAction(newFolder));
            toast("Tạo file thành công", "success");
            onClose && onClose();
            setName("");
         }
         setLoading(false);
      }
   };
   useEffect(() => {
      open && nameRef.current.focus();
   }, [open]);

   return (
      <Modal open={open} onClose={onClose} className="my-modal">
         <form onSubmit={handleSubmit}>
            <Modal.Header>Thư mục mới</Modal.Header>
            <Modal.Body style={{ overflow: "unset" }}>
               <Input
                  placeholder="Tên thư mục"
                  value={name}
                  onChange={(v) => setName(v)}
                  disabled={loading}
                  inputRef={nameRef}
               />
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={onClose}>Hủy</Button>
               <Button appearance="primary" disabled={!name.trim()} onClick={handleSubmit} loading={loading}>
                  Thêm
               </Button>
            </Modal.Footer>
         </form>
      </Modal>
   );
};
