import api from "api";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { Button, Input, Modal, Panel } from "rsuite";
import { RenameFileAction } from "../../../../redux/FileManagerReducer";
import { toast } from "../../../../utils/function";

const ModalRename = ({ open, onClose, onSubmit, item = { name: "" } }) => {
   const [name, setName] = useState(item.name);
   const inputRef = useRef(null);

   const dispatch = useDispatch();

   const handleSubmit = async (e) => {
      e.preventDefault();
      const id = item._id;
      try {
         if (name.trim() !== "") {
            const { data, message } = await api.post(`/file/rename/${id}`, { name: name.trim() });
            if (data) {
               dispatch(RenameFileAction(data));
               toast(message, "success");
               onClose();
            }
         }
      } catch (error) {}
   };
   useEffect(() => {
      inputRef.current.focus();
   }, []);

   return (
      <Modal open={open} onClose={onClose} size={400}>
         <form onSubmit={handleSubmit}>
            <Panel header="Đổi tên">
               <Input value={name} onChange={(v) => setName(v)} inputRef={inputRef} />
            </Panel>
            <Modal.Footer>
               <Button onClick={onClose}>Hủy</Button>
               <Button appearance="primary" onClick={handleSubmit} disabled={!name.trim()}>
                  Xác nhận
               </Button>
            </Modal.Footer>
         </form>
      </Modal>
   );
};
export default ModalRename;
