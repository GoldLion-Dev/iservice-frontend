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

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import { Tooltip, IconButton, Badge, Modal, CardContent, TableContainer, Table, TableHead, TableRow, TableBody, Paper, TableCell } from "@mui/material";

import CrudService from "services/cruds-service";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SendGridManagement() {
    let { state } = useLocation();

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isDemo, setIsDemo] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [notification, setNotification] = useState({
        value: false,
        text: "",
    });

    useEffect(() => {
        (async () => {
            const response = await CrudService.getSendGrid();
            console.log(response.data, 'response.data')
            setData(response.data);
            setIsDemo(process.env.REACT_APP_IS_DEMO === "true");
        })();
        document.title = `RIVIO | Alerts`;
    }, []);

    useEffect(() => {
        setTableData(getRows(data));
    }, [data]);

    useEffect(() => {
        if (!state) return;
        setNotification({
            value: state.value,
            text: state.text,
        });
    }, [state]);

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

    const getRows = (info) => {
        let updatedInfo = info.map((row) => {
        return {
            id: row.id,
            alert_type: row.attributes.AlertType?.type_name,
            device: row.attributes.Device?.name,
            alert_message: row.attributes.alert_message,
            alert_message: row.attributes.alert_message,
            status: (
                <Badge
                    color={row.attributes?.StatusOption?.BadgeDetail?.color || 'primary'}
                    variant={row.attributes?.StatusOption?.BadgeDetail?.variant}
                    badgeContent={row.attributes?.StatusOption?.StatusType?.status_name}
                    style={{marginLeft: '30px'}}
                >
                </Badge>
            ),
    
        };
        });
        return updatedInfo;
    };

    
    const dataTableData = {
        columns: [
            { Header: "ID", accessor: "id", width: "10%" },
            { Header: "Status", accessor: "status", width: "15%" },
            { Header: "Alert Type", accessor: "alert_type", width: "20%" },
            { Header: "Device", accessor: "device", width: "20%" },
            { Header: "Alert Message", accessor: "alert_message", width: "20%" },
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
                    <DataTable table={dataTableData} canSearch={true} />
                </Card>
            </MDBox>
        </MDBox>
        <Footer />
    </DashboardLayout>
  );
}

export default SendGridManagement;
