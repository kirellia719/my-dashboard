import { forwardRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb } from "rsuite";

import AngleRightIcon from "@rsuite/icons/legacy/AngleRight";
import TreeIcon from "@rsuite/icons/Tree";
import { useSelector } from "react-redux";

const NavLink = forwardRef(({ href, children, ...rest }, ref) => (
   <Link ref={ref} to={href} {...rest}>
      {children}
   </Link>
));

export default () => {
   const { parents } = useSelector((state) => state.Files);
   const folderId = useParams()["*"];
   return (
      <Breadcrumb separator={<AngleRightIcon />} className="breadcrumb">
         <Breadcrumb.Item href="/file-manager" as={NavLink} active={!folderId}>
            <TreeIcon />
         </Breadcrumb.Item>
         {parents.map((p, index) => (
            <Breadcrumb.Item
               href={`/file-manager/${p.id}`}
               as={NavLink}
               key={index}
               active={folderId == p.id}
            >
               {p.name}
            </Breadcrumb.Item>
         ))}
      </Breadcrumb>
   );
};
