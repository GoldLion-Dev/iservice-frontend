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
import React from 'react';
import { useState, useEffect } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Badge, Modal } from '@mui/material';

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
import CrudService from "services/cruds-service";
import GoogleMapComponent from 'examples/Maps';

const ViewEntity = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);

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
    const [entityType, setEntityType] = useState([]);
    const [statusType, setStatusType] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedId, setSelectedId] = useState(0);
    const [selectedContacts, setSelectedContacts] = useState([]);

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
            console.log(res.data.attributes, 'info')
            setCompany({attributes: res.data.attributes?.Company});
            setEntityType({attributes: res.data.attributes?.EntityType});
            setStatusType({attributes: {StatusType: res.data.attributes?.StatusOption?.StatusType}});
            setSelectedContacts(res.data.included?.contacts);
            const moduleLocations = res.data.included?.moduleLocations;
            console.log(res.data.included?.contacts, 'selectedContacts')
            if (moduleLocations) {
                const updatedModuleLocations = moduleLocations.map(location => location.Address);
                const defaultIndex = moduleLocations.findIndex(location => location.is_default === true)
                setAddresses(updatedModuleLocations);
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


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mb={9}>
                <Grid justifyContent="center">
                    <Grid item xs={12} lg={8}>
                        <MDBox textAlign="center">
                            <MDBox mb={1}>
                                <MDTypography variant="h3" fontWeight="bold">
                                Entity {id}
                                </MDTypography>
                            </MDBox>
                            <MDTypography variant="h5" fontWeight="regular" color="secondary">
                                This information will describe more about the entity.
                            </MDTypography>
                        </MDBox>
                        <Card>
                            <MDBox >
                                <MDBox display="flex" flexDirection="column" px={3} my={2}>
                                    <MDBox p={1}>
                                        <FormField 
                                            label="Entity Type" 
                                            InputLabelProps={{ shrink: true }}
                                            value={entityType?.attributes?.type_name} 
                                            readOnly={true}
                                        />

                                        {entityType.attributes?.entity_type_id === 1 && (
                                            <>
                                                <FormField
                                                    type="text"
                                                    label="First Name"
                                                    name="firstName"
                                                    value={entity.firstName}
                                                    error={error.firstName}
                                                    readOnly={true}
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
                                                    error={error.lastName}
                                                    readOnly={true}

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
                                                    error={error.name}
                                                    readOnly={true}
                                                />
                                                {error.name && (
                                                <MDTypography variant="caption" color="error" fontWeight="light">
                                                    {error.textError}
                                                </MDTypography>
                                                )}
                                            </>
                                        )}    
                                        
                                        <FormField 
                                            label="Company" 
                                            InputLabelProps={{ shrink: true }}
                                            value={company?.attributes?.name} 
                                            readOnly={true}
                                        />         

                                        <FormField 
                                            label="Status" 
                                            InputLabelProps={{ shrink: true }}
                                            value={statusType?.attributes?.StatusType.status_name} 
                                            readOnly={true}
                                        />  
                                    </MDBox>
                                <MDBox>
                                    {addresses.map((address, index) => (
                                        <MDBox key={index} style={{marginTop: '30px'}}>
                                            <TableContainer component={Paper} style={{padding: '30px', border: '1px solid #e0e0e0', boxShadow: '5px 0px 5px -2px rgba(0,0,0,0.1), -5px 0px 5px -2px rgba(0,0,0,0.1), 0px 5px 5px -2px rgba(0,0,0,0.1)'}}>
                                                <Table>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell style={{padding: '0'}} colSpan={2}>
                                                                <Typography variant="h5">{`Address ${index + 1}`}</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell style={{padding: '0'}}>Street Address 1</TableCell>
                                                            <TableCell style={{padding: '0'}}>{address?.street_address1}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell style={{padding: '0'}}>Street Address 2</TableCell>
                                                            <TableCell style={{padding: '0'}}>{address?.street_address2}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell style={{padding: '0'}}>City</TableCell>
                                                            <TableCell style={{padding: '0'}}>{address?.city}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell style={{padding: '0'}}>State</TableCell>
                                                            <TableCell style={{padding: '0'}}>{address?.state}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell style={{padding: '0'}}>Country</TableCell>
                                                            <TableCell style={{padding: '0'}}>{address?.country}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell style={{padding: '0'}}>Latitude</TableCell>
                                                            <TableCell style={{padding: '0'}}>{address?.latitude}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell style={{padding: '0'}}>Longitude</TableCell>
                                                            <TableCell style={{padding: '0'}}>{address?.longitude}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell colSpan={2} style={{padding: '0'}}>
                                                                <MDButton variant="contained" color="primary" onClick={() => setOpenModal(true)}>View on Google Maps</MDButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <Modal open={openModal} onClose={() => setOpenModal(false)}>
                                                            <MDBox tabIndex={-1}>
                                                                <GoogleMapComponent lat={address?.latitude} lng={address?.longitude} />
                                                            </MDBox>
                                                        </Modal>

                                                    </TableBody>
                                                </Table>
                                                {address.module.length > 0 && <Typography>Entity Address Items</Typography>}
                                                <Table>
                                                    <TableBody>
                                                        {address.module.map((item, itemIndex) => (
                                                        <React.Fragment key={itemIndex}>
                                                            {itemIndex === 0 && (
                                                                <TableRow style={{ backgroundColor: 'lightgray' }}>
                                                                    <TableCell style={{ padding: '0', width: '5%' }}>No</TableCell>
                                                                    <TableCell style={{ padding: '0', width: '20%' }}>Status</TableCell>
                                                                    <TableCell style={{ padding: '0', width: '20%' }}>Name</TableCell>
                                                                    <TableCell style={{ padding: '0', width: '20%' }}>Address Item Name</TableCell>
                                                                    <TableCell style={{ padding: '0', width: '20%' }}>Type</TableCell>
                                                                    {/* <TableCell style={{ width: '20%' }}>Description</TableCell> */}
                                                                </TableRow>
                                                            )}                                        
                                                            <TableRow >
                                                                <TableCell style={{ width: '5%' }}>
                                                                    <Typography variant="subtitle1">{`${itemIndex + 1}`}</Typography>
                                                                </TableCell>
                                                                <TableCell style={{ width: '20%' }}>
                                                                    <Badge
                                                                    color={item?.ItemStatusOption?.BadgeDetail?.color || 'primary'}
                                                                    variant={item?.ItemStatusOption?.BadgeDetail?.variant}
                                                                    badgeContent={item?.ItemStatusOption?.StatusType?.status_name}
                                                                    style={{ marginLeft: '30px' }}
                                                                    ></Badge>
                                                                </TableCell>
                                                                <TableCell style={{ padding: '0', width: '20%' }}>
                                                                    <Typography variant="subtitle1" sx={{fontSize: '18px'}}>{item.name}</Typography>
                                                                </TableCell>
                                                                <TableCell style={{ padding: '0', width: '20%' }}>
                                                                    <Typography variant="subtitle1" sx={{fontSize: '18px'}}>{item.itemName}</Typography>
                                                                </TableCell>
                                                                <TableCell style={{ padding: '0', width: '20%' }} sx={{fontSize: '18px'}}>{item?.ItemType?.type_name}</TableCell>
                                                                {/* <TableCell style={{ width: '20%' }}>{item?.description}</TableCell> */}
                                                            </TableRow>
                                                            {Object.keys(item.AttributeValue).length > 0 && (
                                                                <TableRow>
                                                                <TableCell colSpan={5}>
                                                                    <Table>
                                                                    <TableBody>
                                                                        <TableRow>
                                                                            <TableCell style={{padding: '0'}}>Index</TableCell>
                                                                            <TableCell style={{padding: '0'}}>Name</TableCell>
                                                                            <TableCell style={{padding: '0'}}>Value</TableCell>
                                                                        </TableRow>
                                                                        {item.Attributes.map((attribute, attributeIndex) => (
                                                                        <TableRow key={attributeIndex}>
                                                                            <TableCell style={{padding: '0'}}>{attributeIndex + 1}</TableCell>
                                                                            <TableCell style={{padding: '0'}}>{attribute?.attribute_name}</TableCell>
                                                                            <TableCell style={{padding: '0'}}>{item?.AttributeValue[attribute.attribute_id]}</TableCell>
                                                                        </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                    </Table>
                                                                </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </React.Fragment>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </MDBox>
                                    ))}
                                </MDBox>

                                <MDBox>
                                    {selectedContacts.map((contact, index) => (
                                        <MDBox key={index} style={{marginTop: '30px'}}>
                                            <TableContainer component={Paper} style={{padding: '30px', border: '1px solid #e0e0e0', boxShadow: '5px 0px 5px -2px rgba(0,0,0,0.1), -5px 0px 5px -2px rgba(0,0,0,0.1), 0px 5px 5px -2px rgba(0,0,0,0.1)'}}>
                                                <Table>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell style={{padding: '0'}} colSpan={2}>
                                                            <Typography variant="h5">{`Contact ${index + 1}`}</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell style={{padding: '0'}}>Status</TableCell>
                                                            <TableCell style={{padding: '0'}}>
                                                                <Badge
                                                                    color={contact?.attributes?.StatusOption?.BadgeDetail?.color || 'primary'}
                                                                    variant={contact?.attributes?.StatusOption?.BadgeDetail?.variant}
                                                                    badgeContent={contact?.attributes?.StatusOption?.StatusType?.status_name}
                                                                    style={{ marginLeft: '30px' }}
                                                                ></Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell style={{padding: '0'}}>First Name</TableCell>
                                                            <TableCell style={{padding: '0'}}>
                                                                <Typography variant="subtitle1" sx={{fontSize: '18px'}}>{contact?.attributes?.first_name}</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell style={{padding: '0'}}>Last Name</TableCell>
                                                            <TableCell style={{padding: '0'}}>
                                                                <Typography variant="subtitle1" sx={{fontSize: '18px'}}>{contact?.attributes?.last_name}</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell style={{padding: '0'}}>Type</TableCell>
                                                            <TableCell style={{padding: '0'}}>
                                                                <Typography variant="subtitle1" sx={{fontSize: '18px'}}>{contact?.attributes?.ContactType.type_name}</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                                {contact?.attributes?.ContactAddresses.length > 0 && <Typography>Contact Address</Typography>}
                                                <Table>
                                                    <TableBody>
                                                        {contact?.attributes?.ContactAddresses.map((item, itemIndex) => (
                                                        <React.Fragment key={itemIndex}>
                                                            {itemIndex === 0 && (
                                                                <TableRow style={{ backgroundColor: 'lightgray' }}>
                                                                    <TableCell style={{ padding: '0', width: '5%' }}>No</TableCell>
                                                                    <TableCell style={{ padding: '0', width: '20%' }}>Type</TableCell>
                                                                    <TableCell style={{ padding: '0', width: '20%' }}>Address</TableCell>
                                                                    <TableCell style={{ padding: '0', width: '20%' }}>Description</TableCell>
                                                                    <TableCell style={{ padding: '0', width: '20%' }}>Default</TableCell>
                                                                    {/* <TableCell style={{ width: '20%' }}>Description</TableCell> */}
                                                                </TableRow>
                                                            )}                                        
                                                            <TableRow >
                                                                <TableCell style={{ padding: '0', width: '5%' }}>
                                                                    <Typography variant="subtitle1">{`${itemIndex + 1}`}</Typography>
                                                                </TableCell>
                                                                
                                                                <TableCell style={{ padding: '0', width: '20%' }}>
                                                                    <Typography variant="subtitle1" sx={{fontSize: '18px'}}>{item?.ContactAddressType?.type_name}</Typography>
                                                                </TableCell>
                                                                <TableCell style={{ padding: '0', width: '20%' }}>
                                                                    <Typography variant="subtitle1" sx={{fontSize: '18px'}}>{item?.contact_address}</Typography>
                                                                </TableCell>
                                                                <TableCell style={{ padding: '0', width: '20%' }} sx={{fontSize: '18px'}}>{item?.description}</TableCell>
                                                                <TableCell style={{ padding: '0', width: '20%' }} sx={{fontSize: '18px'}}>{item?.is_default ? 'Yes' : ''}</TableCell>
                                                                {/* <TableCell style={{ width: '20%' }}>{item?.description}</TableCell> */}
                                                            </TableRow>
                                                        
                                                        </React.Fragment>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </MDBox>
                                    ))}
                                </MDBox>

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

export default ViewEntity;
