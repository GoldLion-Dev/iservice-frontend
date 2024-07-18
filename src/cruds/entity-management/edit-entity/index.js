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

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import FormField from "layouts/applications/wizard/components/FormField";
import { useNavigate,useParams } from "react-router-dom";
import { Autocomplete, Menu, MenuItem } from "@mui/material";
import { MODULE_MASTER } from "utils/constant"
import CrudService from "services/cruds-service";
import ModalModuleAddress from "../add-module";
import { ToastContainer, toast } from 'react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import ModalContact from "../add-contact";
import ModalSelectContact from "../add-contact/select";

const EditEntity = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState({
        text: "",
        error: false,
        textError: "",
    });

    const [error, setError] = useState({
        name: false,
        firstName: false,
        lastName: false,
        company: false,
        error: false,
        textError: "",
    });
    
    const [entity, setEntity] = useState("");
    const [company, setCompany] = useState("");
    const [companies, setCompanies] = useState([]);
    const [addressTypes, setAddressTypes] = useState([]);
    const [entityType, setEntityType] = useState([]);
    const [entityTypes, setEntityTypes] = useState([]);
    const [statusAddress, setStatusAddress] = useState([]);
    const [statusType, setStatusType] = useState([]);
    const [statusEntity, setStatusEntity] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedId, setSelectedId] = useState(0);
    const [items, setItems] = useState([]);
    const [attributeValue, setAttributeValue] = useState([]);
    const [module, setModule] = useState([]);
  
      ///////////////// contact addresss ////////////////
    const [contactType, setContactType] = useState([]);
    const [contactStatusType, setContactStatusType] = useState([]);
    const [statusContact, setStatusContact] = useState([]);
    const [phoneAddresses, setPhoneAddresses] = useState([]);
    const [emailAddresses, setEmailAddresses] = useState([]);
    const [faxAddresses, setFaxAddresses] = useState([]);
    const [selectedPhoneId, setSelectedPhoneId] = useState(0);
    const [selectedEmailId, setSelectedEmailId] = useState(0);
    const [selectedFaxId, setSelectedFaxId] = useState(0);
    const [contacts, setContacts] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [openSelect, setOpenSelect] = useState(false);
    const [selectedContacts, setSelectedContacts] = useState([]);
    
    const [contact_first_name, setContactFirstName] = useState({
        text: "",
        error: false,
        textError: "",
    });
    const [contact_last_name, setContactLastName] = useState({
        text: "",
        error: false,
        textError: "",
    });

  // const [descError, setDescError] = useState(false);

    useEffect(() => {
        (async () => {
            try {
            const response = await CrudService.getEntityTypes();
            setEntityTypes(response.data);
            } catch (err) {
            console.error(err);
            return null;
            }
        })();
        (async () => {
            try {
            const response = await CrudService.getCompanies();
            setCompanies(response.data);
            } catch (err) {
            console.error(err);
            return null;
            }
        })();
        (async () => {
        try {
            const response = await CrudService.getAddressTypes();
            setAddressTypes(response.data);
        } catch (err) {
            console.error(err);
            return null;
        }
        })();
        (async () => {
            const response = await CrudService.getContacts();
            setContacts(response.data);
        })();
        (async () => {
        try {
            const response = await CrudService.getStatusTypes(MODULE_MASTER.ADDRESS);
            setStatusAddress(response.data);
        } catch (err) {
            console.error(err);
            return null;
        }
        })();

        (async () => {
            try {
            const response = await CrudService.getStatusTypes(MODULE_MASTER.ENTITIES);
            setStatusEntity(response.data);
            } catch (err) {
            console.error(err);
            return null;
            }
        })();

        (async () => {
            const response = await CrudService.getItems();
            const formattedItems = response.data.map(element => {
              // Rename 'item_id' field to 'id' and include the existing 'id' field
              const { item_id, id, ...attributes } = element.attributes;
              return { id: item_id, ...attributes };
            });
            setItems(formattedItems);
        })();

    }, []);

    useEffect(() => {
        if (!id) return;
        (async () => {
        try {
            const res = await CrudService.getEntity(id);
            setEntity({
                id: res.data.attributes.entity_id,
                name: res.data.attributes?.name,
                firstName: res.data.attributes?.first_name,
                lastName: res.data.attributes?.last_name,
                company: res.data.attributes?.Company,
                entityType: res.data.attributes?.EntityType,
                statusType: res.data.attributes?.StatusType,
            });
            setCompany({attributes: res.data.attributes?.Company});
            setEntityType({attributes: res.data.attributes?.EntityType});
            setStatusType({attributes: {StatusType: res.data.attributes?.StatusOption?.StatusType}});
            setSelectedContacts(res.data.included?.contacts);
            const moduleLocations = res.data.included?.moduleLocations;
            if (moduleLocations) {
                const addresses = moduleLocations.map(location => location.Address);
                console.log(addresses, 'addresses')
                const defaultIndex = moduleLocations.findIndex(location => location.is_default === true)
                setAddresses(addresses);
                setSelectedId(defaultIndex);
            } else {
                // Handle the case where moduleLocations is null or undefined
                setAddresses([]);
            }
            // setAddresses(res.data.included?.moduleLocations);
        } catch (err) {
            console.error(err);
        }
        })();
    }, [id]);

    const changeNameHandler = (e) => {
        setCompany({ ...company, name: e.target.value });
    };

    const changeFirstNameHandler = (e) => {
        setCompany({ ...company, firstName: e.target.value });
    };

    const changeLastNameHandler = (e) => {
        setCompany({ ...company, lastName: e.target.value });
    };    

    const submitHandler = async (e) => {
        e.preventDefault();

        // let descNoTags = description.replace(/(<([^>]+)>)/gi, "");
        // if (descNoTags < 1) {
        //   setDescError(true);
        //   return;
        // }

        let hasInvalidAddress = false;

        addresses.forEach(address => {
        if(address.status_type_id === '') {
            toast.warning('Please set Status of Address!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            hasInvalidAddress = true; // Set the flag to true if an invalid address is found
            return;
        }
        if(address.address_type_id === '') {
            toast.warning('Please set Type of Address!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
            hasInvalidAddress = true
            return;
        }

        })

        if (hasInvalidAddress) {
            return;
        }
        console.log(selectedContacts, 'selectedContacts')
        let selectedContactIDs = selectedContacts.map(contact => contact?.attributes?.contact_id);
        
        const updatedEntity = {
            data: {
                type: "entities",
                attributes: {
                    name: entity.name,
                    first_name: entity.firstName,
                    last_name: entity.lastName,
                    company: company?.attributes,
                    entityType: entityType?.attributes,
                    statusType: statusType?.attributes,
                    addresses,
                    contact: {
                        contact_first_name: contact_first_name.text,
                        contact_last_name: contact_last_name.text,
                        contactType: contactType?.attributes,
                        contactStatusType: contactStatusType?.attributes,
                        phoneAddresses,
                        emailAddresses,
                        faxAddresses,
                        selectedPhoneID: selectedPhoneId,
                        selectedEmailID: selectedEmailId,
                        selectedFaxID: selectedFaxId  
                    },
                    selectedContactIDs: selectedContactIDs,    
                },
                selectedId: selectedId
            },
        };

        try {
        console.log(updatedEntity, 'updatedEntity')
        await CrudService.updateEntity(updatedEntity, id);
        navigate("/entity-management", {
            state: { value: true, text: "The entity was successfully Updated" },
        });
        } catch (err) {
        if (err.hasOwnProperty("errors")) {
            setName({ ...name, error: true, textError: err.errors[0].detail });
        }
        console.error(err);
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNewClick = () => {
        setAnchorEl(null);
        setOpen(true);
    };

    const handleSelectClick = () => {
        setAnchorEl(null);
        setOpenSelect(true);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleMenuClick = (event) => {
        // Prevent the menu from closing when clicking inside it
        event.stopPropagation();
    };
    

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ToastContainer/>

            <MDBox mb={9}>
                <Grid justifyContent="center">
                    <Grid item xs={12} lg={8}>
                        <MDBox textAlign="center">
                        <MDBox mb={1}>
                            <MDTypography variant="h3" fontWeight="bold">
                            Edit Entity {id}
                            </MDTypography>
                        </MDBox>
                        <MDTypography variant="h5" fontWeight="regular" color="secondary">
                            This information will describe more about the entity.
                        </MDTypography>
                        </MDBox>
                        <Card>
                        <MDBox component="form" method="POST" onSubmit={submitHandler}>
                            <MDBox display="flex" flexDirection="column" px={3} my={2}>
                            <MDBox p={1}>
                                <Autocomplete
                                    defaultValue=""
                                    options={entityTypes}
                                    getOptionLabel={(option) => (option.attributes ? option.attributes.type_name : "")}
                                    value={entityType ?? ""}
                                    onChange={(event, newEntityType) => {
                                        setEntityType(newEntityType);
                                    }}
                                    renderInput={(params) => (
                                        <FormField {...params} label="Entity Type" InputLabelProps={{ shrink: true }} required />
                                    )}
                                />
                                {entityType.attributes?.entity_type_id === 1 && (
                                    <>
                                        <FormField
                                            type="text"
                                            label="First Name"
                                            name="firstName"
                                            value={entity.firstName}
                                            onChange={changeFirstNameHandler}
                                            error={error.firstName}
                                        />
                                        {error.firstName && (
                                        <MDTypography variant="caption" color="error" fontWeight="light">
                                            {error.textError}
                                        </MDTypography>
                                        )}

                                        <FormField
                                            type="text"
                                            label="Last Name"
                                            name="lastName"
                                            value={entity.lastName}
                                            onChange={changeLastNameHandler}
                                            error={error.lastName}
                                        />
                                        {error.lastName && (
                                        <MDTypography variant="caption" color="error" fontWeight="light">
                                            {error.textError}
                                        </MDTypography>
                                        )}                                
                                    </>
                                )}    

                                
                                {entityType.attributes?.entity_type_id === 2 && (
                                    <>
                                        <FormField
                                            type="text"
                                            label="Name"
                                            name="name"
                                            value={entity.name}
                                            onChange={changeNameHandler}
                                            error={error.name}
                                        />
                                        {error.name && (
                                        <MDTypography variant="caption" color="error" fontWeight="light">
                                            {error.textError}
                                        </MDTypography>
                                        )}
                                    </>
                                )}    
                                
                                <Autocomplete
                                    defaultValue=""
                                    options={companies}
                                    getOptionLabel={(option) => (option.attributes ? option.attributes.name : "")}
                                    value={company ?? ""}
                                    onChange={(event, newCompany) => {
                                        setCompany(newCompany);
                                    }}
                                    renderInput={(params) => (
                                        <FormField {...params} label="Company" InputLabelProps={{ shrink: true }} required />
                                    )}
                                />  

                                <Autocomplete
                                    defaultValue=""
                                    options={statusEntity}
                                    getOptionLabel={(option) => (option.attributes ? option.attributes?.StatusType.status_name : "")}
                                    value={statusType ?? ""}
                                    onChange={(event, newStatus) => {
                                        setStatusType(newStatus);
                                    }}
                                    renderInput={(params) => (
                                        <FormField {...params} label="Status" InputLabelProps={{ shrink: true }} required />
                                    )}
                                />    
                                
                                {/* <Autocomplete
                                    required
                                    defaultValue=""
                                    options={statusEntity}
                                    getOptionLabel={(option) => (option ? option.attributes?.StatusType?.status_name : "")}
                                    style={{ marginTop: "1rem" }}
                                    onChange={(e) => {setStatusType(e.target.value); console.log(e.target, '_____')}}
                                    renderInput={(params) => (
                                    <FormField {...params} label="Status" InputLabelProps={{ shrink: true }} />
                                    )}
                                />                     */}
                            </MDBox>

                            <ModalModuleAddress addressTypes={addressTypes} statusOptions={statusAddress} addresses={addresses} setAddresses={setAddresses}  selectedId={selectedId} setSelectedId={setSelectedId} moduleData={items} moduleType="Item" attributeValue={attributeValue} setAttributeValue={setAttributeValue} module={module} setModule={setModule}/>
                            <Card>
                                <MDBox
                                display="flex" px={3} my={2}
                                >
                                    <MDTypography variant="h5" color="secondary"  fontWeight="bold">
                                    Contacts 
                                    </MDTypography>
                                    <MDButton variant="gradient" color="dark" size="small" style={{marginLeft: "1.8rem"}} onClick={handleClick}>
                                    + Add Contact
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                        onClick={handleMenuClick}
                                    >
                                        <MenuItem onClick={handleNewClick}>New Contact</MenuItem>
                                        <MenuItem onClick={handleSelectClick}>Select Contact(s)</MenuItem>
                                    </Menu>
                                    </MDButton>
                                </MDBox>
                                {
                                    <ModalContact
                                        open={open} setOpen={setOpen}
                                        contactType={contactType} setContactType={setContactType}
                                        contactStatusType={contactStatusType} setContactStatusType={setContactStatusType}
                                        statusContact={statusContact} setStatusContact={setStatusContact}
                                        phoneAddresses={phoneAddresses} setPhoneAddresses={setPhoneAddresses}
                                        emailAddresses={emailAddresses} setEmailAddresses={setEmailAddresses}
                                        faxAddresses={faxAddresses} setFaxAddresses={setFaxAddresses}
                                        selectedPhoneId={selectedPhoneId} setSelectedPhoneId={setSelectedPhoneId}
                                        selectedEmailId={selectedEmailId} setSelectedEmailId={setSelectedEmailId}
                                        selectedFaxId={selectedFaxId} setSelectedFaxId={setSelectedFaxId}
                                        contact_first_name={contact_first_name} setContactFirstName={setContactFirstName}
                                        contact_last_name={contact_last_name} setContactLastName={setContactLastName}
                                    />
                                }
                                {
                                    <ModalSelectContact
                                        open={openSelect} setOpen={setOpenSelect} contacts={contacts} selectedContacts={selectedContacts} setSelectedContacts={setSelectedContacts}
                                    />
                                }

                            </Card>
                            <MDBox ml="auto" mt={4} mb={2} display="flex" justifyContent="flex-end">
                                <MDBox mx={2}>
                                <MDButton
                                    variant="gradient"
                                    color="dark"
                                    size="small"
                                    px={2}
                                    mx={2}
                                    onClick={() =>
                                    navigate("/entity-management", {
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

export default EditEntity;
