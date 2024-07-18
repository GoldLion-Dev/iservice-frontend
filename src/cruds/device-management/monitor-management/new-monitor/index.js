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
import { Autocomplete, Tooltip, IconButton, Badge, Typography, CardContent } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDEditor from "components/MDEditor";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import FormField from "layouts/applications/wizard/components/FormField";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";

import CrudService from "services/cruds-service";
import { MODULE_MASTER } from "utils/constant";
import DataTable from "examples/Tables/DataTable";
import ModalMultiSelect from "../select-device";
import Scrollbar from 'react-perfect-scrollbar'; // Import Scrollbar component
import { Popover, List, ListItem, ListItemText } from '@mui/material';
import { MESSAGE_TEMPLATE_VARIABLES } from "utils/constant";

const NewMonitorDevice = () => {
    const navigate = useNavigate();

    const [name, setName] = useState({
        text: "",
        error: false,
        textError: "",
    });
    const [frequency, setfrequency] = useState({
        text: "",
        error: false,
        textError: "",
    });    
    const [timeUnit, setTimeUnit] = useState("Hour");
    const [device, setDevice] = useState([]);
    const [devices, setDevices] = useState([]);
    const [tempDevices, setTempDevices] = useState([]);     // this is to dispaly temp in data table of modal
    const [comparisonOperators, setComparisonOperators] = useState([]);
    const [thresholdTypes, setThresholdTypes] = useState([]);
    const [alertTypes, setAlertTypes] = useState([]);
    const [messageTemplates, setMessageTemplates] = useState([]);

    const [deviceParameters, setDeviceParameters] = useState([]);
    const [tempDeviceThresholds, setTempDeviceThresholds] = useState([]);       // temp data to be displayed in data table of modal
    const [selectedThresholds, setSelectedThresholds] = useState([]);

    const [tempDeviceParameters, setTempDeviceParameters] = useState([]);       // temp data to be displayed in data table of modal
    const [selectedParameters, setSelectedParameters] = useState([]);

    const [statusType, setStatusType] = useState([]);
    const [statusDevice, setStatusDevice] = useState([]);

    const [selectedDeviceRows, setSelectedDeviceRows] = useState([]);
    const [selectedThreRows, setSelectedThreRows] = useState([]);
    const [selectedParameterRows, setSelectedParameterRows] = useState([]);

    const [alertContent, setAlertContent] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const variables = MESSAGE_TEMPLATE_VARIABLES;
    
    useEffect(() => {
        (async () => {
        try {
            const response = await CrudService.getInternalRestDevices();
            setDevices(response.data);
            setTempDevices(response.data);
        } catch (err) {
            console.error(err);
            return null;
        }
        })();

        (async () => {
            try {
            const response = await CrudService.getStatusTypes(MODULE_MASTER.DEVICES);
            setStatusDevice(response.data);
            setStatusType(response.default_id);
            } catch (err) {
            console.error(err);
            return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getDeviceParameters();
                // const parametersWithSelectAll = [
                //     { label: "Select All", value: "all" },
                //     ...response.data
                // ];
                setDeviceParameters(response.data);
                setTempDeviceParameters(response.data)
                setTempDeviceThresholds(response.data.filter(item => item.is_threshold_required === true));

                console.log(response.data, 'response.data')
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
                const response = await CrudService.getAlertTypes();
                setAlertTypes(response.data);
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getMessages();
                setMessageTemplates(response.data);
                console.log(response.data, 'response.data')
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getComparisonOperators();
                setComparisonOperators(response.data);
            } catch (err) {
                console.error(err);
                return null;
            }
        })();
    }, []);

    useEffect(() => {
        const filteredDevices = devices.filter(device => selectedDeviceRows.includes(device.id));
        const updatedDevice = [...device, ...filteredDevices];
        setDevice(updatedDevice);

        const restDevices = devices.filter(param => !updatedDevice.some(updatedDevice => updatedDevice.device_id === param.id));
        setTempDevices(restDevices);
    }, [selectedDeviceRows]);

    useEffect(() => {
        const filteredThresholds = deviceParameters.filter(param => selectedThreRows.includes(param.parameter_id));
        const updatedThresholds = [...selectedThresholds, ...filteredThresholds];
        setSelectedThresholds(updatedThresholds);

        const restThresholds = deviceParameters.filter(threshold => !updatedThresholds.some(updatedThreshold => updatedThreshold.parameter_id === threshold.parameter_id));
        setTempDeviceThresholds(restThresholds);
    }, [selectedThreRows]);

    useEffect(() => {
        const filteredParams = deviceParameters.filter(param => selectedParameterRows.includes(param.parameter_id));
        const updatedParameters = [...selectedParameters, ...filteredParams];
        setSelectedParameters(updatedParameters);

        const restParams = deviceParameters.filter(param => !updatedParameters.some(updatedParam => updatedParam.parameter_id === param.parameter_id));
        setTempDeviceParameters(restParams);
    }, [selectedParameterRows]);

    const changeNameHandler = (e) => {
        setName({ ...name, text: e.target.value });
    };

    const changeFrequencyHandler = (e) => {
        setfrequency({ ...frequency, text: e.target.value });
    };

    const handleVariableInsertion = (variable) => {
        setAlertContent((prevContent) => `${prevContent}{${variable}}`); // Wrap the variable with '#' symbols

        setAnchorEl(null);
    };

    const handleEditorChange = (value) => {
        if(value.includes('#')) {
            setAnchorEl(document.activeElement);
            return;
        }
        setAlertContent(value);
        // Check if the content includes '#' to show the variable list
    };

    const removeParameter = (index) => {
        const updatedParameters = [...selectedParameters];
        updatedParameters.splice(index, 1);
        setSelectedParameters(updatedParameters);
        
        const restParams = deviceParameters.filter(param => !updatedParameters.some(updatedParam => updatedParam.parameter_id === param.parameter_id));
        setTempDeviceParameters(restParams);
    }

    const removeThreshold = (index) => {
        const updatedThresholds = [...selectedThresholds];
        updatedThresholds.splice(index, 1);
        setSelectedThresholds(updatedThresholds);
        
        const restParams = deviceParameters.filter(threshold => !updatedThresholds.some(updatedParam => updatedParam.parameter_id === threshold.parameter_id));
        setTempDeviceThresholds(restParams);
    }

    const removeDevice = (index) => {
        const updatedDevice = [...device]
        updatedDevice.splice(index, 1);
        setDevice(updatedDevice);

        const restDevices = devices.filter(param => !updatedDevice.some(updatedDevice => updatedDevice.device_id === param.device_id));
        setTempDevices(restDevices);
    }

    const handleMsgModalOpen = (index) => {
        const updatedDataTable = [...selectedThresholds];
        updatedDataTable[index].alertModalOpen = true;
        setSelectedThresholds(updatedDataTable);
        setAlertContent(updatedDataTable[index].alert_content);
    };

    const handleMsgModalClose = (index) => {
        const updatedDataTable = [...selectedThresholds];
        updatedDataTable[index].alertModalOpen = false;
        setSelectedThresholds(updatedDataTable);
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
                                options={thresholdTypes}
                                getOptionLabel={(option) => (option ? option.threshold_name : "")}
                                onChange={(event, NewThresholdType) => {
                                    handlethresholdTypeChange(index, NewThresholdType);
                                }}
                                style={{ width: "140px" }}  
                                renderInput={(params) => (
                                    <FormField {...params} label="Type" InputLabelProps={{ shrink: true }} required />
                                )}
                            />
                        ),
                        threshold_value: (
                            <MDBox>
                                <FormField
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    value={row.threshold_value}
                                    label="Value"
                                    onChange={(e) => handlethresholdValueChange(index, e.target.value)}
                                />
                                {row?.validationError && <div style={{ color: 'red' }}>{row?.validationError}</div>}
                            </MDBox>
                        ),    
                        comparison_operator: (
                            <Autocomplete
                                defaultValue={row.ComparisonOperator || null}
                                options={comparisonOperators}
                                getOptionLabel={(option) => (option ? option.comparison_operator : "")}
                                onChange={(event, NewComparisonOperator) => {
                                    handleThresholdOperatorChange(index, NewComparisonOperator);
                                }}
                                style={{ width: "80px" }}  
                                renderInput={(params) => (
                                    <FormField {...params} label="Operator" InputLabelProps={{ shrink: true }} required />
                                )}
                            />
                        ),
                        alert_type: (
                            <Autocomplete
                                defaultValue={row?.AlertType || null}
                                options={alertTypes}
                                getOptionLabel={(option) => (option ? option.type_name : "")}
                                onChange={(event, NewAlertType) => {
                                    handleAlertTypeChange(index, NewAlertType);
                                }}
                                style={{ width: "140px" }}  
                                renderInput={(params) => (
                                    <FormField {...params} label="Alert Type" InputLabelProps={{ shrink: true }} required />
                                )}
                            />
                        ),
                        alert_content: (
                            <MDBox key={row.parameter_id}>
                                <MDButton onClick={() => handleMsgModalOpen(index)}>Alert Content</MDButton>                                
                                <Modal
                                        open={row.alertModalOpen ?? false}
                                        onClose={() => handleMsgModalClose(index)}
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
                                        }}
                                    >
                                        <CardContent>
                                            <Typography>Alert Content </Typography>

                                            <Autocomplete
                                                defaultValue={row?.MessageTemplate || null}
                                                options={messageTemplates}
                                                getOptionLabel={(option) => (option.attributes ? option.attributes.name : "")}
                                                onChange={(event, NewEntity) => {
                                                    if(NewEntity)
                                                        setAlertContent(NewEntity.attributes.content);
                                                    else
                                                        setAlertContent([]);
                                                    handleMessageTemplateChange(index, NewEntity);
                                                }}
                                                style={{ marginBottom: '10px' }}  
                                                renderInput={(params) => (
                                                    <FormField {...params} label="Message Template" InputLabelProps={{ shrink: true }} required />
                                                )}
                                            />

                                            <MDEditor value={alertContent} onChange={handleEditorChange} style={{
                                                maxHeight: '60vh', // Set max height to enable scrolling
                                                overflowY: 'auto',    
                                                overflowX: 'hidden'                                                                    
                                            }}/>

