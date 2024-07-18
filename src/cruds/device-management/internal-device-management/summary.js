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

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CrudService from "services/cruds-service";

function Summary({id}) {
    const [user, setUser] = useState(null);
    const [device, setDevice] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const response = await CrudService.getInternalDevices();
                const data = response.data;
                if(data.length > 0) {
                    setDevice(data[0]);
                    navigate(`/internal-device-management/view-device/${data[0].device_id}`);
                }
                else {
                    const token = localStorage.getItem('token');
        
                    if (token) {
                        const decoded = jwtDecode(token);
                        setUser(decoded);
                    }            
                }
            } catch (error) {
                // Handle errors here, e.g., log the error or show a notification
                console.error('Error fetching internal devices:', error);
            }    
        })();      
    }, []);



    return (
        <DashboardLayout>
            <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <MDBox mb={3} display="flex" justifyContent="center">
                        <Card>
                            <MDBox p={3}>
                                <MDTypography mt={5} mb={5} variant="h5" component="h2" gutterBottom align="center">
                                    Welcome to Rivio! <br/> Dear {user?.name}
                                </MDTypography>
                                <MDTypography p={5} variant="body1" align="center">
                                    We're thrilled to have you with us. Rivio helps you monitor and manage your service industry devices for optimal performance. Here’s how to get started:Set Up Your Profile: Update your profile and verify your email.Add Devices: Go to 'Devices' to add and configure your devices.Explore Dashboard: View device status and performance.Set Up Alerts: Customize alerts to stay informed.Need help? Reach out to support@rivio.io.Enjoy your experience with Rivio!
                                    <br/>Best,The Rivio Team
                                </MDTypography>
                            </MDBox>
                        </Card>
                    </MDBox>
                </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Summary;
