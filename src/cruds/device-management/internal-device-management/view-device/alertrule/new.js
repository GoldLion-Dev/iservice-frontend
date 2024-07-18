import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import CrudService from "services/cruds-service";
import { MODULE_MASTER } from 'utils/constant';

// const alertTypes = [
//     { id: 1, name: 'Low Battery', description: 'Indicates the device battery is low' },
//     { id: 4, name: 'Connectivity Issue', description: 'Indicates problems with device connectivity' },
//     { id: 5, name: 'High Tank Level', description: null },
//     { id: 6, name: 'Wifi Signal Low', description: null },
//     { id: 7, name: 'Temperature Alert', description: 'Alert triggered when device temperature is out of the normal operating range.' }
// ];

// const eventTypes = [
//     { id: 14, name: 'send_email', description: 'Send Email' },
//     { id: 15, name: 'send_sms', description: 'Send SMS' }
// ];

// const sendToTypes = [
//     { id: 1, name: "Entity" },
//     { id: 2, name: "Provider" }
// ];

// const entityContacts = [
//     { id: 1, name: "John Doe" },
//     { id: 2, name: "Jane Smith" }
// ];

// const providerContacts = [
//     { id: 3, name: "Provider A" },
//     { id: 4, name: "Provider B" }
// ];

// Placeholder for FormField component
const FormField = ({ type, label, name, value, onChange, error, ...props }) => (
    <TextField
        type={type}
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        error={!!error}
        helperText={error}
        fullWidth
        margin="normal"
        {...props}
    />
);

