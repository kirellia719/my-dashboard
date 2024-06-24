import "./Sidebar.scss";

import { useState, forwardRef } from "react";

import router_dom from "../../utils/router";

import MenuIcon from "@rsuite/icons/Menu";
import ExitIcon from "@rsuite/icons/Exit";

import { Drawer, Sidenav, Nav, Avatar } from "rsuite";

import { Link, useLocation } from "react-router-dom";
import { useWindowSize } from "../../utils/function";
import { useDispatch, useSelector } from "react-redux";
import { LogoutAction } from "../../redux/AuthReducer";

const NavLink = forwardRef(({ href, children, ...rest }, ref) => {
   return (
      <Link ref={ref} to={href} {...rest}>
         {children}
      </Link>
   );
});

const Sidebar = () => {
   const dispatch = useDispatch();
   const location = useLocation();
   const { user } = useSelector((state) => state.Auth);
   const [open, setOpen] = useState(false);
   const [activeKey, setActiveKey] = useState(location.pathname);

   const windowSize = useWindowSize();
   const isMobile = windowSize < 768;

   const handleLogout = () => {
      dispatch(LogoutAction());
   };

   const avatar =
      user?.avatar ||
      "https://adtimin.vn/wp-content/uploads/2017/09/Logo-1.jpg";
   const username = user?.username || "Dashboard";

   const side_body = (
      <Sidenav expanded={true} className="sidebar-router" appearance="subtle">
         <Sidenav.Body>
            <Nav activeKey={activeKey} onSelect={setActiveKey}>
               {router_dom.map((r) => (
                  <Nav.Item
                     key={r.link}
                     eventKey={`/${r.link}`}
                     icon={<r.icon />}
                     as={NavLink}
                     href={`/${r.link}`}
                     className="nav-item"
                  >
                     {r.title}
                  </Nav.Item>
               ))}
            </Nav>
         </Sidenav.Body>
         <Nav>
            <Nav.Item
               icon={<ExitIcon />}
               className="nav-item"
               onClick={handleLogout}
            >
               Đăng xuất
            </Nav.Item>
         </Nav>
      </Sidenav>
   );

   return (
      <div className="Sidebar">
         <div className="sidenav">
            <div className="sidebar-header">
               <div className="sidebar-header-item">
                  <Avatar circle src={avatar} className="logo" bordered />
                  {username}
               </div>
               {isMobile && (
                  <div
                     className="sidebar-header-item"
                     onClick={() => setOpen(true)}
                  >
                     <MenuIcon />
                  </div>
               )}
            </div>
            {isMobile ? (
               <Drawer
                  open={open}
                  onClose={() => setOpen(false)}
                  size={250}
                  className="sidebar-drawer"
               >
                  <div className="drawer-header">
                     <div className="drawer-item">
                        <Avatar
                           circle
                           src="https://tanhoamai.com.vn/wp-content/uploads/2024/03/logo-social-mediajpg.webp"
                           className="logo"
                        />
                        Dashboard
                     </div>
                  </div>
                  {side_body}
               </Drawer>
            ) : (
               <>{side_body}</>
            )}
         </div>
      </div>
   );
};

export default Sidebar;
