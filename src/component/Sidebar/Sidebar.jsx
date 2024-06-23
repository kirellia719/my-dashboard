import "./Sidebar.scss";

import { useState, forwardRef } from "react";

import logo from "./avatar.jpg";
import router_dom from "../../utils/router";

import MenuIcon from "@rsuite/icons/Menu";

import { Drawer, Sidenav, Nav, Navbar, Avatar } from "rsuite";

import { Link, useLocation } from "react-router-dom";
import { useWindowSize } from "../../utils/function";

const NavLink = forwardRef(({ href, children, ...rest }, ref) => {
  return (
    <Link ref={ref} to={href} {...rest}>
      {children}
    </Link>
  );
});

const Sidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(location.pathname);

  const windowSize = useWindowSize();
  const isMobile = windowSize < 768;

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
    </Sidenav>
  );

  return (
    <div className="Sidebar">
      <div className="sidenav">
        <div className="sidebar-header">
          <div className="sidebar-header-item">
            <Avatar circle src={logo} />
            Dashboard
          </div>
          {isMobile && (
            <div className="sidebar-header-item" onClick={() => setOpen(true)}>
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
