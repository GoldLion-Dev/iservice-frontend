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

import { useEffect, useState } from "react";

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
import DataTable from "examples/Tables/DataTable";
import HTMLReactParser from "html-react-parser";
import { Autocomplete, CardContent, Typography, Tooltip, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MultiSelectDataTable from "examples/Tables/MultiSelectDataTable";
import FormField from "layouts/applications/wizard/components/FormField";

import { MODULE_MASTER } from "utils/constant";
import CrudService from "services/cruds-service";

const ModalItem = ({moduleData, module, setModule, attributeValue, setAttributeValue}) => {
  const [open, setOpen] = useState(false);
  const [openAttribute, setOpenAttribute] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [providers, setProviders] = useState([]);
  const [statusItem, setStatusItem] = useState([]);
  const [itemIndex, setItemIndex] = useState([]);
  const [selectedItemAttributes, setSelectedItemAttributes] = useState([]);

  console.log(module, 'module')
  useEffect(() => {
    (async () => {
        try {
          const response = await CrudService.getStatusTypes(MODULE_MASTER.ITEMS);
          const statusTypesArray = response.data.map(item => item.attributes);

          setStatusItem(statusTypesArray);
        } catch (err) {
          console.error(err);
          return null;
        }
    })();
    (async () => {
      try {
        const response = await CrudService.getProviders();
        console.log(response,' providers')
        setProviders(response);
      } catch (err) {
        console.error(err);
        return null;
      }
    })();
  }, [])

  const removeItem = (index) => {
    const updatedModule = [...module];
    updatedModule.splice(index, 1);
    setModule(updatedModule);
  };

  const duplicateItem = (index) => {
    const updateditems = [...module];
    let addedItem = updateditems.find(updateditem => updateditem.id === index);
    
    if (addedItem) {
      // Create a deep copy of the item to duplicate
      const duplicatedItem = { ...addedItem, itemName: '', ItemStatusOption: [] };
    
      // Add the duplicated item to the updated items array
      setModule([...module, duplicatedItem]);
    }
  };

  const openItemModal = () => {
    setOpen(true);
  };

  const closeItemModal = () => {
    setOpen(false);
  };

  const addItem = () => {
    // setModule([...items, newitem]);
    const filteredItems = moduleData.filter(item => selectedRows.includes(item.id));
    const updatedFilteredItems = filteredItems.map(item => ({ ...item, itemName: '', ItemStatusOption: [], provider: [] }));
    setModule([...module, ...updatedFilteredItems]);
    console.log(module, updatedFilteredItems, '=========')
    setOpen(false);
  };

  const handleItemNameChange = (e, rowIndex) => {
    const { value } = e.target;
    // Update the item name in the corresponding row of your data (items array)
    const updatedItems = [...module];
    updatedItems[rowIndex].itemName = value;
    // setModule(updatedItems);
    // Update state or perform any other action with updatedItems
  };

  const handleItemStatusChange = (e, value, rowIndex) => {
    // Update the item name in the corresponding row of your data (items array)
    
    // Update state or perform any other action with updatedItems
    const updatedItems = module.map((item, index) => {
      if (index === rowIndex) {
        return { ...item, ItemStatusOption: value };
      }
      return item;
    });
  
    setModule(updatedItems);
  };

  const handleProviderChange = (e, value, rowIndex) => {
    // Update the item name in the corresponding row of your data (items array)
    
    // Update state or perform any other action with updatedItems
    const updatedItems = module.map((item, index) => {
      if (index === rowIndex) {
        return { ...item, provider: value };
      }
      return item;
    });
  
    setModule(updatedItems);
  };

  const closeAttributeModal = () => {
    setOpenAttribute(false);
  }
  
  const handleSaveAttribute = () => {
    // Make a copy of attributeValues to work with
    for (let attribute of selectedItemAttributes) {
      const { attribute_id, required, default_value, field_type } = attribute;
  
      // Find the corresponding attribute value in attributeValue based on attribute_id
      let updatedAttributeValue = null;
      for (let key in attributeValue) {
        if (attributeValue[key].attribute_id === attribute_id) {
          updatedAttributeValue = { ...attributeValue[key] };
          break;
        }
      }
  
      if (!updatedAttributeValue) {
        // Attribute value not found, handle error or skip processing
        continue;
      }
  
      // Check if the attribute is required and the value is empty
      if (required && !updatedAttributeValue.value) {
        alert(`Please enter a value for the ${attribute.attribute_name} attribute.`);
        return; // Stop the function execution if validation fails
      }
    }
    
    // Find the index of updatedAttributeValue in attributeValues
    // Check if the index is valid (not -1) and update the item at that index
    // let formattedAttributeValue = { ...attributeValue, itemIndex: itemIndex, item_id: module[itemIndex]?.id }
    // updatedAttributeValues[itemIndex] = formattedAttributeValue; // Update the item at the index
    // setAttributeValues(updatedAttributeValues); // Set the state with the updated array
    let updatedModule = [...module];
    updatedModule[itemIndex].AttributeValue = attributeValue;
    setModule(updatedModule);
    setOpenAttribute(false); // Close the modal or perform any other necessary actions
  }

  const handleAttributeValueChange = (id, value) => {
    setAttributeValue((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleViewAttributes = async (index) => {
    // Assuming you have a function to fetch item attributes based on itemId
    setItemIndex(index)
    const attributes = await fetchItemAttributes(index);
    console.log(attributes, 'attributes')
    setSelectedItemAttributes(attributes);
    setAttributeValue(module[index]?.AttributeValue || {});
    setOpenAttribute(true);
  };

  const fetchItemAttributes = async (index) => {
    // Example logic to fetch item attributes from an API
    // Replace this with your actual API call or data fetching logic
    return module[index]?.Attributes || [];
  };

  const isOptionEqualToValueItemStatus = (option, value) => {
    return option?.StatusType?.status_name === value?.StatusType?.status_name;
  };

  const isOptionEqualToValueProvider = (option, value) => {
    return option?.provider_name === value?.provider_name;
  };

  const getRows = (info) => {
    let updatedInfo = info.map((row) => {
      return {
        type: "items",
        id: row.id,
        name: row.name,
        company: row.Company?.name,
        description: row.description,
        type: row.ItemType?.type_name,
        itemName: row.itemName,
        status: (
          <Badge
            color={row?.ItemStatusOption?.BadgeDetail?.color || 'primary'}
            variant={row?.ItemStatusOption?.BadgeDetail?.variant}
            badgeContent={row?.ItemStatusOption?.StatusType?.status_name}
            style={{marginLeft: '30px'}}
          >
          </Badge>
        ),
      };
    });
    return updatedInfo;
  };

  const dataTableData = {
    columns: [
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row, value }) => (
          <Autocomplete
            defaultValue=""
            options={statusItem}
            value={statusItem.find(option => isOptionEqualToValueItemStatus(option, module[row.index]?.ItemStatusOption)) ?? null}
            getOptionLabel={(option) => (option.StatusType ? option.StatusType.status_name : "")}
            onChange={(e, newStatus) => {
              handleItemStatusChange(e, newStatus, row.index);
            }}
            style={{ width: "120px" }}
            isOptionEqualToValue={isOptionEqualToValueItemStatus}
            renderInput={(params) => (
              <FormField
                {...params}
                label="Status"
                InputLabelProps={{ shrink: true }}
                required
              />
            )}
          />
        ),
      },
      {
        Header: "Providers",
        accessor: "provider",
        Cell: ({ row, value }) => (
          <Autocomplete
            defaultValue=""
            options={providers}
            value={providers.find(option => isOptionEqualToValueProvider(option, module[row.index]?.provider)) ?? null}
            getOptionLabel={(option) => (option ? option?.provider_name : "")}
            onChange={(e, newStatus) => {
              handleProviderChange(e, newStatus, row.index);
            }}
            style={{ width: "250px" }}
            isOptionEqualToValue={isOptionEqualToValueProvider}
            renderInput={(params) => (
              <FormField
                {...params}
                label="Provider"
                InputLabelProps={{ shrink: true }}
                required
              />
            )}
          />
        ),
      },
      { Header: "Name", accessor: "name", width: "20%" },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ cell: { value } }) => (
          <div style={{ width: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
            {HTMLReactParser(value)}
          </div>
        ),
      },
      { Header: "Company", accessor: "company", width: "20%" },
      { Header: "Type", accessor: "type", width: "20%" },
      {
        Header: "Item Name", // New column for inserting item name
        accessor: "itemName",
        width: "15%",
        Cell: ({ row, value }) => (
          <FormField
            defaultValue={value}
            required
            type="text"
            label="Item Name"
            name="itemName"
            onChange={(e) => handleItemNameChange(e, row.index)}
        />
        ),
      },
      {
        Header: "View Attributes",
        accessor: "viewAttributes",
        width: "12%",
        Cell: ({ row }) => (
          <MDButton style={{color: 'black'}} variant="outlined" onClick={() => handleViewAttributes(row.index)}><span>Attributes</span></MDButton>
        ),
      },
      {
        Header: "actions",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
          return (
            <MDBox display="flex" alignItems="center">
              {(
                <Tooltip title="Duplicate Item">
                  <IconButton onClick={(e) => duplicateItem(info.cell.row.original.id)}>
                    <FileCopyIcon />
                  </IconButton>
                </Tooltip>
              )}
              {(
                <Tooltip title="Delete Item">
                  <IconButton onClick={(e) => removeItem(info.cell.row.index)}>
                    <MDTypography><DeleteIcon /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}
            </MDBox>
          );
        },
      },
    ],

    rows: getRows(module),
  };

  return (
    <Card>
        <MDBox display="flex" flexDirection="column" px={3} my={2}>
            <MDBox display="flex" flexDirection="column" style={{marginTop: "1rem"}}>
                <MDBox
                    display="flex"
                >
                    <MDTypography variant="h5" color="secondary"  fontWeight="bold">
                    items
                    </MDTypography>
                    <MDButton variant="gradient" color="dark" size="small" style={{marginLeft: "1rem"}} onClick={openItemModal}>Add item</MDButton>
                </MDBox>

                <Modal
                    open={open}
                    onClose={closeItemModal}
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
                        <Typography>Select item</Typography>
                        <MultiSelectDataTable rowData={moduleData} selectedRows={selectedRows} setSelectedRows={setSelectedRows}/>
                        <MDBox ml="auto" mt={3} display="flex" justifyContent="flex-end">
                            <MDButton variant="contained" color="secondary" onClick={closeItemModal}>
                                Cancel
                            </MDButton>
                            <MDButton variant="contained" color="info" onClick={addItem} style={{marginLeft: '10px'}}>
                                Save
                            </MDButton>
                        </MDBox>
                    </CardContent>
                    </Card>
                </Modal>
                
            </MDBox>
            {module.length > 0 && (
              <DataTable
                table={dataTableData}
                canSearch={true}
              />
            )}
            <MDBox>
              <Modal
                  open={openAttribute} 
                  onClose={closeAttributeModal}
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
                      <Typography>Attributes</Typography>
                      <MDBox>
                        {selectedItemAttributes.map((attribute, index) => (
                          <TextField
                            key={index}
                            label={attribute.attribute_name}
                            value={attributeValue[attribute.attribute_id] || ''}
                            onChange={(e) => handleAttributeValueChange(attribute.attribute_id, e.target.value)}
                            fullWidth
                            margin="normal"
                          />
                        ))}
                        {
                          selectedItemAttributes.length === 0 && 
                          <MDBox>
                            No Available Attributes
                          </MDBox>
                        }
                      </MDBox>
                      <MDBox ml="auto" mt={3} display="flex" justifyContent="flex-end">
                          <MDButton variant="contained" color="secondary" onClick={closeAttributeModal}>
                              Cancel
                          </MDButton>
                          <MDButton variant="contained" color="info" onClick={handleSaveAttribute} style={{marginLeft: '10px'}}>
                              Save
                          </MDButton>
                      </MDBox>
                  </CardContent>
                  </Card>
              </Modal>

            </MDBox>
        </MDBox>
    </Card>
  );
};

export default ModalItem;
