import api from "api";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { Button, Input, Modal, Panel } from "rsuite";
import { RenameFileAction } from "../../../../redux/FileManagerReducer";
import { toast } from "../../../../utils/function";

const ModalRename = ({ open, onClose, onSubmit, item = { name: "" } }) => {
   const [name, setName] = useState(item.name);

   const dispatch = useDispatch();

   const handleSubmit = async () => {
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
   return (
      <Modal open={open} onClose={onClose} size={400}>
         <Panel header="Đổi tên">
            <Input value={name} onChange={(v) => setName(v)} />
         </Panel>
         <Modal.Footer>
            <Button onClick={onClose}>Hủy</Button>
            <Button appearance="primary" onClick={handleSubmit} disabled={!name.trim()}>
               Xác nhận
            </Button>
         </Modal.Footer>
      </Modal>
   );
};
export default ModalRename;
