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
import { Badge, Modal, CardContent, TableContainer, Table, TableHead, TableRow, TableBody, Paper, TableCell } from "@mui/material";

import CrudService from "services/cruds-service";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import moment from 'moment';
import CollapsibleTable from "examples/Tables/ExpandTable";

function AlertManagement() {
    let { state } = useLocation();

    const [data, setData] = useState([]);
    const [isDemo, setIsDemo] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [paramTableData, setParamTableData] = useState();
    const [notification, setNotification] = useState({
        value: false,
        text: "",
    });

    useEffect(() => {
        (async () => {
            const response = await CrudService.getAlerts();
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

    const clickViewHandler = async (id, value) => {
        let data = await CrudService.getAlert(id);
        setParamTableData(data);
        setOpenViewModal(true);
        console.log(id, data)
    }

    const clickDeleteHandler = async (e, id) => {
        console.log(id, '-d')
        try {
          if (!confirm("Are you sure you want to delete this company?")) {
            e.nativeEvent.stopImmediatePropagation();
          } else {
            await CrudService.deleteAlert(id);
            const response = await CrudService.getAlerts();
            setData(response.data);
            setNotification({
              value: true,
              text: "The Alert has been successfully deleted",
            });
          }
        } catch (err) {
          console.error(err);
          console.log(err.errors[0].detail, 'error')
          if (err.hasOwnProperty("errors")) {
            setNotification({
              value: true,
              text: err.errors[0].detail,
            });
          }
          return null;
        }
      };

    const handleViewClose = () => {
        setOpenViewModal(false);
    };

    const getRows = (info) => {
        let updatedInfo = info.map((row) => {
            console.log(row, 'row')
            const createdAt = row.attributes.created_at ? moment(row.attributes.created_at).format('MMMM DD, YYYY h:mm:ss A') : '';
            const updatedAt = row.attributes.updated_at ? moment(row.attributes.updated_at).format('MMMM DD, YYYY h:mm:ss A') : '';
            const subType = row.attributes.is_parent ? 'Alert Created' : ( row.attributes.is_healed ? 'Alert Healed' : 'Alert Resent');
            return {
                id: row.id,
                device_id: row.attributes.device_id,
                alert_type: row.attributes.AlertType?.type_name,
                device: row.attributes.Device?.name,
                alert_message: row.attributes.alert_message,
                sub_type: subType,
                is_parent: row.attributes.is_parent,
                created_at: createdAt,
                updated_at: updatedAt,
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

    const columns = [
        { Header: "ID", accessor: "id", width: "5%" },
        { Header: "Status", accessor: "status", width: "5%" },
        { Header: "Alert Type", accessor: "alert_type", width: "15%" },
        { Header: "Sub Type", accessor: "sub_type", width: "15%" },
        { Header: "Device", accessor: "device", width: "15%" },
        { Header: "Created At", accessor: "created_at" },
        { Header: "Updated At", accessor: "updated_at" },
        {
            Header: "actions",
            disableSortBy: true,
            accessor: "actions",
        },
    ]

    const renderTableCell = (data) => {
        // If the data is an object (JSON), render each key-value pair
        if (typeof data === 'object' && data !== null) {
            return (
                <Table>
                    <TableBody>
                        {Object.entries(data).map(([key, value]) => (
                            <TableRow key={key}>
                                <TableCell sx={{ padding: '1px!important;' }}>{formatColumnName(key)}</TableCell>
                                <TableCell sx={{ padding: '1px!important;' }}>{renderTableCell(value)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            );
        }
        return data;
    };
    
    const formatColumnName = (name) => {
        return name
            .replace(/_/g, ' ')  // Replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase());  // Capitalize first letter of each word
    };
    
    const DynamicDataTable = (Alert) => {
        // Parse JSON data and extract keys for table columns
        const columns = Object.keys(Alert);
    
        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column} sx={{ padding: '0px!important;' }}>{formatColumnName(column)}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column}>{renderTableCell(Alert[column])}</TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        );
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
            <Modal
                open={openViewModal}
                onClose={handleViewClose}
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
                        maxHeight: '70vh', // Set max height to enable scrolling
                        overflowY: 'auto',    
                        overflowX: 'hidden'                                          
                    }}
                >
                    <CardContent>   
                        <DynamicDataTable Alert={paramTableData} />
                    </CardContent>
                </Card>
            </Modal>

            <MDBox pt={6} pb={3}>
                <MDBox mb={3}>
                    <CollapsibleTable
                        data={tableData}
                        columns={columns}
                        clickViewHandler={clickViewHandler}
                        clickDeleteHandler={clickDeleteHandler}
                    />
                </MDBox>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default AlertManagement;