<Popover
                                                open={Boolean(anchorEl)}
                                                anchorEl={anchorEl}
                                                onClose={() => setAnchorEl(null)}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                }}
                                            >
                                                <Scrollbar >
                                                    <List style={{ backgroundColor: 'white', overflowY: 'scroll', maxHeight: '200px' }}>
                                                        <MDTypography>Message Template Variables</MDTypography>
                                                        {variables.map((variable, index) => (
                                                            <ListItem key={index} button onClick={() => handleVariableInsertion(variable)} >
                                                                <ListItemText>
                                                                    <MDTypography variant="body2">* {variable}</MDTypography>
                                                                </ListItemText>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Scrollbar>
                                                <style>
                                                {`
                                                /* CSS to hide the ps__rail-y div */
                                                .ps__rail-y {
                                                    display: none !important;
                                                }

                                                /* CSS to set the height of ps__rail-y to 0 */
                                                .ps__rail-y {
                                                    height: 0 !important;
                                                }
                                                `}
                                                </style>
                                            </Popover>
                                            <MDBox ml="auto" mt={3} display="flex" justifyContent="flex-end">
                                                <MDButton variant="contained" color="secondary" onClick={() => handleMsgModalClose(index)}>
                                                    Cancel
                                                </MDButton>
                                                <MDButton variant="contained" color="info" onClick={() => handleAlertValueChange(index, alertContent)} style={{marginLeft: '10px'}}>
                                                    Save
                                                </MDButton>
                                            </MDBox>
                                        </CardContent>
                                    </Card>
                                </Modal>
{/*                                 
                                <FormField
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    value={row.alert_content}
                                    label="Alert Content"
                                    onChange={(e) => handleAlertValueChange(index, e.target.value)}
                                /> */}
                            </MDBox>
                        ),    
                        alert_enabled: (
                            <Checkbox
                                checked={row?.alert_enabled}
                                onChange={(e) => handlealertEnabledChange(index, e.target.checked)}
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
            { Header: "Alert Type", accessor: "alert_type" },
            { Header: "Alert Content", accessor: "alert_content" },
            {
                Header: "Alert Enabled",
                accessor: 'alert_enabled'
            },
            {
                Header: "actions",
                disableSortBy: true,
                accessor: "",
                Cell: (info) => {
                  return (
                    <MDBox display="flex" alignItems="center">
                      {(
                        <Tooltip title="Delete Parameter">
                          <IconButton onClick={() => removeThreshold(info.cell.row.index)}>
                            <MDTypography><DeleteIcon /></MDTypography>
                          </IconButton>
                        </Tooltip>
                      )}
                    </MDBox>
                  );
                },
            }
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
            {
                Header: "actions",
                disableSortBy: true,
                accessor: "",
                Cell: (info) => {
                  return (
                    <MDBox display="flex" alignItems="center">
                      {(
                        <Tooltip title="Delete Parameter">
                          <IconButton onClick={() => removeParameter(info.cell.row.index)}>
                            <MDTypography><DeleteIcon /></MDTypography>
                          </IconButton>
                        </Tooltip>
                      )}
                    </MDBox>
                  );
                },
            }
        ],
        rows: getParameterRows(selectedParameters),
    };

    const getDeviceRows = (info) => {
        let updatedInfo = info.map((row) => {
            return {
                id: row.attributes?.device_id,
                status: row.attributes?.StatusOption,
                name: row.attributes?.name,
                type: row.attributes?.DeviceType?.type_name,
                brand: row.attributes?.DeviceBrand?.brand_name,
                model: row.attributes?.DeviceModel?.model_name,
                entity: row.attributes?.EntityAddressItem?.Entity?.name,
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
          {
            Header: "actions",
            disableSortBy: true,
            accessor: "",
            Cell: (info) => {
              return (
                <MDBox display="flex" alignItems="center">
                    <Tooltip title="Delete Device">
                        <IconButton onClick={() => removeDevice(info.cell.row.index)}>
                            <MDTypography><DeleteIcon /></MDTypography>
                        </IconButton>
                    </Tooltip>
                </MDBox>
              );
            },
          },
        ],
    
        rows: getDeviceRows(device),
    };

    const getParamRows = (info) => {
        let updatedInfo = info.map((row) => {
            return {
                id: row.parameter_id,
                name: row.label,
                type: row.FieldType?.name,
            };
        });
        return updatedInfo;
    }
    
    const validateInput = (field_type_id, value) => {
        switch (field_type_id) {
            case 2:
                if (!Number.isInteger(parseInt(value, 10))) {
                    return 'Value must be an integer';
                }
                break;
            case 3:
                if (!/^-?\d+\.\d+$/.test(value)) {
                    return 'Value must be a float';
                }
                break;
            case 4:
                if (!['true', 'false', '1', '0'].includes(value.toLowerCase())) {
                    return 'Value must be a boolean (true/false or 1/0)';
                }
                break;
            case 5:
                if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    return 'Value must be a valid date (YYYY-MM-DD)';
                }
                break;
            case 6:
                if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
                    return 'Value must be a valid datetime (YYYY-MM-DD HH:MM:SS)';
                }
                break;
            case 7:
                if (!/^\d{10}$/.test(value)) {
                    return 'Value must be a valid timestamp (10 digits)';
                }
                break;
            case 8:
                if (value.length > 255) {
                    return 'Value must be less than or equal to 255 characters';
                }
                break;
            case 9:
                // Add specific validation logic for list type
                if(!Array.isArray(value)) {
                    return 'Value must be list';
                }
                break;
            default:
                // No specific validation for other field types
                return null;
        }

        // If validation passes
        return null;
    };
    
    const handlethresholdTypeChange = (index, NewThresholdType) => {
        const updatedDataTable = [...selectedThresholds];
        updatedDataTable[index].threshold_type_id = NewThresholdType?.id;
        setSelectedThresholds(updatedDataTable);
    };

    const handlethresholdValueChange = (index, value) => {
        const updatedDataTable = [...selectedThresholds];
        updatedDataTable[index].threshold_value = value;
        setSelectedThresholds(updatedDataTable);
    };

    const handleThresholdOperatorChange = (index, NewComparisonOperator) => {
        const updatedDataTable = [...selectedThresholds];
        updatedDataTable[index].comparison_operator_id = NewComparisonOperator?.id;
        setSelectedThresholds(updatedDataTable);
    };

    const handleAlertTypeChange = (index, NewAlertType) => {
        const updatedDataTable = [...selectedThresholds];
        updatedDataTable[index].alert_type_id = NewAlertType?.alert_type_id;
        setSelectedThresholds(updatedDataTable);
    };

    const handleMessageTemplateChange = (index, NewEntity) => {
        const updatedDataTable = [...selectedThresholds];
        updatedDataTable[index].message_template_id = NewEntity?.attributes?.id;
        updatedDataTable[index].MessageTemplate = NewEntity;
        setSelectedThresholds(updatedDataTable);
    };

    const handleAlertValueChange = (index, value) => {
        const updatedDataTable = [...selectedThresholds];
        updatedDataTable[index].alert_content = value;
        updatedDataTable[index].alertModalOpen = false;
        console.log(updatedDataTable, 'updatedDataTable')
        setSelectedThresholds(updatedDataTable);
    };

    const handlealertEnabledChange = (index, value) => {
        const updatedDataTable = [...selectedThresholds];
        updatedDataTable[index].alert_enabled = value;
        setSelectedThresholds(updatedDataTable);
    };
    
    const submitHandler = async (e) => {
        e.preventDefault();
        let hasValidationError = false;
        const updatedSelectedThresholds = [...selectedThresholds];
        updatedSelectedThresholds.forEach(updatedSelectedThreshold => {
            const validError = validateInput(updatedSelectedThreshold?.field_type_id, updatedSelectedThreshold?.threshold_value)
            updatedSelectedThreshold.validationError = validError;
            if (validError) {
                hasValidationError = validError;
                return;
            }    
        })

        setSelectedThresholds(updatedSelectedThresholds);

        if(hasValidationError)
            return;
        const monitor = {
            data: {
                type: "monitors",
                attributes: {
                    name: name.text,
                    frequency: frequency.text,
                    devices: device,
                    timeUnit: timeUnit,
                    statusType: statusType?.attributes,
                    deviceParameters: selectedParameters,
                    deviceParameterThresholds: selectedThresholds
                }
            },
        };
        console.log(monitor, 'monitor')
        try {
            await CrudService.createDeviceMonitor(monitor);
            navigate("/monitor-management", {
                state: { value: true, text: "The device was successfully created" },
            });
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mt={5} mb={9}>
                <Grid container justifyContent="center">
                    <Grid item xs={12} lg={8}>
                        <MDBox mt={6} mb={8} textAlign="center">
                            <MDBox mb={1}>
                                <MDTypography variant="h3" fontWeight="bold">
                                Add New Device Monitor
                                </MDTypography>
                            </MDBox>
                            <MDTypography variant="h5" fontWeight="regular" color="secondary">
                                This information will describe more about the Device Monitor.
                            </MDTypography>
                        </MDBox>
                        <Card>
                            <MDBox component="form" method="POST" onSubmit={submitHandler}>
                                <MDBox display="flex" flexDirection="column" px={3} my={2}>
                                    <MDBox p={1}>
                                        <FormField
                                            type="text"
                                            label="Name"
                                            name="name"
                                            value={name.text || ""}
                                            onChange={changeNameHandler}
                                            InputLabelProps={{ shrink: true }}
                                            error={name.error}
                                        />
                                        {name.error && (
                                        <MDTypography variant="caption" color="error" fontWeight="light">
                                            {name.textError}
                                        </MDTypography>
                                        )}
                                    </MDBox>

                                    <MDBox  p={1} display="flex" alignItems="center">
                                        <FormField
                                            type="text"
                                            label="frequency"
                                            name="frequency"
                                            value={frequency.text || ""}
                                            onChange={changeFrequencyHandler}
                                            error={frequency.error}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <MDBox style={{ marginLeft: '10px' }}>
                                            <Autocomplete
                                                options={["Hour", "Minute", "Second"]}
                                                getOptionLabel={(option) => (option ? option : "")}
                                                onChange={(event, newUnit) => {
                                                    setTimeUnit(newUnit);
                                                }}
                                                value={timeUnit}
                                                style={{width: '120px'}}
                                                renderInput={(params) => (
                                                    <FormField {...params} label="Time Unit" InputLabelProps={{ shrink: true }} />
                                                )}
                                            />
                                        </MDBox>
                                        {frequency.error && (
                                        <MDTypography variant="caption" color="error" fontWeight="light">
                                            {frequency.textError}
                                        </MDTypography>
                                        )}
                                    </MDBox>
                                    
                                    <Autocomplete
                                        defaultValue=""
                                        options={statusDevice}
                                        getOptionLabel={(option) => (option.attributes ? option.attributes?.StatusType.status_name : "")}
                                        value={statusType ?? ""}
                                        onChange={(event, newStatus) => {
                                            setStatusType(newStatus);
                                        }}
                                        renderInput={(params) => (
                                            <FormField {...params} label="Status" InputLabelProps={{ shrink: true }}  />
                                        )}
                                    />   
                                    
                                    <ModalMultiSelect rowData={getDeviceRows(tempDevices)} selectedRows={selectedDeviceRows} setSelectedRows={setSelectedDeviceRows} label="Devices"/>                                    
                                    <DataTable table={tableDeviceData} canSearch={true} />

                                    <ModalMultiSelect rowData={getParameterRows(tempDeviceParameters)} selectedRows={selectedParameterRows} setSelectedRows={setSelectedParameterRows} label="Parameters"/>                                    
                                    <DataTable table={tableParameterData} canSearch={true} />
                                    
                                    <ModalMultiSelect rowData={getParamRows(tempDeviceThresholds)} selectedRows={selectedThreRows} setSelectedRows={setSelectedThreRows} label="Thresholds"/>
                                    <DataTable table={tableThresholdData} canSearch={true} />

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
                                        <MDButton variant="gradient" color="dark" size="small" type="submit">
                                            Save
                                        </MDButton>
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

export default NewMonitorDevice;
