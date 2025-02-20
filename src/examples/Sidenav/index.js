/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useState, useContext } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 PRO React examples
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavList from "examples/Sidenav/SidenavList";
import SidenavItem from "examples/Sidenav/SidenavItem";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";
import CrudService from "services/cruds-service";

// Material Dashboard 2 PRO React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  AuthContext,
} from "context";

import AuthService from "services/auth-service";
import { Can } from "Can";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const { setIsAuthenticated, getCurrentUser } = useContext(AuthContext);
  const authContext = useContext(AuthContext);

  const [openCollapse, setOpenCollapse] = useState(false);
  const [openNestedCollapse, setOpenNestedCollapse] = useState(false);
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const location = useLocation();
  const { pathname } = location;
  const collapseName = pathname.split("/").slice(1)[0];
  const items = pathname.split("/").slice(1);
  const itemParentName = items[1];
  const itemName = items[items.length - 1];
  const [devices, setDevices] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    setOpenCollapse(collapseName);
    setOpenNestedCollapse(itemParentName);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CrudService.getInternalDevices();
        setDevices(response.data);
      } catch (error) {
        // Handle errors here, e.g., log the error or show a notification
        console.error('Error fetching internal devices:', error);
      }
    };
    console.log(isAuthenticated, 'isAuthenticated')
    if(isAuthenticated) fetchData();
  }, [isAuthenticated]);
  
  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);


  const renderDeviceItems = devices.map((device, index) => {
    let deviceParamValue = device.paramValue ? device.paramValue?.value : undefined;
    let percent = deviceParamValue ? deviceParamValue.device_data?.percent_level : 0;
    let alert = device.alert;
  
    return (
      <NavLink to={`/internal-device-management/view-device/${device.id}`} key={index}>
        <SidenavItem
          key={index}
          name={device?.attributes?.name + ': ' + percent + '%'}
          route={`/internal-device-management/view-device/${device.id}`} 
          icon={<Icon>devices</Icon>} 
          active={pathname === `/internal-device-management/view-device/${device.id}`}
          style={{ border: alert ? '1px solid red' : 'none' }}

        />
      </NavLink>
    );
  });

  const handleLogOut = async () => {
    try {
      let user = await getCurrentUser();
      await AuthService.logout(user);
      authContext.logout();
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  // Render all the nested collapse items from the routes.js
  const renderNestedCollapse = (collapse) => {
    const template = collapse.map(({ name, route, key, href, type }) =>
      href ? (
        <Can I="view" this={type}>
          <Link
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavItem name={name} nested />
          </Link>
        </Can>
      ) : (
        <Can I="view" this={type}>
          <NavLink to={route} key={key} sx={{ textDecoration: "none" }}>
            <SidenavItem name={name} active={route === pathname} nested />
          </NavLink>
        </Can>
      )
    );

    return template;
  };
  // Render the all the collpases from the routes.js
  const renderCollapse = (collapses) =>
    collapses.map(({ name, collapse, route, href, key, type }) => {
      let returnValue;
      if (collapse) {
        returnValue = (
          <Can I="view" this={type}> 
            <SidenavItem
              key={key}
              color={color}
              name={name}
              active={key === itemParentName ? "isParent" : false}
              open={openNestedCollapse === key}
              onClick={({ currentTarget }) =>
                openNestedCollapse === key && currentTarget.classList.contains("MuiListItem-root")
                  ? setOpenNestedCollapse(false)
                  : setOpenNestedCollapse(key)
              }
            >
              {renderNestedCollapse(collapse)}
            </SidenavItem>
          </Can>
        );
      } else {
        if (name !== "Logout") {
          returnValue = href ? (
            type ? (
              <Can I="edit" this={type}>
                <Link
                  href={href}
                  key={key}
                  target="_blank"
                  rel="noreferrer"
                  sx={{ textDecoration: "none" }}
                >
                  <SidenavItem color={color} name={name} active={key === itemName} />
                </Link>
              </Can>
            ) : (
              <Link
                href={href}
                key={key}
                target="_blank"
                rel="noreferrer"
                sx={{ textDecoration: "none" }}
              >
                <SidenavItem color={color} name={name} active={key === itemName} />
              </Link>
            )
          ) : type ? (
            <Can I="edit" a={type}>
              <NavLink to={route} key={key} sx={{ textDecoration: "none" }}>
                <SidenavItem color={color} name={name} active={key === itemName} />
              </NavLink>
            </Can>
          ) : (
            <NavLink to={route} key={key} sx={{ textDecoration: "none" }}>
              <SidenavItem color={color} name={name} active={key === itemName} />
            </NavLink>
          );
        } else {
          returnValue = (
            <MDBox>
              <MDButton
                fullWidth
                variant="gradient"
                color={color}
                type="button"
                onClick={handleLogOut}
              >
                Log Out
              </MDButton>
            </MDBox>
          );
        }
      }
      return <SidenavList key={key}>{returnValue}</SidenavList>;
    });

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(
    ({ type, name, icon, title, collapse, noCollapse, key, href, route }) => {
      let returnValue;

      if (type === "collapse") {
        if (href) {
          returnValue = (
            <Link
              href={href}
              key={key}
              target="_blank"
              rel="noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <SidenavCollapse
                name={name}
                icon={icon}
                active={key === collapseName}
                noCollapse={noCollapse}
              />
            </Link>
          );
        } else if (noCollapse && route) {
          returnValue = (
            <NavLink to={route} key={key}>
              <SidenavCollapse
                name={name}
                icon={icon}
                noCollapse={noCollapse}
                active={key === collapseName}
              >
                {collapse ? renderCollapse(collapse) : null}
              </SidenavCollapse>
            </NavLink>
          );
        } else {
          returnValue = (
            <SidenavCollapse
              key={key}
              name={name}
              icon={icon}
              active={key === collapseName}
              open={openCollapse === key}
              onClick={() => (openCollapse === key ? setOpenCollapse(false) : setOpenCollapse(key))}
            >
              {collapse ? renderCollapse(collapse) : null}
            </SidenavCollapse>
          );
        }
      } else if (type === "title") {
        returnValue = (
          <MDTypography
            key={key}
            color={textColor}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </MDTypography>
        );
      } else if (type === "divider") {
        returnValue = (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      }

      return returnValue;
    }
  );

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>
        {renderRoutes}
        <Divider />
       
        <SidenavCollapse
          key="devices"
          name="Devices"
          icon={<Icon>devices</Icon>}
          active={collapseName === "devices"} // Update with the appropriate key for the "Devices" section
          open={openCollapse === "devices"} // Update with the appropriate key for the "Devices" section
          onClick={() => (openCollapse === "devices" ? setOpenCollapse(false) : setOpenCollapse("devices"))}
        >
          {renderDeviceItems} 
        </SidenavCollapse>
      </List>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
