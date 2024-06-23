import "./Header.scss";

import { useState, forwardRef } from "react";

import logo from "./avatar.jpg";

import MenuIcon from "@rsuite/icons/Menu";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import CalendarIcon from "@rsuite/icons/Calendar";
import TableIcon from "@rsuite/icons/Table";

import { Drawer, Sidenav, Nav, Navbar } from "rsuite";

import { Link, useLocation } from "react-router-dom";

const NavLink = forwardRef(({ href, children, ...rest }, ref) => {
  return (
    <Link ref={ref} to={href} {...rest}>
      {children}
    </Link>
  );
});

const Header = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(location.pathname);

  const drawer = false;

  return (
    <div className="Header">
      {drawer ? (
        <div className="header-drawer">
          <div className="logo">
            <img src={logo} className="logo" alt="Vite logo" />
          </div>
          <div className="menu-btn" onClick={() => setOpen(true)}>
            <MenuIcon />
          </div>

          <Drawer
            placement="right"
            size="50%"
            open={open}
            onClose={() => setOpen(false)}
          >
            <Sidenav expanded={true}>
              <Sidenav.Body>
                <Nav activeKey={activeKey} onSelect={setActiveKey}>
                  <Nav.Item
                    eventKey="/"
                    icon={<CalendarIcon />}
                    as={NavLink}
                    href="/"
                    onClick={() => setOpen(false)}
                  >
                    Lịch sử
                  </Nav.Item>
                  <Nav.Item
                    eventKey="/fashion"
                    icon={<TableIcon />}
                    as={NavLink}
                    href="/fashion"
                    onClick={() => setOpen(false)}
                  >
                    Tủ đồ
                  </Nav.Item>
                  <Nav.Item
                    eventKey="/statistic"
                    icon={<DashboardIcon />}
                    as={NavLink}
                    href="/statistic"
                    className="nav-item"
                  >
                    Thống kê
                  </Nav.Item>
                </Nav>
              </Sidenav.Body>
            </Sidenav>
          </Drawer>
        </div>
      ) : (
        <Navbar className="header-container" appearance="subtle">
          <Nav>
            <div>
              <div className="logo">
                <img src={logo} className="logo" alt="Vite logo" />
              </div>
            </div>
          </Nav>
          <Nav activeKey={activeKey} onSelect={setActiveKey}>
            <Nav.Item
              eventKey="/fashion"
              icon={<TableIcon />}
              as={NavLink}
              href="/fashion"
              className="nav-item"
            >
              Tủ đồ
            </Nav.Item>
            <Nav.Item
              eventKey="/"
              icon={<CalendarIcon />}
              as={NavLink}
              href="/"
              className="nav-item"
            >
              Lịch sử
            </Nav.Item>
            <Nav.Item
              eventKey="/statistic"
              icon={<DashboardIcon />}
              as={NavLink}
              href="/statistic"
              className="nav-item"
            >
              Thống kê
            </Nav.Item>
          </Nav>
        </Navbar>
      )}
    </div>
  );
};

export default Header;
