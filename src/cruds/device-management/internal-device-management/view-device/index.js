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

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Paper, Modal, CardContent, CardHeader, TableContainer, TableHead, Table, TableBody, TableCell, TableRow, Tab, Tabs, Tooltip, IconButton, Avatar } from "@mui/material";

import Badge from "@mui/material/Badge";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useNavigate, useParams } from "react-router-dom";

import CrudService from "services/cruds-service";
import LinearProgress from "@material-ui/core/LinearProgress";
import ParamValuesChart from "./ParamChart";
import DataTable from "examples/Tables/DataTable";
import { withStyles } from "@material-ui/core";
import moment from 'moment';
import CollapsibleTable from "examples/Tables/ExpandTable";
import AlertRulesForm from "./alertrule/new";
import ServiceRequestsForm from "./service-request/new";
import MDAlert from "components/MDAlert";

const ViewDevice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState({
    text: "",
    error: false,
    textError: "",
  });

  const [paramValues, setParamValues] = useState([]);
  const [percent, setPercent] = useState(0);
  const [paramValue, setParamValue] = useState();
  const [device, setDevice] = useState();
  const [percentThreshold, setPercentThreshold] = useState();
  const [tableData, setTableData] = useState([]);
  const [expandedIndexArray, setExpandedIndexArray] = useState([true, true, true, ...Array(6).fill(false)]);
  const [isNotified, setNotified] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [handleMode, setHandleMode] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [alert, setAlert] = useState();
  const [alertTableData, setAlertTableData] = useState([]);

  const [alertRule, setAlertRule] = useState([]);
  const [alertRules, setAlertRules] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [alertRuleTableData, setAlertRuleTableData] = useState([]);
  const [serviceRequestTableData, setServiceRequestTableData] = useState([]);
  
  /////////// service request ////////////
  const [openServiceModal, setServiceModal] = useState(false);

  const [notification, setNotification] = useState({
    value: false,
    text: "",
  });

    const [pillbarColor, setPillbarColor] = useState("");
    const [providersState, setProvidersState] = useState([]);

    useEffect(() => {
        if (!id) return;
        (async () => {
        try {
            console.log(id, 'id')
            const res = await CrudService.getDeviceView(id);
            console.log(res?.data, 'device data')
            setDevice(res?.data);
            setProvidersState(res?.data?.entityAddressItemProviders.map(provider => ({
                association_id: provider?.association_id,
                on_off: provider?.on_off || false
            })))
            setName({text: res.data.attributes?.name})
            setNotified(res.data.attributes?.is_notified);
            let lastRecord;
            if (res?.data?.monitorParameterValues) {     
                const extractedData = res.data.monitorParameterValues.map(item => ({
                    value: item.value?.device_data,
                    data: item.value,
                    id: item.id,
                    created_at: new Date(item.created_at).toISOString()  // Include full date with time
                }));
                
                // Create an object to store the last data entry for each unique date
                const paramValues = {};
                extractedData.forEach(item => {
                    const date = item.created_at.split('T')[0]; // Extract date without time
                    paramValues[date] = item;  // Store the data entry for each date, overwriting for duplicated dates
                });
                
                // Convert paramValues object to an array to match the previous structure
                const paramValuesArray = Object.values(paramValues);
                
                // const extractedData = res.data.monitorParameterValues.map(item => ({
                //     value: item.value?.device_data,
                //     data: item.value,
                //     created_at: item.created_at
                // }));

                setParamValues(paramValuesArray);
                lastRecord = extractedData.slice(-1)[0];
                setParamValue(lastRecord?.data);
                console.log(lastRecord?.data, 'lastRecord?.value')
                setPercent(lastRecord?.value?.percent_level || 0)
            }

            const alertRes = await CrudService.getDeviceAlerts(id);
            setAlerts(alertRes.data);

            const alertRulesRes = await CrudService.getAlertRules(id);
            setAlertRules(alertRulesRes.data);

            const serviceRequestssRes = await CrudService.getServiceRequests(id);
            setServiceRequests(serviceRequestssRes.data)

            let deviceThresholds = res?.data?.deviceThresholds;
            for(let deviceThreshold of deviceThresholds) {
                if(deviceThreshold.threshold_type_id === 1) {
                    let color = parseInt(lastRecord?.data?.device_data?.percent_level) > parseInt(deviceThreshold.threshold_value) ? 'red' : 'blue'
                    setPillbarColor(color)
                }
            }            
        } catch (err) {
            console.error(err);
        }
        })();
    }, [id]);
 
    useEffect(() => {
        setTableData(getRows(paramValues));
    }, [paramValues]);

    useEffect(() => {
        setAlertTableData(getAlertRows(alerts));
    }, [alerts]);

    useEffect(() => {
        setAlertRuleTableData(getAlertRuleRows(alertRules));
    }, [alertRules]);

    useEffect(() => {
        setServiceRequestTableData(getServiceRequestRows(serviceRequests));
    }, [alertRules]);

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
        // Sort info array by id in descending order
        info.sort((a, b) => b.id - a.id);
    
        let updatedInfo = info.map((row) => {
            const formattedDate = moment(row?.created_at).format('MMMM DD, YYYY h:mm:ss A');
            return {
                id: row?.id,
                battery_status: row?.value?.battery_status,
                battery_voltage: row?.value?.battery_voltage,
                inch_level: row.value?.inch_level,
                percent_level: row.value?.percent_level,
                volume_level: row.value?.volume_level,
                date: formattedDate,
                status: (
                    row.data?.status === 'Working' ? (
                        <Badge variant="gradient" badgeContent="Working" color="success" style={{ marginLeft: '10px' }}></Badge>
                    ) : (
                        <Badge variant="gradient" badgeContent="Not Connected" color="error" style={{ marginLeft: '-90px', width: '120px' }}></Badge>
                    )
                )
            };
        });
    
        return updatedInfo;
    };

    const dataTableData = {
        columns: [
          { Header: "ID", accessor: "id" },
          { Header: "Status", accessor: "status" },
          { Header: "Battery Status", accessor: "battery_status", width: "20%" },
          { Header: "Battery Voltage", accessor: "battery_voltage", width: "20%" },
          { Header: "Inch Level", accessor: "inch_level", width: "15%" },
          { Header: "Percent Level", accessor: "percent_level", width: "15%" },
          { Header: "Volume Level", accessor: "volume_level", width: "15%" },
          { Header: "Date", accessor: "date" },

        ],
        rows: tableData, // Assuming tableData is your original data array
    };

    const clickAlertRuleEditHandler = async (ruleId) => {
        let res = await CrudService.getAlertRule(ruleId);
        setAlertRule(res);  
        setOpenViewModal(true);
    };

    const clickAlertRuleDeleteHandler = async (e, ruleId) => {
        try {
            if (!confirm("Are you sure you want to delete this alert rule?")) {
                e.nativeEvent.stopImmediatePropagation();
            } else {
                await CrudService.deleteAlertRule(ruleId);
                // the delete does not send a response
                // so I need to get again the categories to set it and this way the table gets updated -> it goes to the useEffect with data dependecy
                const response = await CrudService.getAlertRules(id);
                setAlertRules(response.data);
                setNotification({
                    value: true,
                    text: "The alert rule has been successfully deleted",
                });
            }
        } catch (err) {
            // it sends error is the item is associated with an item
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

    const getAlertRuleRows = (info) => {
        let updatedInfo = info.map((row) => {
            console.log(row, '-----------')
            let frequency = row.attributes?.frequency + ' min' + (row.attributes?.frequency > 1 ? '(s)' : '');
            return {
                id: row?.id,
                alert_type: row.attributes?.AlertType?.type_name,
                alert_sub_type: row.attributes?.AlertSubType?.sub_type_name,
                event_type: row.attributes?.EventType?.name,
                address: row.attributes?.ContactAddress?.contact_address,
                send_to_type: row.attributes?.SendToType?.send_to_type_name,
                frequency: frequency,
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

    const alertRuledataTableData = {
        columns: [
          { Header: "ID", accessor: "id" },
          { Header: "Status", accessor: "status"},
          { Header: "Alert Type", accessor: "alert_type"},
          { Header: "Alert Sub Type", accessor: "alert_sub_type"},
          { Header: "Event Type", accessor: "event_type"},
          { Header: "Address", accessor: "address"},
          { Header: "Send Type", accessor: "send_to_type"},
          { Header: "Frequency", accessor: "frequency"},
          {
            Header: "actions",
            disableSortBy: true,
            accessor: "",
            Cell: (info) => {
              return (
                <MDBox display="flex" alignItems="center">
                <Tooltip title="Edit Alert Rule">
                    <IconButton onClick={() => clickAlertRuleEditHandler(info.cell.row.original.id)}>
                        <MDTypography><EditIcon /></MDTypography>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete Alert Rule">
                    <IconButton onClick={(e) => clickAlertRuleDeleteHandler(e, info.cell.row.original.id)}>
                        <MDTypography><DeleteIcon /></MDTypography>
                    </IconButton>
                </Tooltip>
                </MDBox>
              );
            },
          },
        ],
        rows: alertRuleTableData, // Assuming tableData is your original data array
    };

    const getServiceRequestRows = (info) => {
        let updatedInfo = info.map((row) => {
            console.log(row, '=============')
            return {
                id: row.attributes?.service_request_id,
                user: row.attributes?.user?.name,
                entityAddressItem: row.attributes?.EntityAddressItem?.name,
                provider: row.attributes?.Provider?.provider_name,
                serviceItem: row.attributes?.ServiceItem?.item_name,
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

    const serviceRequestdataTableData = {
        columns: [
          { Header: "ID", accessor: "id" },
          { Header: "Status", accessor: "status"},
          { Header: "Entity Address Item", accessor: "entityAddressItem"},
          { Header: "Provider", accessor: "provider"},
          { Header: "Service Item", accessor: "serviceItem"},
          { Header: "User", accessor: "user"},
        ],
        rows: serviceRequestTableData, // Assuming tableData is your original data array
    };

    const getAlertRows = (info) => {
        let updatedInfo = info.map((row) => {
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

    const alertColumns = [
        { Header: "ID", accessor: "id", width: "5%" },
        { Header: "Status", accessor: "status", width: "10%" },
        { Header: "Alert Type", accessor: "alert_type", width: "15%" },
        { Header: "Sub Type", accessor: "sub_type", width: "15%" },
        { Header: "Device", accessor: "device", width: "15%" },
        { Header: "Created At", accessor: "created_at", width: "20%" },
        { Header: "Updated At", accessor: "updated_at", width: "20%" },
        {
            Header: "actions",
            disableSortBy: true,
            accessor: "actions",
        },
    ]

    const clickViewHandler = async (id, value) => {
        let data = await CrudService.getAlert(id);
        setAlert(data);
        setHandleMode(true);
        setOpenViewModal(true);
    }

    const StyledLinearProgress = withStyles({
        root: {
            height: 20, // Increase height of the progress bar here
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 10px', // Add padding for better visibility of percentage
            position: 'relative', // Add position relative for absolute positioning of percentage
            borderRadius: '15px'
        },
        bar: {
            borderRadius: '5px',
            backgroundColor: pillbarColor
        },
    })(LinearProgress);

    const handleExpand = (index) => {
        setExpandedIndexArray((prevArray) =>
            prevArray.map((item, idx) => (idx === index ? !item : item))
        );
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

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

    const cardStyle = index => ({
        display: 'flex',
        flexDirection: 'column',
        ...(expandedIndexArray[index] && { minHeight: '100%' }),
    });

    const styles = {
        table: {
            padding: 0,
            borderSpacing: 0,
            borderCollapse: 'collapse',
        },
        cell: {
            padding: 0,
            width: '50%', // Allow the column to size itself based on content
        },
    };

    const handleViewClose = () => {
        setOpenViewModal(false);
    };

    const handleServiceModalClose = () => {
        setServiceModal(false);
    };

    const handleProviderSwitchChange = async (association_id, newOnOffValue) => {
        setProvidersState(prevState =>
            prevState.map(provider =>
                provider.association_id === association_id
                    ? { ...provider, on_off: newOnOffValue }
                    : provider
            )
        );

        try {
            await CrudService.setProviderActive({
                association_id,
                on_off: newOnOffValue
            });
        } catch (error) {
            console.error('Error updating provider:', error);
        }
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

            <MDBox mt={0} mb={9}>
                <Grid justifyContent="center">
                    <Grid item xs={12} lg={8}>
                        <MDBox mt={0} mb={0} textAlign="center">
                            <MDBox mb={1}>
                                <MDTypography variant="h3" fontWeight="bold">
                                    Device {device?.attributes?.name}
                                </MDTypography>
                            </MDBox>
                        </MDBox>
                        <Card>
                            <MDBox>
                                <MDBox display="flex" flexDirection="column" px={3} my={2}>
                                    <MDBox pl={2} pr={2}>
                                        <MDTypography>Tank Level</MDTypography>
                                        <MDBox style={{position: 'relative'}} mb={3}>
                                            <StyledLinearProgress variant="determinate" value={percent} />
                                            <MDBox
                                                position="absolute"
                                                top={0}
                                                left={0}
                                                right={0}
                                                bottom={0}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                color={percent > 55 ? "white" : 'black'}
                                            >
                                                <MDTypography variant="body2" color="textSecondary">
                                                {`${percent}%`}
                                                </MDTypography>
                                            </MDBox>
                                        </MDBox>
                                    </MDBox>
                                    <ParamValuesChart paramValues={paramValues}/>
                                    <MDBox mb={3}>
                                        <Grid container spacing={3}>
                                            {['Device Information', 'Current Data', 'Monitor'].map((title, index) => (
                                                <Grid item xs={12} sm={4} key={index}>
                                                    <Card style={cardStyle(index)}>
                                                        <CardHeader
                                                            title={title}
                                                            style={{ backgroundColor: '#f0f0f0', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                                                            onClick={() => handleExpand(index)}
                                                        />
                                                        {expandedIndexArray[index] && (
                                                            <CardContent>
                                                                {index === 0 && (
                                                                    <>
                                                                        <MDTypography fontSize={1}>Device: {name?.text}</MDTypography> 
                                                                        <MDTypography fontSize={1}>Item: {device?.attributes?.EntityAddressItem?.Item?.name}</MDTypography> 
                                                                        <MDTypography fontSize={1}>Address: {device?.attributes?.EntityAddressItem?.Address?.street_address1}, {device?.attributes?.EntityAddressItem?.Address?.street_address2} {device?.attributes?.EntityAddressItem?.Address?.city}, {device?.attributes?.EntityAddressItem?.Address?.state}, {device?.attributes?.EntityAddressItem?.Address?.postal_code}, {device?.attributes?.EntityAddressItem?.Address?.country}</MDTypography> 
                                                                        <MDTypography fontSize={1}>Device Type: {device?.attributes?.DeviceType?.type_name}</MDTypography> 
                                                                        <MDTypography fontSize={1}>Brand: {device?.attributes?.DeviceBrand?.brand_name}</MDTypography> 
                                                                        <MDTypography fontSize={1}>Model: {device?.attributes?.DeviceModel?.model_name}</MDTypography> 
                                                                        <MDTypography fontSize={1}>Status: {device?.attributes?.StatusOption?.StatusType?.status_name}</MDTypography> 
                                                                    </>
                                                                )}
                                                                {index === 1 && (
                                                                    <>
                                                                        <MDTypography fontSize={1}>Battery Status: 
                                                                            {paramValue?.device_data?.battery_status === 'Good' ? (
                                                                                <Badge variant="gradient" badgeContent="Good" color="success" style={{ marginLeft: '30px' }}></Badge>
                                                                            ) : (
                                                                                <Badge variant="gradient" badgeContent="Not Good" color="error" style={{ marginLeft: '-60px', width: '100px' }}></Badge>
                                                                            )}
                                                                        </MDTypography>
                                                                        <MDTypography fontSize={1}>Battery Voltage: {paramValue?.device_data?.battery_voltage}</MDTypography> 
                                                                        <MDTypography fontSize={1}>Fluid Level: {paramValue?.device_data?.inch_level} Inches</MDTypography> 
                                                                        <MDTypography fontSize={1}>Percent Level: {paramValue?.device_data?.percent_level}</MDTypography> 
                                                                        <MDTypography fontSize={1}>Volume Level: {paramValue?.device_data?.volume_level} Gallons</MDTypography>
                                                                        <MDTypography fontSize={1}>Temperature: {paramValue?.device_data?.enclosure_temperature} {paramValue?.temperature_units}</MDTypography>
                                                                    </>
                                                                )}

                                                                {index === 2 && (
                                                                    <>
                                                                    <FormControlLabel
                                                                        control={<Switch checked={isNotified} onChange={(e) => {
                                                                            setNotified(!isNotified);
                                                                            console.log(isNotified, id, '------------')
                                                                            CrudService.setDeviceAlertEnable({deviceId: id, is_notified: !isNotified});
                                                                        }} />}
                                                                        label="Alerts Enabled"
                                                                        mt={5}
                                                                        mb={5}
                                                                    />                                                                    
                                                                    {
                                                                        <MDBox>
                                                                        <MDTypography fontSize={1}>Name: {device?.monitor}</MDTypography> 
                                                                        <MDTypography fontSize={1}
                                                                            >Status: 
                                                                            <Badge
                                                                                color={device?.monitor_status?.BadgeDetail?.color || 'primary'}
                                                                                variant={device?.monitor_status?.BadgeDetail?.variant}
                                                                                badgeContent={device?.monitor_status?.StatusType?.status_name}
                                                                                style={{marginLeft: '30px'}}
                                                                            >
                                                                            </Badge>
                                                                        </MDTypography> 
                                                                        <MDTypography fontSize={1}>Frequency: {device?.monitor_frequency} {device?.monitor_time_unit}</MDTypography> 
                                                                        <MDTypography fontSize={1}>Last Updated: {moment(device?.monitor_last_updated).format('MMMM Do YYYY, h:mm:ss a')}</MDTypography> 
                                                                        {device?.deviceThresholds.map((threshold, thresholdIndex) => (
                                                                            <Table key={thresholdIndex + 3}  style={{ ...styles.table, marginTop: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                                                                <TableBody>
                                                                                    <TableRow>
                                                                                        <TableCell style={styles.cell}>
                                                                                            <MDTypography fontSize={1}>Parameter</MDTypography>
                                                                                        </TableCell>
                                                                                        <TableCell style={styles.cell}>
                                                                                            <MDTypography fontSize={1}>{threshold?.DeviceParameter?.label}</MDTypography>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                    <TableRow>
                                                                                        <TableCell style={styles.cell}>
                                                                                            <MDTypography fontSize={1}>Comparison Operator</MDTypography>
                                                                                        </TableCell>
                                                                                        <TableCell style={styles.cell}>
                                                                                            <MDTypography fontSize={1}>{threshold?.ComparisonOperator?.label}</MDTypography>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                    <TableRow>
                                                                                        <TableCell style={styles.cell}>
                                                                                            <MDTypography fontSize={1}>Threshold</MDTypography>
                                                                                        </TableCell>
                                                                                        <TableCell style={styles.cell}>
                                                                                            <MDTypography fontSize={1}>{threshold?.threshold_value}</MDTypography>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                </TableBody>
                                                                            </Table>
                                                                        ))}
                                                                        </MDBox>                                                           
                                                                    }
                                                                    </>
                                                                )}

                                                            </CardContent>
                                                        )}
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </MDBox>

                                    <MDBox mb={3}>
                                        <Grid container spacing={3}>
                                            {['Transmission', 'Providers', 'Contact Detail'].map((title, index) => (
                                                <Grid item xs={12} sm={4} key={index+3}>
                                                    <Card style={cardStyle(index+3)}>
                                                        <CardHeader
                                                            title={title}
                                                            style={{ backgroundColor: '#f0f0f0', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                                                            onClick={() => handleExpand(index+3)}
                                                        />
                                                        {expandedIndexArray[index+3] && (
                                                            <CardContent>
                                                                {index === 0 && (
                                                                    <>
                                                                        <MDTypography fontSize={1}>Status: 
                                                                            {paramValue?.status === 'Working' ? (
                                                                                <Badge variant="gradient" badgeContent="Working" color="success" style={{ marginLeft: '40px' }}></Badge>
                                                                            ) : (
                                                                                <Badge variant="gradient" badgeContent="Not Connected" color="error" style={{ marginLeft: '-60px', width: '120px' }}></Badge>
                                                                            )}
                                                                        </MDTypography> 
                                                                        <MDTypography fontSize={1}>Signal Strength: {paramValue?.tx_signal}</MDTypography> 
                                                                        <MDTypography fontSize={1}>WiFi Signal: {paramValue?.wifi_signal}</MDTypography> 
                                                                        <MDTypography fontSize={1}>Reported: {paramValue?.tx_reported}</MDTypography> 
                                                                        <MDTypography fontSize={1}>Last Reported: {paramValue?.reported}</MDTypography> 
                                                                        <MDTypography fontSize={1}>Last Updated: {moment(paramValue?.reported, 'MMM Do, h:mm A').fromNow()}</MDTypography>
                                                                        <MDTypography fontSize={1}>Last Updated on: {paramValue?.last_updated_on}</MDTypography>
                                                                    </>
                                                                )}
                                                                {index === 1 && (
                                                                    <>
                                                                        <MDBox>
                                                                            <Grid container justifyContent="space-between">
                                                                                <Grid item>
                                                                                    <MDTypography variant="h6">Provider</MDTypography>
                                                                                </Grid>
                                                                                <Grid item>
                                                                                    <MDTypography variant="h6" mr={3} >Share</MDTypography>
                                                                                </Grid>
                                                                            </Grid>
                                                                            {device?.entityAddressItemProviders.map(provider => (
                                                                                <MDBox key={provider?.association_id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                                                    <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <Avatar
                                                                                            src={provider?.Provider?.logo_url}
                                                                                            alt={provider?.Provider?.provider_name}
                                                                                            sx={{ width: 60, height: 60 }}
                                                                                        />
                                                                                        <MDTypography ml={2}>{provider?.Provider?.provider_name}</MDTypography>
                                                                                    </MDBox>
                                                                                    <FormControlLabel
                                                                                        control={
                                                                                            <Switch
                                                                                                checked={
                                                                                                    providersState.find(p => p.association_id === provider.association_id)?.on_off
                                                                                                }
                                                                                                onChange={async (e) => {
                                                                                                    const newOnOffValue = e.target.checked;
                                                                                                    await handleProviderSwitchChange(provider.association_id, newOnOffValue);
                                                                                                }}
                                                                                            />
                                                                                        }
                                                                                        label=""
                                                                                        sx={{ mt: 5, mb: 5 }}
                                                                                    />
                                                                                </MDBox>
                                                                            ))}
                                                                        </MDBox>
                                                                                                                                             
                                                                    </>
                                                                )}
                                                                {index === 2 && device && device.contacts && device.contacts.map((contact, contactindex) => (
                                                                    <MDBox key={contactindex + 3}>
                                                                        <MDTypography fontSize={1}>Contact Name: {contact?.Contact?.first_name} {contact?.Contact?.last_name}</MDTypography>
                                                                        <MDTypography fontSize={1}>Status: {contact?.Contact?.StatusOption?.StatusType?.status_name}</MDTypography>
                                                                        {contact?.Contact?.ContactAddresses && (
                                                                            <Table style={{ ...styles.table, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} responsive>
                                                                                <TableBody>
                                                                                    {contact?.Contact?.ContactAddresses.map((address, subindex) => (
                                                                                        <TableRow key={subindex + 3}>
                                                                                            <TableCell style={{ padding: '0px' }}>
                                                                                                <Grid container spacing={2}>
                                                                                                    <Grid item>
                                                                                                        <MDTypography fontSize={1}>{address?.ContactAddressType?.type_name}</MDTypography>
                                                                                                    </Grid>
                                                                                                    <Grid item>
                                                                                                        <MDTypography fontSize={1}>{address?.contact_address}</MDTypography>
                                                                                                    </Grid>
                                                                                                </Grid>
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        )}
                                                                    </MDBox>
                                                                ))}
                                                                
                                                            </CardContent>
                                                        )}
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </MDBox>

                                    <MDBox mb={3}>
                                        <Grid container spacing={3}>
                                            {Array.from({ length: 3 }).map((_, index) => (
                                                <Grid item xs={12} sm={4} key={index + 6}>
                                                    <Card style={cardStyle(index+6)}>
                                                        <CardHeader
                                                            title={ index === 0 ? 'Attributes' : index === 1 ? 'Device Setup' : 'Actions'}
                                                            style={{ backgroundColor: '#f0f0f0', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                                                            onClick={() => handleExpand(index + 6)}
                                                        />
                                                        {expandedIndexArray[index + 6] && (
                                                            <CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                                {index === 0 && device?.itemAttributeValues.map((attr, attrindex) => (
                                                                    <MDTypography key={attrindex} fontSize={1}>{attr?.Attribute?.attribute_name}: {attr?.value}</MDTypography>
                                                                ))}
                                                                {index === 1 && (
                                                                    <MDBox>
                                                                        <MDTypography fontSize={1}>External ID: {device?.external_device_id}</MDTypography> 
                                                                        <MDTypography fontSize={1}>Depth: {paramValue?.device_setup?.depth}</MDTypography> 
                                                                        <MDTypography fontSize={1}>Shape: {paramValue?.device_setup?.shape}</MDTypography> 
                                                                        <MDTypography fontSize={1}>Width: {paramValue?.device_setup?.width}</MDTypography> 
                                                                        <MDTypography fontSize={1}>Length: {paramValue?.device_setup?.length}</MDTypography>
                                                                        <MDTypography fontSize={1}>Power X: {paramValue?.device_setup?.power_x}</MDTypography>
                                                                        <MDTypography fontSize={1}>Power Y: {paramValue?.device_setup?.power_y}</MDTypography>
                                                                        <MDTypography fontSize={1}>Power Z: {paramValue?.device_setup?.power_z}</MDTypography>
                                                                    </MDBox>
                                                                )}
                                                                {index === 2 && 
                                                                <>
                                                                    <MDButton color="dark" onClick={() => setServiceModal(true)}>Create Service Request</MDButton>
                                                                    {/* {(
                                                                        device?.alerts ? (
                                                                            device?.alerts.map(alert => (
                                                                                <MDBox style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                                                                    <MDTypography fontSize={1}>NO: {alert?.alert_id}</MDTypography>
                                                                                    <MDTypography fontSize={1}>Status: 
                                                                                        <Badge
                                                                                            color={alert?.StatusOption.BadgeDetail?.color || 'primary'}
                                                                                            variant={alert?.StatusOption.BadgeDetail?.variant}
                                                                                            badgeContent={alert?.StatusOption.StatusType?.status_name}
                                                                                            style={{marginLeft: '30px'}}
                                                                                        >
                                                                                        </Badge>
                                                                                    </MDTypography>
                                                                                    <MDTypography fontSize={1}>Alert Type: {alert?.AlertType?.type_name}</MDTypography>
                                                                                    <MDTypography fontSize={1}>Threshold: {alert?.threshold}</MDTypography>
                                                                                    <MDTypography fontSize={1}>Exceed Value: {alert?.exceed_value}</MDTypography>
                                                                                </MDBox>
                                                                            )
                                                                        )) : (
                                                                            <MDTypography>
                                                                                No Alert available
                                                                            </MDTypography>
                                                                        )
                                                                    )} */}
                                                                </>
                                                                }                                                        
                                                            </CardContent>
                                                        )}
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </MDBox>
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
                                                p: 4,
                                            }}
                                        >
                                                <AlertRulesForm alertRule={alertRule} setAlertRules={setAlertRules} deviceId={id} setOpenViewModal={setOpenViewModal}   />
                                        </Card>
                                    </Modal>

                                    <Modal
                                        open={openServiceModal}
                                        onClose={handleServiceModalClose}
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
                                                <ServiceRequestsForm device={device?.attributes} setServiceModal={setServiceModal}   />
                                        </Card>
                                    </Modal>
                                    <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Tabs">
                                        <Tab label="Logs" />
                                        <Tab label="Alerts" />
                                        <Tab label="Alert Rules" />
                                        <Tab label="Service Request" />
                                    </Tabs>

                                    {
                                        selectedTab === 0 && 
                                        <DataTable table={dataTableData} canSearch={true}/>
                                    }
                                    {
                                        selectedTab === 1 && (
                                            <>
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
                                                        <DynamicDataTable Alert={alert} />
                                                    </CardContent>
                                                </Card>
                                            </Modal>

                                            <MDBox pt={6} pb={3}>
                                                <MDBox mb={3}>
                                                    <CollapsibleTable
                                                        width="100%"
                                                        data={alertTableData}
                                                        columns={alertColumns}
                                                        clickViewHandler={clickViewHandler}
                                                    />
                                                </MDBox>
                                            </MDBox>
                                            </>
                                        )
                                        
                                    }
                                    {
                                        selectedTab === 2 && 
                                        <>
                                            <MDBox p={3} lineHeight={1} display="flex" justifyContent="right">

                                                <MDButton color="dark"
                                                    size="small"    
                                                    onClick={() => {
                                                            setHandleMode(false)
                                                            setAlertRule()
                                                            setOpenViewModal(true)
                                                        }
                                                    }
                                                
                                                >
                                                    Add Rule
                                                </MDButton>
                                            </MDBox>
                                            <DataTable table={alertRuledataTableData} canSearch={true}/>                                        
                                        </>
                                    }
                                    {
                                        selectedTab === 3 && 
                                        <>
                                            <DataTable table={serviceRequestdataTableData} canSearch={true}/>                                        
                                        </>
                                    }

                                    <MDBox ml="auto" mt={4} mb={2} display="flex" justifyContent="flex-end">
                                        <MDBox mx={2}>
                                            <MDButton
                                                variant="gradient"
                                                color="dark"
                                                size="small"
                                                px={2}
                                                mx={2}
                                                onClick={() =>
                                                    navigate("/internal-device-management", {
                                                        state: { value: false, text: "" },
                                                    })
                                                }
                                            >
                                                Back
                                            </MDButton>
                                        </MDBox>

                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
};

export default ViewDevice;
