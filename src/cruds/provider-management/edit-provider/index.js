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
import { Menu, MenuItem } from "@mui/material";
import CrudService from "services/cruds-service";
import { ToastContainer, toast } from 'react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import ModalContact from "cruds/entity-management/add-contact";
import ModalSelectContact from "cruds/entity-management/add-contact/select";

const EditProvider = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [services, setServices] = useState("");
    const [provider, setProvider] = useState();
    const [selectedId, setSelectedId] = useState(0);
  
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
            const response = await CrudService.getContacts();
            setContacts(response.data);
        })();
    }, []);

    useEffect(() => {
        if (!id) return;
        (async () => {
        try {
            const res = await CrudService.getProvider(id);
            console.log(res, 'res')
            setName(res.data.provider?.provider_name)
            const serviceLists = res.data.services;

            const servicesNames = serviceLists.map(service => service.service_name).join(', ');
            setServices(servicesNames);
            setSelectedContacts(res.data?.contacts);

        } catch (err) {
            console.error(err);
        }
        })();
    }, [id]);


    const submitHandler = async (e) => {
        e.preventDefault();

        let selectedContactIDs = selectedContacts.map(contact => contact?.attributes?.contact_id);
        
        const updatedProvider = {
            data: {
                type: "providers",
                attributes: {
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
            await CrudService.updateProvider(updatedProvider, id);
            navigate("/provider-management", {
                state: { value: true, text: "The provider was successfully Updated" },
            });
        } catch (err) {
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

            <MDBox mt={5} mb={9}>
                <Grid container justifyContent="center">
                    <Grid item xs={12} lg={8}>
                        <MDBox mt={6} mb={8} textAlign="center">
                            <MDBox mb={1}>
                                <MDTypography variant="h3" fontWeight="bold">
                                    Edit Provider {id}
                                </MDTypography>
                            </MDBox>
                            <MDTypography variant="h5" fontWeight="regular" color="secondary">
                                This information will describe more about the provider.
                            </MDTypography>
                        </MDBox>
                        <Card>
                            <MDBox component="form" method="POST" onSubmit={submitHandler}>
                                <MDBox display="flex" flexDirection="column" px={3} my={2}>
                                    <FormField
                                        type="text"
                                        label="Name"
                                        name="name"
                                        value={name}
                                        readOnly
                                    />                    

                                    <FormField
                                        type="text"
                                        label="Services"
                                        name="services"
                                        value={services}
                                        readOnly
                                    />   
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
                                                navigate("/provider-management", {
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

export default EditProvider;
