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

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import { Tooltip, IconButton, Badge } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import CrudService from "services/cruds-service";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AbilityContext, Can } from "Can";
import { useAbility } from "@casl/react";
import getId from "services/helper-service";
import { Visibility } from "@mui/icons-material";

function ProviderManagement() {
  let { state } = useLocation();

  const navigate = useNavigate();
  const ability = useAbility(AbilityContext);
  const [data, setData] = useState([]);
  const [isDemo, setIsDemo] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [notification, setNotification] = useState({
    value: false,
    text: "",
  });

  useEffect(() => {
    (async () => {
      const response = await CrudService.getProviderServices();
      console.log(response, 'response')
      setData(response);
      setIsDemo(process.env.REACT_APP_IS_DEMO === "true");
    })();
    document.title = `RIVIO | Providers`;
  }, []);

  useEffect(() => {
    setTableData(getRows(data));
  }, [data]);

  useEffect(() => {
    if (!state) return;
    setNotification({
      value: state.value,
      text: state.text,
    });
  }, [state]);

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


  const clickEditHandler = (id) => {
    navigate(`/provider-management/edit-provider/${id}`);
  };

  const getRows = (info) => {
    let updatedInfo = info.map((row) => {
      const serviceNames = row.services.map(service => service.service_name).join(', ');
      return {
        id: row.provider.provider_id,
        provider: row.provider?.provider_name,
        service: serviceNames,
      };
    });
    return updatedInfo;
  };

  
  const dataTableData = {
    columns: [
        { Header: "ID", accessor: "id" },
        { Header: "Provider", accessor: "provider" },
        { Header: "Service", accessor: "service" },
        {
          Header: "actions",
          disableSortBy: true,
          accessor: "",
          Cell: (info) => {
          return (
              <MDBox display="flex" alignItems="center">
                  <Tooltip title="Edit Provider">
                  <IconButton onClick={() => clickEditHandler(info.cell.row.original.id)}>
                      <EditIcon />
                  </IconButton>
                  </Tooltip>
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
            <DataTable table={dataTableData} canSearch={true} />
          </Card>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ProviderManagement;
