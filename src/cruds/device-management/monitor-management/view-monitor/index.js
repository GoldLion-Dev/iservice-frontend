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
import Modal from '@mui/material/Modal';
import { Autocomplete, Tooltip, IconButton, Tab, Tabs, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import FormField from "layouts/applications/wizard/components/FormField";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate, useParams } from "react-router-dom";

import CrudService from "services/cruds-service";
import { MODULE_MASTER } from "utils/constant";
import DataTable from "examples/Tables/DataTable";

const ViewMonitorDevice = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState({
        text: "",
        error: false,
        textError: "",
    });    

    const [device, setDevice] = useState([]);
    const [devices, setDevices] = useState([]);
    const [comparisonOperators, setComparisonOperators] = useState([]);
    const [thresholdTypes, setThresholdTypes] = useState([]);

    const [deviceParameters, setDeviceParameters] = useState([]);
    const [selectedThresholds, setSelectedThresholds] = useState([]);
    const [selectedParameters, setSelectedParameters] = useState([]);
    
    const [statusType, setStatusType] = useState([]);
    const [statusDevice, setStatusDevice] = useState([]);

    const [deviceParameterValues, setDeviceParameterValues] = useState([]);
    
    const [open, setOpen] = useState(false);
    const [paramTableData, setParamTableData] = useState();
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const response = await CrudService.getInternalDevices();
                setDevices(response.data);
                console.log(response.data, 'devicesss')
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getStatusTypes(MODULE_MASTER.DEVICES);
                setStatusDevice(response.data);
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getDeviceParameters();
                setDeviceParameters(response.data);
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getDeviceParameterValues(id);
                setDeviceParameterValues(response.data);
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getThresholdTypes();
                setThresholdTypes(response.data);
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getComparisonOperators();
                setComparisonOperators(response.data);
                console.log(response.data, 'com')
            } catch (err) {
                console.error(err);
                return null;
            }
        })();
    }, []);

    useEffect(() => {
        if (!id) return;
        (async () => {
          try {
            const res = await CrudService.getDeviceMonitor(id);
            console.log(res, 'res')
            setName({ ...name, text: res.data.attributes?.name });
            const deviceArray = res.data.attributes?.devices.map((device) => ({
                ...device,
                attributes: device?.Device
            }));
            
            setDevice(deviceArray);
            setStatusType({attributes: {StatusType: res.data.attributes?.StatusOption?.StatusType}});
            const newDeviceParameters = res.data.included.deviceParameters.map((parameter) => ({
                ...parameter,
                parameter_name: parameter?.DeviceParameter?.parameter_name,
                label: parameter?.DeviceParameter?.label,
                is_threshold_required: parameter?.DeviceParameter?.is_threshold_required,
                tooltip: parameter?.DeviceParameter?.tooltip,
                DeviceParameterType: parameter?.DeviceParameter?.DeviceParameterType,
                ApiName: parameter?.DeviceParameter?.ApiName,

            }));
            setSelectedParameters(newDeviceParameters)

            const newDeviceThresholds = res.data.included.deviceThresholds.map((threshold) => ({
                ...threshold,
                label: threshold?.DeviceParameter?.parameter_name,
                parameter_name: threshold?.DeviceParameter?.parameter_name,
                is_threshold_required: threshold?.DeviceParameter?.is_threshold_required,
                field_type_id: threshold?.DeviceParameter?.field_type_id
            }));
            setSelectedThresholds(newDeviceThresholds)
          } catch (err) {
            console.error(err);
          }
        })();
    }, [id]);
    
    
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const getDeviceRows = (info) => {
        let updatedInfo = info.map((row) => {
            let entityName;
            if(row.attributes?.EntityAddressItem?.Entity.name)
              entityName = row.attributes?.EntityAddressItem?.Entity.name;
            else if(row.attributes?.EntityAddressItem?.Entity.first_name)
              entityName = row.attributes?.EntityAddressItem?.Entity.first_name + ' ' + row.attributes?.EntityAddressItem?.Entity.last_name;
      
            return {
                id: (
                    <a href={`/internal-device-management/edit-device/${row.attributes?.device_id}`} target="_blank" rel="noopener noreferrer">
                      {row.attributes?.device_id}
                    </a>
                ),
                status: row.attributes?.StatusOption,
                name: row.attributes?.name,
                type: row.attributes?.DeviceType?.type_name,
                brand: row.attributes?.DeviceBrand?.brand_name,
                model: row.attributes?.DeviceModel?.model_name,
                entity: entityName,
                item: row.attributes?.EntityAddressItem?.Item?.name,  
            };
        });
        return updatedInfo;
    }

    const tableDeviceData = {
        columns: [
          { Header: "ID", accessor: "id", width: "5%" },
          { Header: "name", accessor: "name", width: "20%" },
          { Header: "type", accessor: "type", width: "15%" },
          { Header: "brand", accessor: "brand", width: "15%" },
          { Header: "model", accessor: "model", width: "15%" },
          { Header: "entity", accessor: "entity", width: "15%" },
          { Header: "item", accessor: "item", width: "15%" },
        ],
    
        rows: getDeviceRows(device),
    };

    const getRows = () => {
        return selectedThresholds.map((row, index) => {
            const fields = [
                {
                    parameter_name: row.parameter_name
                }
            ];

            if (row?.is_threshold_required) {
                fields.push(
                    {
                        threshold_type: (
                            <Autocomplete
                                defaultValue={row?.DeviceMonitorThresholdType || null}
                                readOnly
                                options={thresholdTypes}
                                getOptionLabel={(option) => (option ? option.threshold_name : "")}
                                style={{ width: "140px" }}  
                                renderInput={(params) => (
                                    <FormField {...params} label="Type" InputLabelProps={{ shrink: true }} required />
                                )}
                            />
                        ),
                        threshold_value: (
                            <FormField
                                required
                                readOnly
                                value={row.threshold_value}
                                label="Value"
                            />
                        ),    
                        comparison_operator: (
                            <Autocomplete
                                defaultValue={row.ComparisonOperator || null}
                                readOnly
                                options={comparisonOperators}
                                getOptionLabel={(option) => (option ? option.comparison_operator : "")}
                                style={{ width: "80px" }}  
                                renderInput={(params) => (
                                    <FormField {...params} label="Operator" InputLabelProps={{ shrink: true }} required />
                                )}
                            />
                        ),
                        alert_enabled: (
                            <Checkbox
                                readOnly
                                checked={row.alert_enabled}
                            />
                        )
                    }
                );
            }

            return Object.assign({}, ...fields);
        });
    };

    const tableThresholdData = {
        columns: [
            { Header: "Parameter Name", accessor: "parameter_name" },
            { Header: "Threshold Type", accessor: "threshold_type" },
            { Header: "Comparison Operator", accessor: "comparison_operator" },
            { Header: "Threshold Value", accessor: "threshold_value" },
            {
                Header: "Alert Enabled",
                accessor: 'alert_enabled'
            },
        ],
        rows: getRows(),
    };

    const getParameterRows = (info) => {
        let updatedInfo = info.map((row) => {
            return {
                id: row.parameter_id,
                name: row.parameter_name,
                type: row.DeviceParameterType?.type_name,
                label: row.label,
                tooltip: row.tooltip,
                api_name: row.AplName?.api_name,
                is_allowed: row.is_threshold_required ? "True" : "False",  
            };
        });
        return updatedInfo;
    }


    const tableParameterData = {
        columns: [
            { Header: "ID", accessor: "id" },
            { Header: "Parameter Name", accessor: "name" },
            { Header: "Type", accessor: "type" },
            { Header: "Label", accessor: "label" },
            { Header: "Tool Tip", accessor: "tooltip" },
            { Header: "API Name", accessor: "api_name" },
            { Header: "Threshold Allowed", accessor: "is_allowed" },
        ],
        rows: getParameterRows(selectedParameters),
    };

    const getLogColumns = (data) => {
        const columns = Object.keys(data[0] || {}).map((key) => ({
            Header: key.replace(/_/g, ' '), // Replace underscores with spaces
            accessor: key,
        }));
    
        // Add the "View" button column at the end
        columns.push({
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }) => (
                <MDButton onClick={() => handleView(row.original.index, row.original.value)}>View</MDButton>
            ),
        });
    
        const filteredColumns = columns.filter((col) => col.accessor !== 'value');

        return filteredColumns;
    };
    
    const tableLogData = (tableData) => {
        return {
            columns: getLogColumns(tableData),
            rows: tableData,
        };
    };

    const renderTableCell = (data) => {
        // If the data is an object (JSON), render each key-value pair
        if (typeof data === 'object' && data !== null) {
            return (
                <Table>
                    <TableBody>
                        {Object.entries(data).map(([key, value]) => (
                        <TableRow key={key}>
                            <TableCell>{key}</TableCell>
                            <TableCell>{renderTableCell(value)}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            );
        }
        return data;
    };

    const DynamicDataTable = (ParameterData) => {
        // Parse JSON data and extract keys for table columns
        const columns = Object.keys(ParameterData);
      
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column}>{renderTableCell(ParameterData[column])}</TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        );
    };

    const handleView = (id, value) => {
        setOpen(true);
        setParamTableData(value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRefreshLog = async () => {
        try {
            const response = await CrudService.getDeviceParameterValues(id);
            setDeviceParameterValues(response.data);                                    
        } catch (error) {
            console.error('Error fetching device parameter values:', error);
            // Handle error if necessary
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mt={5} mb={9}>
                <Grid justifyContent="center">
                    <Grid item xs={12} lg={8}>
                        <MDBox mt={6} mb={3} textAlign="center">
                            <MDBox mb={1}>
                                <MDTypography variant="h3" fontWeight="bold">
                                Device Monitor {id}
                                </MDTypography>
                            </MDBox>
                            <MDTypography variant="h5" fontWeight="regular" color="secondary">
                                This information will describe more about the Device Monitor.
                            </MDTypography>
                        </MDBox>
                        <Card>
                            <MDBox>
                                <MDBox display="flex" flexDirection="column" px={3} my={2}>
                                    <MDBox p={1}>
                                        <FormField
                                            type="text"
                                            readOnly
                                            label="Name"
                                            name="name"
                                            value={name?.text || ""}
                                            error={name?.error}
                                        />
                                        {name.error && (
                                        <MDTypography variant="caption" color="error" fontWeight="light">
                                            {name.textError}
                                        </MDTypography>
                                        )}
                                    </MDBox>
                                    {/* <Autocomplete
                                        multiple
                                        readOnly
                                        defaultValue={[]}
                                        options={devices}
                                        getOptionLabel={(option) => (option.attributes ? option.attributes.name : "")}
                                        value={device ?? ""}                                        
                                        renderInput={(params) => (
                                            <FormField {...params} label="Device" InputLabelProps={{ shrink: true }} />
                                        )}
                                    /> */}

                                    <Autocomplete
                                        defaultValue=""
                                        readOnly
                                        options={statusDevice}
                                        getOptionLabel={(option) => (option.attributes ? option.attributes?.StatusType.status_name : "")}
                                        value={statusType ?? ""}
                                        renderInput={(params) => (
                                            <FormField {...params} label="Status" InputLabelProps={{ shrink: true }}  />
                                        )}
                                    />    

                                    {/* <Autocomplete
                                        multiple
                                        readOnly
                                        defaultValue={selectedParameters}
                                        options={deviceParameters}
                                        getOptionLabel={(option) => (option ? option.label : "")}
                                        value={selectedParameters}
                                        renderInput={(params) => (
                                            <FormField {...params} label="Parameter" InputLabelProps={{ shrink: true }}  />
                                        )}
                                    />     */}
                                  
                                    <MDBox mt={3}>
                                        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Tabs">
                                            <Tab label="Logs" />
                                            <Tab label="Devices" />
                                            <Tab label="Parameters" />
                                            <Tab label="Thresholds" />
                                        </Tabs>

                                        {selectedTab === 0 && (
                                            <>
                                            <MDButton 
                                                variant="gradient"
                                                color="dark"
                                                size="small"
                                                px={2}
                                                mx={2}
                                                onClick={handleRefreshLog}
                                            >
                                            Refresh        
                                            </MDButton>
                                            {
                                                deviceParameterValues.length > 0 &&
                                                <DataTable table={tableLogData(deviceParameterValues)} canSearch={true} />
                                            }
                                            </>
                                        )}

                                        {selectedTab === 1 && (
                                            <>
                                            {
                                                device.length > 0 &&
                                                <DataTable table={tableDeviceData} canSearch={true} />
                                            }
                                            </>
                                        )}

                                        {selectedTab === 2 && (
                                            <>
                                            {
                                                selectedParameters.length > 0 && 
                                                <DataTable table={tableParameterData} canSearch={true} />
                                            }
                                            </>
                                        )}

                                        {selectedTab === 3 && (
                                            <>
                                            {
                                                selectedThresholds.length > 0 && 
                                                <DataTable table={tableThresholdData} canSearch={true} />
                                            }
                                            </>
                                        )}

                                    </MDBox>
                                    <Modal
                                        open={open}
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
                                                border: '2px solid #000',
                                                boxShadow: 24,
                                                p: 4,
                                                maxHeight: '70vh', // Set max height to enable scrolling
                                                overflowY: 'auto',    
                                                overflowX: 'hidden'                                          
                                            }}
                                        >
                                            <DynamicDataTable ParameterData={paramTableData} />
                                        </Card>
                                    </Modal>
                                    <MDBox ml="auto" mt={4} mb={2} display="flex" justifyContent="flex-end">
                                        <MDBox mx={2}>
                                            <MDButton
                                            variant="gradient"
                                            color="dark"
                                            size="small"
                                            px={2}
                                            mx={2}
                                            onClick={() =>
                                                    navigate("/monitor-management", {
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

export default ViewMonitorDevice;
