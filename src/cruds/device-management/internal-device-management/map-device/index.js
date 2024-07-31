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
import GoogleMapBoardComponent from "examples/Maps/board";
import MultiSelectDataTable from "examples/Tables/MultiSelectDataTable";
import { Devices, Visibility } from "@mui/icons-material";

function MapDeviceManagement() {
  let { state } = useLocation();
  const ability = useAbility(AbilityContext);
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [notification, setNotification] = useState({
    value: false,
    text: "",
  });

  const [selectedDeviceId, setSelectedDeviceId] = useState();
  const [selectedDevice, setSelectedDevice] = useState();
  const [modalAlertOpen, setModalAlertOpen] = useState(false);
  const [alert, setAlert] = useState();

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

  useEffect(() => {
    let device = data.find(item => item.id === selectedDeviceId);
    setSelectedDevice(device)
  }, [selectedDeviceId]);

  const showAlert = (id) => {
    setModalAlertOpen(true);
    let selectedItem = data.find(item => item.id === id);
    setAlert(selectedItem.alert);
  }

  const hideAlert = (id) => {
    setModalAlertOpen(false);
  }

  const getRows = (info) => {
      let updatedInfo = info.map((row) => {
      let entityName;
      if(row.attributes?.EntityAddressItem?.Entity?.name)
        entityName = row.attributes?.EntityAddressItem?.Entity?.name;
      else if(row.attributes?.EntityAddressItem?.Entity?.first_name)
        entityName = row.attributes?.EntityAddressItem?.Entity?.first_name + ' ' + row.attributes?.EntityAddressItem?.Entity?.last_name;

      return {
        id: row.id,
        name: row.attributes?.name,
        entity: entityName,
        item: row.attributes?.EntityAddressItem?.Item?.name,
        createdAt: row.attributes.createdAt,
        updatedAt: row.attributes.updatedAt,
        address: row.attributes.EntityAddressItem?.Address?.street_address1,
        city: row.attributes.EntityAddressItem?.Address?.city,
        state: row.attributes.EntityAddressItem?.Address?.state,
        country: row.attributes.EntityAddressItem?.Address?.country,
        postal_code: row.attributes.EntityAddressItem?.Address?.postal_code,
        latitude: row.attributes.EntityAddressItem?.Address?.latitude,
        longitude: row.attributes.EntityAddressItem?.Address?.longitude,
        inch_level: row.paramValue?.value?.device_data?.inch_level,
        volume_level: row.paramValue?.value?.device_data?.volume_level,
        percent_level: row.paramValue?.value?.device_data?.percent_level,
        battery_status: row.paramValue?.value?.device_data?.battery_status,
        battery_voltage: row.paramValue?.value?.device_data?.battery_voltage,
        wifi_signal: row.paramValue?.value?.wifi_signal,

        status: (
          <Badge
            color={row.attributes?.StatusOption?.BadgeDetail?.color || 'primary'}
            variant={row.attributes?.StatusOption?.BadgeDetail?.variant}
            badgeContent={row.paramValue?.value?.device_data?.battery_status}
            style={{marginLeft: '30px'}}
          >
          </Badge>
        ),
        alert: row.alert ? (
          <MDButton
            onClick={() => showAlert(row.id)}
          >
            Alert
          </MDButton>
        ) : '',

      };
    });
    return updatedInfo;
  };


  const dataTableData = {  
    columns: [  
      { Header: "ID", accessor: "id" },  
      { Header: "Status", accessor: "status" }, // Include the status badge  
      { Header: "Name", accessor: "name" },  
      { Header: "Entity Name", accessor: "entity" },  
      { Header: "Item Name", accessor: "item" },  
      { Header: "Address", accessor: "address" },  
      { Header: "City", accessor: "city" },  
      { Header: "State", accessor: "state" },  
      { Header: "Country", accessor: "country" },  
      { Header: "Postal Code", accessor: "postal_code" },  
      { Header: "Latitude", accessor: "latitude" },  
      { Header: "Longitude", accessor: "longitude" },  
      { Header: "Inch Level", accessor: "inch_level" },  
      { Header: "Volume Level", accessor: "volume_level" },  
      { Header: "Percent Level", accessor: "percent_level" },  
      { Header: "Battery Status", accessor: "battery_status" },  
      { Header: "Battery Voltage", accessor: "battery_voltage" },  
      { Header: "Wi-Fi Signal", accessor: "wifi_signal" },  
      { Header: "Alert", accessor: "alert" },  
      { Header: "Created At", accessor: "createdAt" },  
      { Header: "Updated At", accessor: "updatedAt" },  
    ],  
  
    rows: tableData, // Assuming 'info' is the array you pass to getRows  
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
          <Modal
              open={modalAlertOpen}
              onClose={hideAlert}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
          >
              <Card
                  sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '80%', // Set the desired width here
                      backgroundColor: 'white',
                      p: 4,
                  }}
              >
                <MDTypography sx={{ fontSize: '20px' }}>Alert Details</MDTypography>
                <MDTypography>Alert Type: {alert?.AlertType?.type_name}</MDTypography>
                <MDTypography>Threshold: {alert?.threshold}</MDTypography>
                <MDTypography>Current Value: {alert?.exceed_value}</MDTypography>
                <MDTypography>Alert Created: {alert?.created_at}</MDTypography>
                <MDTypography>Status: {alert?.status_type_id ? 'Active' : 'Inactive'}</MDTypography>
              </Card>
          </Modal>
          <Card>
            <MDBox p={3} lineHeight={1} display="flex" justifyContent="space-between">
              <MDTypography variant="h5" fontWeight="medium">
                Device Map Management
              </MDTypography>
            </MDBox>
            <GoogleMapBoardComponent devices={data} selectedRow={selectedDevice} onSelectRow={setSelectedDevice} />
            <DataTable table={dataTableData} canSearch={true} onRowClick={setSelectedDeviceId} />
          </Card>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default MapDeviceManagement;