const AlertRulesForm = React.memo(( {alertRule, setAlertRules, deviceId, setOpenViewModal} ) => {
    const [formData, setFormData] = useState({
        frequency: alertRule ? alertRule.frequency :  '',
        alert_type_id: alertRule ? alertRule.alert_type_id :  '',
        alert_sub_type_id: alertRule ? alertRule.alert_sub_type_id : '',
        event_type_id: alertRule ? alertRule.event_type_id : '',
        send_to_type_id: alertRule ? alertRule.send_to_type_id : '',
        address_id: alertRule ? alertRule.address_id : '',
        status_type_id: alertRule ? alertRule.status_type_id : '',
        device_id: alertRule ? alertRule.device_id : deviceId
    });

    const [contacts, setContacts] = useState([]);
    const [originalContacts, setOriginalContacts] = useState([]);
    
    const [alertTypes, setAlertTypes] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    const [sendToTypes, setSendToTypes] = useState([]);
    const [alertSubTypes, setAlertSubTypes] = useState([]);
    const [originalAlertSubTypes, setOriginalAlertSubTypes] = useState([]);
    const [entityContacts, setEntityContacts] = useState([]);
    const [originalEntityContacts, setOriginalEntityContacts] = useState([]);
    const [providerContacts, setProviderContacts] = useState([]);
    const [originalProviderContacts, setOriginalProviderContacts] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resAlertTypes = await CrudService.getAlertTypes();
                setAlertTypes(resAlertTypes.data);
                    
                const resEventTypes = await CrudService.getEventTypes();
                setEventTypes(resEventTypes.data);
    
                const resSendToTypes = await CrudService.getSendToTypes();
                setSendToTypes(resSendToTypes.data);

                const resAlertSubTypes = await CrudService.getAlertSubTypes();
                setAlertSubTypes(resAlertSubTypes.data);
                setOriginalAlertSubTypes(resAlertSubTypes.data);
    
                const resEntityContacts = await CrudService.getEntityContacts(deviceId);
                setEntityContacts(resEntityContacts.data);
                setOriginalEntityContacts(resEntityContacts.data);
    
                const resProviderContacts = await CrudService.getProviderContacts(deviceId);
                setProviderContacts(resProviderContacts.data);
                setOriginalProviderContacts(resProviderContacts.data)

                const resStatus = await CrudService.getStatusTypes(MODULE_MASTER.ALERTRULE);
                setStatusOptions(resStatus.data.map(item => item.attributes));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [deviceId]);

    useEffect(() => {
        // Populate contacts based on send_to_type_id
        if (formData.send_to_type_id === 3) {
            if (formData.event_type_id === 15) setContacts(originalEntityContacts.filter(item => item.ContactAddress?.address_type_id === 1))
            else if (formData.event_type_id === 14) setContacts(originalEntityContacts.filter(item => item.ContactAddress?.address_type_id === 2))
        } else if (formData.send_to_type_id === 2) {
            if (formData.event_type_id === 15) setContacts(originalProviderContacts.filter(item => item.ContactAddress?.address_type_id === 1))
            else if (formData.event_type_id === 14) setContacts(originalProviderContacts.filter(item => item.ContactAddress?.address_type_id === 2))
        }
        console.log(formData, '--------form data------------')

    }, [formData.send_to_type_id, formData.event_type_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData, 'form')
        if (alertRule) {
            try {
                    await CrudService.editAlertRule(formData, alertRule?.rule_id);
                    setOpenViewModal(false);
                } catch (err) {
                    console.error(err);
                }
        } else {
            try {
                    await CrudService.createAlertRule(formData);
                    setOpenViewModal(false);
                } catch (err) {
                    console.error(err);
                }
        }
        const alertRulesRes = await CrudService.getAlertRules(deviceId);
        setAlertRules(alertRulesRes.data);
        // Handle form submission
    };

    return (
        <Container>
            <Typography variant="h4" component="h2" gutterBottom>
                {alertRule ? "Edit Alert Rule" : "Create Alert Rule"}
            </Typography>
            <MDBox component="form" method="POST" onSubmit={handleSubmit}>
                <FormField
                    type="text"
                    label="Frequency"
                    name="frequency"
                    defaultValue={alertRule ? alertRule.frequency : ""}
                    onChange={(e) => {
                        setFormData({ ...formData, frequency: e.target.value ? e.target.value : '' });
                    }}
                />
                
                <Autocomplete
                    options={alertTypes}
                    defaultValue={alertRule ? alertRule.AlertType : null}
                    getOptionLabel={(option) => option.type_name}
                    onChange={(event, newValue) => {
                        setFormData({ ...formData, alert_type_id: newValue ? newValue.alert_type_id : '' });
                        // let sortedSubTypes = originalAlertSubTypes.filter(item => item.alerty_type_id === newValue.alerty_type_id);
                        let sortedSubTypes = originalAlertSubTypes.filter((item) => item.alert_type_id === newValue.alert_type_id);
                        console.log(sortedSubTypes, newValue, 'sortedSubTypes')
                        setAlertSubTypes(sortedSubTypes);
                    }}
                    renderInput={(params) => (
                        <FormField {...params} label="Alert Type" InputLabelProps={{ shrink: true }} />
                    )}
                />
                <Autocomplete
                    options={statusOptions}
                    defaultValue={alertRule ? alertRule?.StatusOption : null}
                    getOptionLabel={(option) => option?.StatusType?.status_name}
                    onChange={(event, newValue) => {
                        console.log(newValue, 'status')
                        setFormData({ ...formData, status_type_id: newValue ? newValue?.StatusType?.status_type_id : '' });
                    }}
                    renderInput={(params) => (
                        <FormField {...params} label="Status Type" InputLabelProps={{ shrink: true }} />
                    )}
                />  

                <Autocomplete
                    options={alertSubTypes}
                    defaultValue={alertRule ? alertRule.AlertSubType : null}
                    getOptionLabel={(option) => option?.sub_type_name}
                    onChange={(event, newValue) => {
                        setFormData({ ...formData, alert_sub_type_id: newValue ? newValue?.alert_sub_type_id : '' });
                    }}
                    renderInput={(params) => (
                        <FormField {...params} label="Alert Sub Type" InputLabelProps={{ shrink: true }} />
                    )}
                />  

                <Autocomplete
                    options={sendToTypes}
                    defaultValue={alertRule ? alertRule.SendToType : null}
                    getOptionLabel={(option) => option.send_to_type_name}
                    onChange={(event, newValue) => {
                        setFormData({ ...formData, send_to_type_id: newValue ? newValue.send_to_type_id : '' });
                    }}
                    renderInput={(params) => (
                        <FormField {...params} label="Send To Type" InputLabelProps={{ shrink: true }} />
                    )}
                />              
                <Autocomplete
                    options={eventTypes}
                    defaultValue={alertRule ? alertRule.EventType : null}
                    getOptionLabel={(option) => option.description}
                    onChange={(event, newValue) => {
                        setFormData({ ...formData, event_type_id: newValue ? newValue.id : '' });
                    }}
                    renderInput={(params) => (
                        <FormField {...params} label="Event Type" InputLabelProps={{ shrink: true }} />
                    )}
                />                
                <Autocomplete
                    options={contacts}
                    defaultValue={alertRule ? alertRule : null}
                    // getOptionLabel={(option) => option.ContactAddress?.contact_address}
                    getOptionLabel={(option) => `${option.Contact?.first_name} ${option.Contact?.last_name} - ${option.ContactAddress?.contact_address}`}

                    onChange={(event, newValue) => {
                        setFormData({ ...formData, address_id: newValue ? newValue.ContactAddress?.contact_address_id : '' });
                    }}
                    renderInput={(params) => (
                        <FormField {...params} label="Contact" InputLabelProps={{ shrink: true }} />
                    )}
                />
                <MDBox ml="auto" mt={3} display="flex" justifyContent="flex-end">
                    <MDButton onClick={() => setOpenViewModal(false)} color="secondary">
                        Close
                    </MDButton>
                    <MDButton type="submit" style={{ backgroundColor: 'blue', color: 'white', marginLeft: '10px' }}>
                        {alertRule ? "Save Alert Rule" : "Add Alert Rule"}
                    </MDButton>
                </MDBox>
            </MDBox>

        </Container>
    );
});

export default AlertRulesForm;
