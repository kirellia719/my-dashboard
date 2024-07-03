import "./style.scss";

import api from "api";
import { toast } from "../../utils/function";
import { useDispatch } from "react-redux";

import TinyEditor from "~/component/TinyEditor/TinyEditor";
import { useEffect, useState } from "react";

const NotePage = () => {
   const dispatch = useDispatch();

   const [initContent, setInitContent] = useState(null);

   useEffect(() => {
      const fetchContent = async () => {
         try {
            const { data } = await api.get("/note/content");
            if (data) {
               console.log(data.content);
               setInitContent(`${data.content}`);
            }
         } catch (error) {
            console.log(error);
         }
      };
      fetchContent();
   }, []);

   const handleSave = async (content) => {
      try {
         const { data } = await api.post("/note/content", { content });
         if (data) {
            toast("Đã lưu");
         }
      } catch (error) {}
   };

   return (
      <div className="NotePage">
         <TinyEditor initValue={initContent} onSave={handleSave} />
      </div>
   );
};

export default NotePage;
