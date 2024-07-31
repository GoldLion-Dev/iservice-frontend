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

import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from '@mui/material/Modal';
import Badge from "@mui/material/Badge";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import FormField from "layouts/applications/wizard/components/FormField";
import DataTable from "examples/Tables/DataTable";
import { Autocomplete, CardContent, Typography, Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';
import ModalItem from "cruds/modals/items/entity-address-item";
import { ToastContainer, toast } from 'react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';

const ModalModuleAddress = ({addressTypes, statusOptions, addresses, setAddresses, selectedId, setSelectedId, moduleData, moduleType, attributeValue, setAttributeValue, module, setModule }) => {
  const [addressType, setAddressType] = useState();
  const [statusOption, setStatusOption] = useState();

  const [newAddress, setNewAddress] = useState({ street_address1: "", street_address2: "", city: "", state: "", postal_code: "", country: "", latitude: "", longitude: "", address_type_id: 1, status_type_id: 1, module: [] });
  const [open, setOpen] = useState(false);
  const [indexAddr, setIndexAddr] = useState(0);
  const [handleMode, setHandleMode] = useState(false);

  const changeAddressHandler = (index, field, value) => {
    if(!handleMode) {
      setNewAddress((prevAddress) => ({
        ...prevAddress,
        [field]: value
      }));  
    }

    if(handleMode) {
      const updatedAddresses = [...addresses];
      updatedAddresses[index][field] = value;
      setAddresses(updatedAddresses);
    }
  };

  const handleSelect = async (value) => {
    try {
      const results = await geocodeByPlaceId(value.place_id);
      if (results && results.length > 0) {
        const placeData = results[0];
        const { address_components, formatted_address, geometry } = placeData;
  
        // Create a new address object with selected place information
        const newAddressObj = {
          street_address1: `${address_components.find(comp => comp.types.includes('street_number'))?.long_name || ""} ${address_components.find(comp => comp.types.includes('route'))?.long_name || ""}`,
          street_address2: address_components.find(comp => comp.types.includes('neighborhood'))?.long_name || "",
          city: address_components.find(comp => comp.types.includes('locality'))?.long_name || "",
          state: address_components.find(comp => comp.types.includes('administrative_area_level_1'))?.short_name || "",
          postal_code: address_components.find(comp => comp.types.includes('postal_code'))?.long_name || "",
          country: address_components.find(comp => comp.types.includes('country'))?.long_name || "",
          latitude: geometry?.location.lat() || "",
          longitude: geometry?.location.lng() || "",
          address_type_id: handleMode ? addresses[indexAddr].address_type_id : newAddress.address_type_id,
          status_type_id: handleMode ? addresses[indexAddr].status_type_id : newAddress.status_type_id,
        };
  
        setNewAddress(newAddressObj);
        if (handleMode) {
          // Update the address at the specified index for editing
          const updatedAddresses = [...addresses];
          updatedAddresses[indexAddr] = newAddressObj;
          setAddresses(updatedAddresses);
        }
      }
    } catch (error) {
      console.error('Error fetching geolocation:', error);
    }
  };

  const notify = (text) => {
    if (!toast) {
      console.error('Toast object is undefined');
      return;
    }
    toast.warning(text, {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  const addressHandler = () => {
    // const keysToExclude = ['street_address2', 'latitude', 'longitude', 'address_type_id', 'status_type_id'];

    // // for (const key in newAddress) {
    // //   if (newAddress.hasOwnProperty(key) && !keysToExclude.includes(key) && newAddress[key].trim() === '') {
    // //     alert("You need to fill out " + key);
    // //     return false; // Return false if any non-excluded field is blank
    // //   }
    // // }

    // for (const key in newAddress) {
    //     if (
    //     newAddress.hasOwnProperty(key) &&
    //     !keysToExclude.includes(key) &&
    //     typeof newAddress[key] === 'string' && // Check if the value is a string
    //     newAddress[key].trim() === ''
    //     ) {
    //     alert("You need to fill out " + key);
    //     return false; // Return false if any non-excluded field is blank
    //     }
    // }
    const addressModule = [...module];

    if(!handleMode) {
        const updatedNewAddress = {
            ...newAddress,
            module: addressModule, // Update modules property with the modules array
        };
        if(newAddress.street_address1 === '') {
          notify('Please set Street of Address!');
          return;
        }
        if(newAddress.city === '') {
          notify('Please set city of Address!');
          return;
        }
        if(newAddress.state === '') {
          notify('Please set State of Address!');
          return;
        }
        if(newAddress.postal_code === '') {
          notify('Please set Postal Code of Address!');
          return;
        }
        if(newAddress.country === '') {
          notify('Please set Country of Address!');
          return;
        }
        if(newAddress.latitude === '') {
          notify('Please set latitude of Address!');
          return;
        }
        if(newAddress.longitude === '') {
          notify('Please set longitude of Address!');
          return;
        }
        if(newAddress.status_type_id === '') {
          notify('Please set Status of Address!');
          return;
        }
        if(newAddress.address_type_id === '') {
          notify('Please set Type of Address!');
          return;
        }
        setAddresses([...addresses, updatedNewAddress]);
    } else {
        const updatedNewAddress = {
            ...newAddress,
            module: addressModule, // Update modules property with the modules array
        };
        let updatedArresses = [...addresses];
        updatedArresses[indexAddr] = updatedNewAddress;
        console.log(updatedArresses, 'updatedArresses')
        setAddresses(updatedArresses);
    }
    // setAddresses([...addresses, { street_address1: "t", street_address2: "t", city: "t", state: "t", postal_code: "", country: "", latitude: "", longitude: "", address_type_id: "", status_type_id: "" }]);

    // setNewAddress({ street_address1: "", street_address2: "", city: "", state: "", postal_code: "", country: "", latitude: "", longitude: "", address_type_id: "", status_type_id: "", module: [] });
    setOpen(false);
  };

  const editAddress = (index) => {
    setIndexAddr(index);
    setHandleMode(true);
    const updatedAddresses = [...addresses];
    console.log(updatedAddresses, 'edit')

    setNewAddress(updatedAddresses[index]);
    console.log(updatedAddresses, updatedAddresses[index], 'index')
    setModule(updatedAddresses[index]?.module)

    const address_type = addressTypes.find((address) => address.id === updatedAddresses[index]?.address_type_id);
    const status_option = statusOptions.find((status) => status.id === updatedAddresses[index]?.status_type_id);
    setAddressType(address_type);
    setStatusOption(status_option);
    
    setOpen(true);
  };

  const handleOpen = () => {
    setOpen(true);
    setHandleMode(false);
    setAddressType();
    setStatusOption();
    setNewAddress({ street_address1: "", street_address2: "", city: "", state: "", postal_code: "", country: "", latitude: "", longitude: "", address_type_id: "", status_type_id: "", module:[] });
    setModule([])
    setAttributeValue([]);
    setIndexAddr(0);
  };

  const removeAddress = (index) => {
    const updatedAddresses = [...addresses];
    updatedAddresses.splice(index, 1);
    setAddresses(updatedAddresses);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getRows = (info) => {
    let updatedInfo = info.map((row, index) => {
      const address_type = addressTypes.find((address) => address.id === row.address_type_id);
      const status_option = statusOptions.find((status) => status.id === row.status_type_id);
      return {
        type: "addresses",
        id: index,
        street_address1: row.street_address1,
        street_address2: row.street_address2,
        city: row.city,
        state: row.state,
        country: row.country,
        postal_code: row.postal_code,
        latitude: row.latitude,
        longitude: row.longitude,
        address_type_id: address_type?.attributes?.type_name,
        status_type_id: (
            <Badge
              color={status_option?.attributes?.BadgeDetail?.color || 'primary'}
              variant={status_option?.attributes?.BadgeDetail?.variant}
              badgeContent={status_option?.attributes?.StatusType?.status_name}
              style={{marginLeft: '15px'}}
            >
            </Badge>
        ),
        isSelected: index === selectedId,
      };
    });
    return updatedInfo;
  };

  const dataTableData = {
    columns: [
      {
        Header: "Default",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
          return (
            <Checkbox checked={info.cell.row.original.isSelected} onChange={() => handleCheckboxChange(info.cell.row.original.id)} />
          );
        },
      },
      { Header: "Status", accessor: "status_type_id", width: "10%" },
      { Header: "Type", accessor: "address_type_id", width: "10%" },
      { Header: "Street Address1", accessor: "street_address1", width: "15%" },
      { Header: "Street Address2", accessor: "street_address2", width: "15%" },
      { Header: "City", accessor: "city", width: "10%" },
      { Header: "State", accessor: "state", width: "10%" },
      { Header: "Country", accessor: "country", width: "10%" },
      { Header: "Postal Code", accessor: "postal_code", width: "10%" },
      { Header: "Lattitude", accessor: "latitude", width: "5%" },
      { Header: "Longitude", accessor: "longitude", width: "5%" },
      {
        Header: "actions",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
          return (
            <MDBox display="flex" alignItems="center">
              {(
                <Tooltip title="Edit Address">
                  <IconButton onClick={() => editAddress(info.cell.row.original.id)}>
                    <MDTypography><EditIcon /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}
              {(
                <Tooltip title="Delete Address">
                  <IconButton onClick={() => removeAddress(info.cell.row.original.id)}>
                    <MDTypography><DeleteIcon /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}
            </MDBox>
          );
        },
      }
    ],

    rows: getRows(addresses),
  };

  const handleCheckboxChange = (id) => {
    const updatedAddresses = addresses.map((address) => ({
      ...address,
      isSelected: address.id === id, // Set isSelected to true for the selected row
    }));
    setAddresses(updatedAddresses); // Update the addresses state with the selected row
    setSelectedId(id); // Update selectedId state with the selected row ID
  };

  // const isOptionEqualToValueAddressStatus = (option, value) => {
  //   console.log(option, value, '_+_')
  //   return option.attributes?.StatusType.status_name === value.attributes?.StatusType.status_name;
  // };

  // const isOptionEqualToValueAddressType = (option, value) => {
  //   console.log(option, value, '_+_')
  //   return option?.attributes?.type_name === value?.attributes?.type_name;
  // };

  return (
    <Card>
        <ToastContainer/>
        <MDBox display="flex" flexDirection="column" px={3} my={2}>
            <MDBox display="flex" flexDirection="column" style={{marginTop: "1rem"}}>
                <MDBox
                    display="flex"
                >
                    <MDTypography variant="h5" color="secondary"  fontWeight="bold">
                    Addresses
                    </MDTypography>
                    <MDButton variant="gradient" color="dark" size="small" style={{marginLeft: "1rem"}} onClick={handleOpen}>+ Add Address</MDButton>
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
                    }}
                    >
                    <CardContent>
                        <Typography>New Address</Typography>
                        <div className="places-autocomplete-container">
                        <GooglePlacesAutocomplete
                          apiKey="AIzaSyBwzbz3UcUkp4l5qsD0clePzJZtyLIhf9U"
                          onSelect={handleSelect}
                        />

                        <style>{`
                              .places-autocomplete-container {
                                position: relative;
                              }

                              .google-places-autocomplete__input {
                                width: 100%;
                                padding: 8px;
                                border: 1px solid #ccc;
                                border-radius: 4px;
                              }

                              .google-places-autocomplete__suggestions-container {
                                position: absolute;
                                top: calc(100% + 5px);
                                left: 0;
                                width: 100%;
                                background-color: #fff;
                                border: 1px solid #ccc;
                                border-radius: 4px;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                                z-index: 1000;
                                max-height: 200px;
                                overflow-y: auto;
                              }

                              .google-places-autocomplete__suggestion {
                                padding: 8px 16px;
                                cursor: pointer;
                              }

                              .google-places-autocomplete__suggestion:hover {
                                background-color: #f0f0f0;
                              }

                              .google-places-autocomplete__suggestion--active {
                                background-color: #e0e0e0;
                              }
                        `}</style>
                        </div>          
                        <MDBox sx={{
                            maxHeight: '70vh', // Set max height to enable scrolling
                            overflowY: 'auto',    
                            overflowX: 'hidden'                      
                        }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                              <FormField
                                required
                                type="text"
                                label="Street Address 1"
                                value={newAddress.street_address1}
                                style={{ marginTop: "1rem" }}
                                onChange={(e) =>
                                  changeAddressHandler(indexAddr, "street_address1", e.target.value)
                                }
                              />
                          </Grid>
                          <Grid item xs={6}>
                              <FormField
                                type="text"
                                label="Street Address 2"
                                value={newAddress.street_address2}
                                style={{ marginTop: "1rem" }}
                                onChange={(e) =>
                                  changeAddressHandler(indexAddr, "street_address2", e.target.value)
                                }
                              />
                          </Grid>
                          </Grid>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormField
                                  required
                                  type="text"
                                  label="City"
                                  value={newAddress.city}
                                  style={{marginTop: "1rem"}}
                                  onChange={(e) => changeAddressHandler(indexAddr, "city", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormField
                                  required
                                  type="text"
                                  label="State"
                                  value={newAddress.state}
                                  style={{marginTop: "1rem"}}
                                  onChange={(e) => changeAddressHandler(indexAddr, "state", e.target.value)}
                                />
                            </Grid>
                          </Grid>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormField
                                required
                                type="text"
                                label="Postal Code"
                                value={newAddress.postal_code}
                                style={{marginTop: "1rem"}}
                                onChange={(e) => changeAddressHandler(indexAddr, "postal_code", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormField
                                  required
                                  type="text"
                                  label="Country"
                                  value={newAddress.country}
                                  style={{marginTop: "1rem"}}
                                  onChange={(e) => changeAddressHandler(indexAddr, "country", e.target.value)}
                                />   
                            </Grid>
                          </Grid>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormField
                                required
                                type="text"
                                label="Latitude"
                                value={newAddress.latitude}
                                style={{marginTop: "1rem"}}
                                onChange={(e) => changeAddressHandler(indexAddr, "latitude", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormField
                                required
                                type="text"
                                label="Longitude"
                                value={newAddress.longitude}
                                style={{marginTop: "1rem"}}
                                onChange={(e) => changeAddressHandler(indexAddr, "longitude", e.target.value)}
                                />
                            </Grid>
                          </Grid>
                          <Autocomplete
                            required
                            defaultValue=""
                            value={addressType}
                            options={addressTypes}
                            getOptionLabel={(option) => (option ? option.attributes?.type_name : "")}
                            style={{ marginTop: "1rem" }}
                            onChange={(event, newAddressType) => changeAddressHandler(indexAddr, "address_type_id", newAddressType ? newAddressType.attributes?.address_type_id : null)}
                            renderInput={(params) => (
                                <FormField {...params} label="Address Type *" InputLabelProps={{ shrink: true }} />
                            )}
                          />           
                          <Autocomplete
                            required
                            defaultValue=""
                            value={statusOption}
                            options={statusOptions}
                            getOptionLabel={(option) => (option ? option.attributes?.StatusType?.status_name : "")}
                            style={{ marginTop: "1rem" }}
                            onChange={(event, newStatusType) => changeAddressHandler(indexAddr, "status_type_id", newStatusType ? newStatusType.attributes?.StatusType?.status_type_id : null)}
                            renderInput={(params) => (
                                <FormField {...params} label="Status *" InputLabelProps={{ shrink: true }} />
                            )}
                          />   
                          {
                            moduleType !== "" && 
                            <ModalItem moduleData={moduleData} module={module} setModule={setModule} attributeValue={attributeValue} setAttributeValue={setAttributeValue}/> 
                          }


                        </MDBox>
                        <MDBox ml="auto" mt={3} display="flex" justifyContent="flex-end">
                          <MDButton variant="contained" color="secondary" onClick={handleClose}>
                              Cancel
                          </MDButton>
                          <MDButton variant="contained" color="info" onClick={addressHandler} style={{marginLeft: '10px'}}>
                              Save
                          </MDButton>
                        </MDBox>
                    </CardContent>
                    </Card>
                </Modal>
                
            </MDBox>
            <MDBox>
              {addresses.length > 0 && (
                <DataTable
                  table={dataTableData}
                  canSearch={true}
                />
              )}
            </MDBox>
        </MDBox>
    </Card>
  );
};

export default ModalModuleAddress;
