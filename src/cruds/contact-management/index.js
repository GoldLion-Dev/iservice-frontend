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

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Badge from "@mui/material/Badge";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import { Tooltip, IconButton } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import CrudService from "services/cruds-service";
import HTMLReactParser from "html-react-parser";
import { AbilityContext } from "Can";
import { useAbility } from "@casl/react";
import NewUserModal from "cruds/modals/new-user";
import AuthService from "services/auth-service";

function ContactManagement() {
  let { state } = useLocation();
  const ability = useAbility(AbilityContext);
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [notification, setNotification] = useState({
    value: false,
    text: "",
  });
  const [openUserModal, setOpenUserModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState({id: '', email: '', phone: ''});
  const [role, setRole] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
  });

  const setUserCallback = useCallback((newUser) => {
    setUser(newUser);
  }, [setUser]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await CrudService.getContacts();
      setData(response.data);
    })();
    document.title = `RIVIO | Contacts`;
  }, []);

  useEffect(() => {
    if (!state) return;
    setNotification({
      value: state.value,
      text: state.text,
    });
  }, [state]);

  useEffect(() => {
    setTableData(getRows(data));
  }, [data]);

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

  const handleUserModalClose = () => {
    setOpenUserModal(false);
  };


  const clickAddHandler = () => {
    navigate("/contact-management/new-contact");
  };

  const clickEditHandler = (id) => {
    navigate(`/contact-management/edit-contact/${id}`);
  };

  const clickDeleteHandler = async (e, id) => {
    try {
      if (!confirm("Are you sure you want to delete this Contact?")) {
        e.nativeEvent.stopImmediatePropagation();
      } else {
        await CrudService.deleteContact(id);
        // the delete does not send a response
        // so I need to get again the categories to set it and this way the table gets updated -> it goes to the useEffect with data dependecy
        const response = await CrudService.getContacts();
        setData(response.data);
        setNotification({
          value: true,
          text: "The Contact has been successfully deleted",
        });
      }
    } catch (err) {
      // it sends error is the Contact is associated with an Contact
      console.error(err);
      if (err.hasOwnProperty("errors")) {
        setNotification({
          value: true,
          text: err.errors[0].title,
        });
      }
      return null;
    }
  };

  const clickCreateUserHandler = async (id, email, phone) => {
    (async () => {
      const response = await AuthService.getProfile();
      setRole("");
      setUser({
        name: "",
        email: "",
        phone: "",
        organization: response.data.attributes.Organization?.name,
        role: "",
      });
    })();
  
    setOpenUserModal(true);
    setSelectedContact({id: id, email: email, phone: phone});
  };

  const getRows = (info) => {
    let updatedInfo = info.map((row) => {
      let phone = row?.attributes?.ContactAddresses.find(contact => contact.address_type_id === 1 && contact.is_default === true);
      let email = row?.attributes?.ContactAddresses.find(contact => contact.address_type_id === 2 && contact.is_default === true);
      let fax = row?.attributes?.ContactAddresses.find(contact => contact.address_type_id === 3 && contact.is_default === true);

      return {
        type: "contacts",
        id: row.id,
        first_name: row.attributes.first_name,
        last_name: row.attributes.last_name,
        type: row.attributes.ContactType?.type_name,
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
      { Header: "ID", accessor: "id", width: "5%" },
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
              {ability.can("edit", "contacts") && (
                <Tooltip title="Edit Contact">
                  <IconButton onClick={() => clickEditHandler(info.cell.row.original.id)}>
                    <MDTypography><EditIcon /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}
              {ability.can("delete", "contacts") && (
                <Tooltip title="Delete Contact">
                  <IconButton onClick={(e) => clickDeleteHandler(e, info.cell.row.original.id)}>
                    <MDTypography><DeleteIcon /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}
              {ability.can("create", "users") && (
                <Tooltip title="Create User">
                  <IconButton onClick={() => clickCreateUserHandler(info.cell.row.original.id, info.cell.row.original.email, info.cell.row.original.phone)}>
                    <MDTypography><AddIcon /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}              
            </MDBox>
          );
        },
      },
    ],

    rows: tableData,
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {notification.value && (
        <MDAlert color="info" my="20px">
          <MDTypography variant="body2" color="white">
            {notification.text || ""}
          </MDTypography>
        </MDAlert>
      )}
      <MDBox pt={6} pb={3}>
        <MDBox mb={3}>
          <Card>
            <MDBox p={3} lineHeight={1} display="flex" justifyContent="space-between">
              <MDTypography variant="h5" fontWeight="medium">
                Contact Management
              </MDTypography>
              <NewUserModal role={role} setRole={setRole} user={user} setUser={setUserCallback} contact={selectedContact} open={openUserModal} handleClose={handleUserModalClose} />
              {ability.can("create", "contacts") && (
                <MDButton
                  variant="gradient"
                  color="dark"
                  size="small"
                  type="submit"
                  onClick={clickAddHandler}
                >
                  + Add Contact
                </MDButton>
              )}
            </MDBox>
            <DataTable table={dataTableData} canSearch={true} />
          </Card>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ContactManagement;
