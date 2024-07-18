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

import CrudService from "services/cruds-service";
import HTMLReactParser from "html-react-parser";
import { AbilityContext } from "Can";
import { useAbility } from "@casl/react";
import GoogleMapComponent from "examples/Maps";
import MultiSelectDataTable from "examples/Tables/MultiSelectDataTable";
import { Visibility } from "@mui/icons-material";

function InternalDeviceManagement() {
  let { state } = useLocation();
  const ability = useAbility(AbilityContext);
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [notification, setNotification] = useState({
    value: false,
    text: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await CrudService.getInternalDevices();
      setData(response.data);
      console.log(response.data, 'response.data')
    })();
    document.title = `RIVIO | Internal Devices`;
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

  const clickAddHandler = () => {
    navigate("/internal-device-management/new-device");
  };

  const clickViewHandler = (id) => {
    navigate(`/internal-device-management/view-device/${id}`);
  };

  const clickEditHandler = (id) => {
    navigate(`/internal-device-management/edit-device/${id}`);
  };

  const clickDeleteHandler = async (e, id) => {
    try {
      if (!confirm("Are you sure you want to delete this device?")) {
        e.nativeEvent.stopImmediatePropagation();
      } else {
        await CrudService.deleteDevice(id);
        // the delete does not send a response
        // so I need to get again the categories to set it and this way the table gets updated -> it goes to the useEffect with data dependecy
        const response = await CrudService.getInternalDevices();
        setData(response.data);
        setNotification({
          value: true,
          text: "The device has been successfully deleted",
        });
      }
    } catch (err) {
      // it sends error is the device is associated with an device
      console.error(err);
      if (err.hasOwnProperty("errors")) {
        setNotification({
          value: true,
          text: err.errors[0].detail,
        });
      }
      return null;
    }
  };

  const handleMapButtonClick = (row) => {
    const { street_address1, street_address2, city, state, country, postal_code, latitude, longitude } = row;
  
    setLatitude(latitude);
    setLongitude(longitude);
    // setMapUrl(url);
    setOpenModal(true);
  };

  const getRows = (info) => {
      let updatedInfo = info.map((row) => {
      let entityName;
      if(row.attributes?.EntityAddressItem?.Entity?.name)
        entityName = row.attributes?.EntityAddressItem?.Entity?.name;
      else if(row.attributes?.EntityAddressItem?.Entity?.first_name)
        entityName = row.attributes?.EntityAddressItem?.Entity?.first_name + ' ' + row.attributes?.EntityAddressItem?.Entity?.last_name;

      let color = row?.status_type_map_id === 19 ? 'success' : 'info';
      let variant = row?.status_type_map_id === 19 ? 'gradient' : 'contained';
      let badgeContent = row?.status_type_map_id === 19 ? 'Mapped' : 'Not Mapped';
          
      return {
        id: row.id,
        name: row.attributes?.name,
        type: row.attributes.DeviceType?.type_name,
        entity: entityName,
        item: row.attributes?.EntityAddressItem?.Item?.name,
        brand: row.attributes.DeviceBrand?.brand_name,
        model: row.attributes.DeviceModel?.model_name,
        createdAt: row.attributes.createdAt,
        updatedAt: row.attributes.updatedAt,
        // entityaddressitem: row.attributes.EntityAddressItem?.name,
        address: row.attributes.EntityAddressItem?.Address?.street_address1,
        city: row.attributes.EntityAddressItem?.Address?.city,
        state: row.attributes.EntityAddressItem?.Address?.state,
        country: row.attributes.EntityAddressItem?.Address?.country,
        postal_code: row.attributes.EntityAddressItem?.Address?.postal_code,
        latitude: row.attributes.EntityAddressItem?.Address?.latitude,
        longitude: row.attributes.EntityAddressItem?.Address?.longitude,

        status: (
          <Badge
            color={row.attributes?.StatusOption?.BadgeDetail?.color || 'primary'}
            variant={row.attributes?.StatusOption?.BadgeDetail?.variant}
            badgeContent={row.attributes?.StatusOption?.StatusType?.status_name}
            style={{marginLeft: '30px'}}
          >
          </Badge>
        ),
        map_status: (
          <Badge
            color={color}
            variant={variant}
            badgeContent={badgeContent}
            style={{ display: 'inline-block', whiteSpace: 'nowrap', marginLeft: '30px' }}
          >
          </Badge>
        ),

      };
    });
    return updatedInfo;
  };


  const dataTableData = {
    columns: [
      { Header: "ID", accessor: "id", width: "5%" },
      { Header: "Status", accessor: "status", width: "15%" },
      { Header: "Map Status", accessor: "map_status", width: "15%" },
      { Header: "Name", accessor: "name", width: "15%" },
      { Header: "Type", accessor: "type", width: "20%" },
      { Header: "Brand", accessor: "brand", width: "20%" },
      { Header: "Model", accessor: "model", width: "20%" },
      { Header: "Entity Name", accessor: "entity", width: "20%" },
      { Header: "Item Name", accessor: "item", width: "20%" },
      { Header: "Address 1", accessor: "address", width: "10%" },
      { Header: "City", accessor: "city", width: "20%" },
      { Header: "State", accessor: "state", width: "10%" },
      { Header: "Country", accessor: "country", width: "10%" },
      { Header: "Postal Code", accessor: "postal_code", width: "10%" },
      { Header: "Latitude", accessor: "latitude", width: "10%" },
      { Header: "Longitude", accessor: "longitude", width: "10%" },
      { Header: "Created At", accessor: "createdAt", width: "10%" },
      { Header: "Updated At", accessor: "updatedAt", width: "10%" },
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
              {ability.can("view", "devices") && (
                <Tooltip title="View Device">
                  <IconButton onClick={() => clickViewHandler(info.cell.row.original.id)}>
                    <MDTypography><Visibility /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}
              {ability.can("edit", "devices") && (
                <Tooltip title="Edit Devoce">
                  <IconButton onClick={() => clickEditHandler(info.cell.row.original.id)}>
                    <MDTypography><EditIcon /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}
              {ability.can("delete", "devices") && (
                <Tooltip title="Delete Device">
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
                Device Management
              </MDTypography>
              <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <MDBox tabIndex={-1}>
                  <GoogleMapComponent lat={latitude} lng={longitude} />
                </MDBox>
              </Modal>

              {ability.can("create", "devices") && (
                <MDButton
                  variant="gradient"
                  color="dark"
                  size="small"
                  type="submit"
                  onClick={clickAddHandler}
                >
                  + Add Device
                </MDButton>
              )}
            </MDBox>
            <DataTable table={dataTableData} canSearch={true}/>
            {/* <MultiSelectDataTable rowData={getRows(data)} selectedRows={selectedRows} setSelectedRows={setSelectedRows}/> */}

          </Card>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default InternalDeviceManagement;
