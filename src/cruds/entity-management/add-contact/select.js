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
import { useNavigate, useLocation } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Badge from "@mui/material/Badge";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import MDButton from "components/MDButton";
import { Tooltip, IconButton, Modal, Typography } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import CrudService from "services/cruds-service";
import { AbilityContext } from "Can";
import { useAbility } from "@casl/react";
import MultiSelectDataTable from "examples/Tables/MultiSelectDataTable";
import DataTable from "examples/Tables/DataTable";

function ModalSelectContact({ open, setOpen, contacts, selectedContacts, setSelectedContacts }) {
  let { state } = useLocation();
  const ability = useAbility(AbilityContext);
  const [tableData, setTableData] = useState([]);
  const [notification, setNotification] = useState({
    value: false,
    text: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);


  useEffect(() => {
    if (!state) return;
    setNotification({
      value: state.value,
      text: state.text,
    });
  }, [state]);

  useEffect(() => {
    setTableData(getRows(selectedContacts));
  }, [selectedContacts]);

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

  const clickDeleteHandler = (index) => {
    const indexToRemove = selectedContacts.findIndex(contact => contact?.attributes?.contact_id === index);
    if (indexToRemove !== -1) {
      // If the index is found (i.e., not -1), create a copy of the array and remove the element
      const updatedContacts = [...selectedContacts];
      updatedContacts.splice(indexToRemove, 1);
      setSelectedContacts(updatedContacts);
    } else {
        console.error(`Element with id not found.`);
    }

  };

  const getRows = (info) => {
    let updatedInfo = info.map((row) => {
      let phone = row?.attributes?.ContactAddresses.find(contact => contact.address_type_id === 1 && contact.is_default === true);
      let email = row?.attributes?.ContactAddresses.find(contact => contact.address_type_id === 2 && contact.is_default === true);
      let fax = row?.attributes?.ContactAddresses.find(contact => contact.address_type_id === 3 && contact.is_default === true);
      return {
        StatusType: row.attributes?.StatusOption,
        type: "contacts",
        id: row.attributes?.contact_id,
        first_name: row.attributes?.first_name,
        last_name: row.attributes?.last_name,
        type: row.attributes?.ContactType?.type_name,
        phone: phone ? phone.contact_address : '', // Render phone.contact_address if phone exists, otherwise an empty string
        email: email ? email.contact_address : '', // Render email.contact_address if email exists, otherwise an empty string
        fax: fax ? fax.contact_address : '',
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

  const dataTableData = {
    columns: [
      { Header: "Status", accessor: "status", width: "15%" },
      { Header: "First Name", accessor: "first_name", width: "15%" },
      { Header: "Last Name", accessor: "last_name", width: "15%" },
      { Header: "Type", accessor: "type", width: "20%" },
      { Header: "Phone", accessor: "phone", width: "15%" },
      { Header: "Email", accessor: "email", width: "15%" },
      { Header: "Fax", accessor: "fax", width: "15%" },
      {
        Header: "actions",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
          return (
            <MDBox display="flex" alignItems="center">
              <Tooltip title="Delete Contact">
                <IconButton onClick={(e) => clickDeleteHandler(info.cell.row.original.id)}>
                  <MDTypography><DeleteIcon /></MDTypography>
                </IconButton>
              </Tooltip>
            </MDBox>
          );
        },
      },
    ],

    rows: tableData,
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addressHandler = () => {
    // setAddresses([...addresses, newAddress]);
    const filteredAddresses = contacts.filter(address => selectedRows.includes(address.id));
    // setSelectedContacts(filteredAddresses);
    setSelectedContacts(prevSelectedContacts => [...prevSelectedContacts, ...filteredAddresses]);

    setOpen(false);
  };

  return (
    <MDBox>
      <Card>
        <MDBox>
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
                <MDBox p={3} lineHeight={1} display="flex" justifyContent="space-between">
                  <MDTypography variant="h5" fontWeight="medium">
                    Contact Management
                  </MDTypography>
                </MDBox>
                <MultiSelectDataTable rowData={getRows(contacts)} selectedRows={selectedRows} setSelectedRows={setSelectedRows}/>
                <MDBox ml="auto" mt={3} display="flex" justifyContent="flex-end">
                  <MDButton variant="contained" color="secondary" onClick={handleClose}>
                      Cancel
                  </MDButton>
                  <MDButton variant="contained" color="info" onClick={addressHandler} style={{marginLeft: '10px'}}>
                      Save
                  </MDButton>
              </MDBox>       
            </Card>
          </Modal>
        </MDBox>
      </Card>
      {
        selectedContacts.length > 0 &&
        <MDBox mt={2}>
          <Typography ml={3}>Selected Contact(s)</Typography>
          <DataTable table={dataTableData} />
        </MDBox>
      }

    </MDBox>
  );
}

export default ModalSelectContact;
