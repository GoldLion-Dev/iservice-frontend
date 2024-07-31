import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import CrudService from "services/cruds-service";
import MDEditor from "components/MDEditor";

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

const ServiceRequestForm = React.memo(
    ({ device, setServiceModal }) => {
        const [formData, setFormData] = useState({
            entity_id: device?.EntityAddressItem?.Entity?.entity_id,
            address_id: device?.EntityAddressItem?.Address?.address_id,
            address_item_id: device?.EntityAddressItem?.address_item_id,
            provider_id: "",
            service_item_id: "",
            priority_id: "",
            description: "",
            request_date: ""
        });

        const [serviceItems, setServiceItems] = useState([]);
        const [providers, setProviders] = useState([]);
        const [priorities, setPriorities] = useState([]);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const serviceItemsResponse = await CrudService.getServiceItems();
                    setServiceItems(serviceItemsResponse.data);

                    const providersResponse = await CrudService.getProviders();
                    setProviders(providersResponse);

                    const prioritiessResponse = await CrudService.getPriorities();
                    setPriorities(prioritiessResponse.data);
                    /////////////////////
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }, [device]);
        
        const handleSubmit = async (e) => {
            e.preventDefault();
            console.log(formData, '=======formData=======')
            if (formData) {
                try {
                    await CrudService.createServiceRequest(formData);
                    setServiceModal(false);
                } catch (err) {
                    console.error(err);
                }
            }
        };

        
        return (
            <Container>
                <Typography variant="h4" component="h2" gutterBottom>
                    Service Request
                </Typography>
                <MDBox component="form" method="POST" onSubmit={handleSubmit}>
                    {/* Entity */}
                    <MDInput
                        fullWidth
                        sx={{ marginTop: "20px" }}
                        type="text"
                        label="Entity"
                        name="entity"
                        value={device?.EntityAddressItem?.Entity.name ? device?.EntityAddressItem?.Entity.name : device?.EntityAddressItem?.Entity.first_name + ' ' + device?.EntityAddressItem?.Entity.last_name }
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                entity_id: device?.EntityAddressItem?.Entity?.entity_id
                            });
                        }}
                        disabled={true}
                    />
                    {/* Address  */}
                    <MDInput
                        fullWidth
                        sx={{ marginTop: "20px" }}
                        type="text"
                        label="Address"
                        name="address"
                        value={device?.EntityAddressItem?.Address?.street_address1 + device?.EntityAddressItem?.Address?.street_addresss +  ' ' + device?.EntityAddressItem?.Address?.country +  ' ' + device?.EntityAddressItem?.Address?.city + ' ' + device?.EntityAddressItem?.Address?.state }
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                address_id: device?.EntityAddressItem?.Address?.address_id
                            });
                        }}
                        disabled={true}
                    />
                    {/* Address Item */}
                    <MDInput
                        fullWidth
                        sx={{ marginTop: "20px" }}
                        type="text"
                        label="Address Item"
                        name="address_item"
                        value={device?.EntityAddressItem?.name}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                address_item_id: device?.EntityAddressItem?.address_item_id
                            });
                        }}
                        disabled={true}
                    />
                    <Autocomplete
                        options={priorities}
                        getOptionLabel={(option) => option.priority_name}
                        onChange={(event, newValue) => {
                            setFormData({
                                ...formData,
                                priority_id: newValue.priority_id
                            });
                        }}
                        renderInput={(params) => (
                            <FormField
                                {...params}
                                label="Priority"
                                InputLabelProps={{ shrink: true }}
                            />
                        )}
                    />

                    <Autocomplete
                        options={serviceItems}
                        getOptionLabel={(option) => option.item_name}
                        onChange={(event, newValue) => {
                            setFormData({
                                ...formData,
                                service_item_id: newValue.item_id
                            });
                        }}
                        renderInput={(params) => (
                            <FormField
                                {...params}
                                label="Service Item"
                                InputLabelProps={{ shrink: true }}
                            />
                        )}
                    />
                    {/* Provider */}

                    <Autocomplete
                        options={providers}
                        getOptionLabel={(option) => option.provider_name}
                        onChange={(event, newValue) => {
                            setFormData({
                                ...formData,
                                provider_id: newValue
                                    ? newValue.provider_id
                                    : "",
                            });
                        }}
                        renderInput={(params) => (
                            <FormField
                                {...params}
                                label="Provider"
                                InputLabelProps={{ shrink: true }}
                            />
                        )}
                    />

                    {/* Description */}
                    <MDEditor
                        value={formData.description}
                        onChange={(value) => {
                            setFormData({
                                ...formData,
                                description: value,
                            });
                        }}
                    />


                    <FormField label="Request Date" type="date" InputLabelProps={{shrink: true}} value={formData.request_date} onChange={(event) => {
                        setFormData({
                            ...formData,
                            request_date: event.target.value,
                        });
                    }} />
                    {/* priority */}
                    <MDBox
                        ml="auto"
                        mt={3}
                        display="flex"
                        justifyContent="flex-end"
                    >
                        <MDButton
                            onClick={() => setServiceModal(false)}
                            color="secondary"
                        >
                            Close
                        </MDButton>
                        <MDButton
                            type="submit" 
                            style={{
                                backgroundColor: "blue",
                                color: "white",
                                marginLeft: "10px",
                            }}
                        >
                            Submit
                        </MDButton>
                    </MDBox>
                </MDBox>
            </Container>
        );
    }
);

export default ServiceRequestForm;
