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
import { useLocation } from "react-router-dom";

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
import MDAlert from "components/MDAlert";
import { Tooltip, IconButton, CardContent, Typography } from "@mui/material";

import SyncIcon from '@mui/icons-material/Sync';
import EditIcon from "@mui/icons-material/Edit";

import CrudService from "services/cruds-service";
import { AbilityContext } from "Can";
import { useAbility } from "@casl/react";
import MapParameter from "./map-parameter";

function ExternalParameterManagement() {
    let { state } = useLocation();
    const ability = useAbility(AbilityContext);
    const [data, setData] = useState([]);
    const [mapData, setMapData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [notification, setNotification] = useState({
        value: false,
        text: "",
    });
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        (async () => {
            const response = await CrudService.getExternalParameters();
            setData(response.data);
        })();
        document.title = `RIVIO | External Parameters`;
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

    const clickSyncHandler = (id) => {
        // navigate(`/external-parameter-management/edit-parameter/${id}`);
        const parameterData = data.find((item) => item.id === id);
        setMapData(parameterData);
        setOpenModal(true);
    };

    const clickEditHandler = async (id) => {
      // navigate(`/external-parameter-management/edit-parameter/${id}`);
      const parameterData = data.find((item) => item.id === id);
      const response = await CrudService.getInternalFromExternalParameter(id);
      setMapData(response.data.attributes);
      setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
    };

    const getRows = (info) => {
        let updatedInfo = info.map((row) => {      
            let color = row?.status_type_id === 19 ? 'success' : 'info';
            let variant = row?.status_type_id === 19 ? 'gradient' : 'contained';
            let badgeContent = row?.status_type_id === 19 ? 'Mapped' : 'Not Mapped';
    
            return {
                type: "parameters",
                id: row.id,
                api_name: row.ApiName.api_name,
                status_type_id: row.status_type_id,
                map_status: (
                    <Badge
                        color={color}
                        variant={variant}
                        badgeContent={badgeContent}
                        style={{ display: 'inline-block', whiteSpace: 'nowrap', marginLeft: "20px" }}
                    >
                    </Badge>
                ),
                paramname: row?.parameter_name,
            };
        });
        return updatedInfo;
    };

  const dataTableData = {
    columns: [
      { Header: "External Parameter ID", accessor: "id" },
      { Header: "Map Status", accessor: "map_status" },
      { Header: "API Name", accessor: "api_name" },
      { Header: "Parameter Name", accessor: "paramname"},
      {
        Header: "actions",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
            return (
              <MDBox display="flex" alignItems="center">
              {ability.can("edit", "devices") && (info.cell.row.original.status_type_id === 19) && (
                  <Tooltip title="Map Parameter">
                      <IconButton onClick={() => clickEditHandler(info.cell.row.original.id)}>
                          <MDTypography><EditIcon /></MDTypography>
                      </IconButton>
                  </Tooltip>
              )}
                  
              {ability.can("edit", "devices") && (info.cell.row.original.status_type_id === 20) && (
                  <Tooltip title="Map Parameter">
                      <IconButton onClick={() => clickSyncHandler(info.cell.row.original.id)}>
                          <SyncIcon />
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
                    External Parameter Management
                </MDTypography>
            </MDBox>

            <Modal  
                open={openModal}
                onClose={handleClose}
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
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <CardContent>                 
                  <Typography>Map Device</Typography>
                  <MapParameter setOpen={setOpenModal} mapData={mapData} data={data} setData={setData} />
                </CardContent>
              </Card>
            </Modal>
            
            <DataTable table={dataTableData} canSearch={true}/>
            {/* <MultiSelectDataTable rowData={getRows(data)} selectedRows={selectedRows} setSelectedRows={setSelectedRows}/> */}
            
          </Card>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ExternalParameterManagement;
