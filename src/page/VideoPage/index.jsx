import QRScanner from "~/component/QRScanner/QRScanner";
import "./style.scss";
import { useState } from "react";

export default () => {
   const [text, setText] = useState("");
   const [stop, setStop] = useState(false);
   const onScan = (result) => {
      setText(result.data);
   };
   return (
      <div className="VideoPage">
         {!stop ? <QRScanner onScan={onScan} /> : null}
         {text ?? <div>{text}</div>}
         <div>
            <button onClick={() => setStop(!stop)}>{stop ? "Resume" : "Stop"}</button>
         </div>
      </div>
   );
};
