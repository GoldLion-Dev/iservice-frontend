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
import { useNavigate, useParams } from "react-router-dom";

import CrudService from "services/cruds-service";
import MDEditor from "components/MDEditor";
import { Popover, List, ListItem, ListItemText } from '@mui/material';
import { MESSAGE_TEMPLATE_VARIABLES } from "utils/constant";
import Scrollbar from 'react-perfect-scrollbar'; // Import Scrollbar component

const EditMessage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState({
        id: "",
        name: "",
        content: "",
    });

    const [error, setError] = useState({
        name: "",
        content: "",
    });

    const [anchorEl, setAnchorEl] = useState(null);
    const variables = MESSAGE_TEMPLATE_VARIABLES;
  
    useEffect(() => {
        if (!id) return;
        (async () => {
        try {

            const res = await CrudService.getMessage(id);
            setMessage({
                id: res.data.id,
                name: res.data.attributes?.name,
                content: res.data.attributes?.content,
            });
        } catch (err) {
            console.error(err);
        }
        })();
    }, [id]);


    const submitHandler = async (e) => {
        e.preventDefault();

        // const formattedCompany = company.map((element) => element.attributes);
        const updateMessage = {
            data: {
                type: "messages",
                attributes: {
                    name: message.name,
                    content: message.content,
                },
            },
        };

        try {
            console.log(updateMessage, 'updateMessage')
            await CrudService.updateMessage(updateMessage, id);
            navigate("/message-management", {
                state: { value: true, text: "The Message was successfully created" },
            });
        } catch (err) {
            if (err.hasOwnProperty("errors")) {
                setError({ ...error, error: true, textError: err.errors[0].detail });
            }
            console.error(err);
        }
    };

    const changeNameHandler = (e) => {
        setMessage({ ...message, name: e.target.value });
    };

    const handleEditorChange = (value) => {
        if(value.includes('#')) {
            setAnchorEl(document.activeElement);
            return;
        }
        setMessage({ ...message, content: value });
    };

    const handleVariableInsertion = (variable) => {
        setMessage(prevMessage => ({
            ...prevMessage,
            content: `${prevMessage.content}{${variable}}`
        }));
        
        setAnchorEl(null);
    };
    
    
    const styles = {
        editorContainer: {
            position: 'relative',
        },
        variableList: {
            position: 'absolute',
            top: 'calc(100% - 80px)', // Place the variable list just below the editor with a small gap
            left: 30,
            backgroundColor: 'lightgrey',
            listStyleType: 'none',
            padding: 0,
            margin: 0,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            zIndex: 999, // Ensure the variable list appears above other elements
        },
        heading: {
          fontSize: '1.2rem',
          fontWeight: 'bold',
          marginBottom: '10px',
        },
        listItem: {
          cursor: 'pointer',
          padding: '5px',
          borderBottom: '1px solid #ccc',
        },
      };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mt={5} mb={9}>
                <Grid container justifyContent="center">
                    <Grid item xs={12} lg={8}>
                        <MDBox mt={6} mb={8} textAlign="center">
                            <MDBox mb={1}>
                                <MDTypography variant="h3" fontWeight="bold">
                                Edit Message {id}
                                </MDTypography>
                            </MDBox>
                            <MDTypography variant="h5" fontWeight="regular" color="secondary">
                                This information will describe more about the Message.
                            </MDTypography>
                        </MDBox>
                        <Card>
                            <MDBox component="form" method="POST" onSubmit={submitHandler}>
                                <MDBox display="flex" flexDirection="column" px={3} my={2}>
                                    <FormField
                                        type="text"
                                        label=" Name"
                                        name="name"
                                        value={message.name}
                                        onChange={changeNameHandler}
                                        error={error.name}
                                    />                    

                                    <MDBox mt={2}>
                                        <MDBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                                            <MDTypography
                                                component="label"
                                                variant="button"
                                                fontWeight="regular"
                                                color="text"
                                            >
                                                Message Content&nbsp;&nbsp;
                                            </MDTypography>
                                        </MDBox>
                                        <MDEditor value={message.content} onChange={handleEditorChange} />  
                                        <Popover
                                            open={Boolean(anchorEl)}
                                            anchorEl={anchorEl}
                                            onClose={() => setAnchorEl(null)}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                        >
                                            <Scrollbar >
                                                <List style={{ backgroundColor: 'white', overflowY: 'scroll', maxHeight: '200px' }}>
                                                    <MDTypography>Message Template Variables</MDTypography>
                                                    {variables.map((variable, index) => (
                                                        <ListItem key={index} button onClick={() => handleVariableInsertion(variable)} >
                                                            <ListItemText>
                                                                <MDTypography variant="body2">* {variable}</MDTypography>
                                                            </ListItemText>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Scrollbar>
                                            <style>
                                            {`
                                            /* CSS to hide the ps__rail-y div */
                                            .ps__rail-y {
                                                display: none !important;
                                            }

                                            /* CSS to set the height of ps__rail-y to 0 */
                                            .ps__rail-y {
                                                height: 0 !important;
                                            }
                                            `}
                                            </style>
                                        </Popover>                 
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
                                                navigate("/message-management", {
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

export default EditMessage;
