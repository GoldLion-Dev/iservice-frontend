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

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Badge from "@mui/material/Badge";
import Modal from "@mui/material/Modal";
// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import { Tooltip, IconButton } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';

import CrudService from "services/cruds-service";
import HTMLReactParser from "html-react-parser";
import { AbilityContext } from "Can";
import { useAbility } from "@casl/react";
import GoogleMapComponent from "examples/Maps";

function EntityManagement() {
  let { state } = useLocation();
  const ability = useAbility(AbilityContext);
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [mapUrl, setMapUrl] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [notification, setNotification] = useState({
    value: false,
    text: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await CrudService.getEntities();
      console.log(response.data, 'comsss')

      setData(response.data);
    })();
    document.title = `RIVIO | Entities`;
  }, []);

  useEffect(() => {
    if (!state) return;
    setNotification({
      value: state.value,
      text: state.text,
    });
  }, [state]);

  useEffect(() => {
    setTableData(getRows(data));
  }, [data]);

  useEffect(() => {
    if (notification.value === true) {
      let timer = setTimeout(() => {
        setNotification({
          value: false,
          text: "",
        });
      }, 5000);
    }
  }, [notification]);

  const clickViewHandler = (id) => {
    navigate(`/entity-management/view-entity/${id}`);
  }

  const clickAddHandler = () => {
    navigate("/entity-management/new-entity");
  };

  const clickEditHandler = (id) => {
    navigate(`/entity-management/edit-entity/${id}`);
  };

  const clickDeleteHandler = async (e, id) => {
    try {
      if (!confirm("Are you sure you want to delete this entity?")) {
        e.nativeEvent.stopImmediatePropagation();
      } else {
        await CrudService.deleteEntity(id);
        // the delete does not send a response
        // so I need to get again the entities to set it and this way the table gets updated -> it goes to the useEffect with data dependecy
        const response = await CrudService.getEntities();
        setData(response.data);
        setNotification({
          value: true,
          text: "The entity has been successfully deleted",
        });
      }
    } catch (err) {
      // it sends error is the entity is associated with an item
      console.error(err);
      if (err.hasOwnProperty("errors")) {
        setNotification({
          value: true,
          text: err.errors[0].title,
        });
      }
      return null;
    }
  };

  const handleMapButtonClick = (row) => {
    const { street_address1, street_address2, city, state, country, postal_code, latitude, longitude } = row;
  
    // Check if latitude and longitude are valid numbers before constructing the URL
    if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
      // Construct the map URL with the specific location details
  
      // Set the map URL and open the modal
      setLatitude(latitude);
      setLongitude(longitude);
  
      setOpenModal(true);
    } else {
      console.error('Invalid latitude or longitude values:', latitude, longitude);
      // Handle the case where latitude or longitude is invalid
    }
  };
    

  const getRows = (info) => {
    let updatedInfo = info.map((row) => {
      let entityName = row.attributes.name;
      if (!entityName && row.attributes.first_name && row.attributes.last_name) {
        entityName = `${row.attributes.first_name} ${row.attributes.last_name}`;
      }
      const defaultIndex = row.moduleLocations.findIndex(location => location.is_default === true)

      return {
        type: "entities",
        id: row.attributes.entity_id,
        name: entityName,
        company: row.attributes.Company?.name,
        type: row.attributes.EntityType?.type_name,
        status: (
          <Badge
            color={row.attributes?.StatusOption?.BadgeDetail?.color || 'primary'}
            variant={row.attributes?.StatusOption?.BadgeDetail?.variant}
            badgeContent={row.attributes?.StatusOption?.StatusType?.status_name}
            style={{marginLeft: '30px'}}
          >
          </Badge>
        ),
        address: row.moduleLocations[defaultIndex]?.Address?.street_address1,
        city: row.moduleLocations[defaultIndex]?.Address?.city,
        state: row.moduleLocations[defaultIndex]?.Address?.state,
        country: row.moduleLocations[defaultIndex]?.Address?.country,
        postal_code: row.moduleLocations[defaultIndex]?.Address?.postal_code,
        latitude: row.moduleLocations[defaultIndex]?.Address?.latitude,
        longitude: row.moduleLocations[defaultIndex]?.Address?.longitude,
      };
    });
    return updatedInfo;
  };

  const dataTableData = {
    columns: [
      { Header: "ID", accessor: "id", width: "5%" },
      { Header: "Status", accessor: "status", width: "15%" },
      { Header: "Entity Name", accessor: "name", width: "20%" },
      { Header: "Company", accessor: "company", width: "20%" },
      { Header: "Type", accessor: "type", width: "20%" },
      { Header: "Address 1", accessor: "address", width: "10%" },
      { Header: "City", accessor: "city", width: "20%" },
      { Header: "State", accessor: "state", width: "10%" },
      { Header: "Country", accessor: "country", width: "10%" },
      { Header: "Postal Code", accessor: "postal_code", width: "10%" },
      { Header: "Latitude", accessor: "latitude", width: "10%" },
      { Header: "Longitude", accessor: "longitude", width: "10%" },
      {
        Header: "View on Map",
        accessor: "",
        width: "10%",
        Cell: (info) => (
          <MDButton onClick={() => handleMapButtonClick(info.cell.row.original)}>View</MDButton>
        ),
      },
      {
        Header: "actions",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
          return (
            <MDBox display="flex" alignItems="center">
              {ability.can("view", "entities") && (
                <Tooltip title="View entity">
                  <IconButton onClick={(e) => clickViewHandler(info.cell.row.original.id)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              )}              
              {ability.can("edit", "entities") && (
                <Tooltip title="Edit Entity">
                  <IconButton onClick={() => clickEditHandler(info.cell.row.original.id)}>
                    <MDTypography><EditIcon /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}
              {ability.can("delete", "entities") && (
                <Tooltip title="Delete entity">
                  <IconButton onClick={(e) => clickDeleteHandler(e, info.cell.row.original.id)}>
                    <MDTypography><DeleteIcon /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}
            </MDBox>
          );
        },
      },
    ],

    rows: tableData,
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {notification.value && (
        <MDAlert color="info" my="20px">
          <MDTypography variant="body2" color="white">
            {notification.text || ""}
          </MDTypography>
        </MDAlert>
      )}
      <MDBox pt={6} pb={3}>
        <MDBox mb={3}>
          <Card>
            <MDBox p={3} lineHeight={1} display="flex" justifyContent="space-between">
              <MDTypography variant="h5" fontWeight="medium">
                Entity Management
              </MDTypography>
              <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <MDBox tabIndex={-1}>
                  <GoogleMapComponent lat={latitude} lng={longitude} />
                </MDBox>
              </Modal>
              {ability.can("create", "entities") && (
                <MDButton
                  variant="gradient"
                  color="dark"
                  size="small"
                  type="submit"
                  onClick={clickAddHandler}
                >
                  + Add Entity
                </MDButton>
              )}
            </MDBox>
            <DataTable table={dataTableData} canSearch={true} />
          </Card>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default EntityManagement;
