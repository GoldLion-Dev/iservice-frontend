import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { InputLabel, Autocomplete } from "@mui/material";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 PRO React examples
import FormField from "layouts/applications/wizard/components/FormField";
import { useNavigate } from "react-router-dom";

import CrudService from "services/cruds-service";

const NewUserModal = ({ role, setRole, user, setUser, contact, open, handleClose }) => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [image, setImage] = useState("");
  const [fileState, setFileState] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [error, setError] = useState({
    name: false,
    email: false,
    phone: false,
    organization: false,
    role: false,
    error: false,
    textError: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await CrudService.getRoles();
        setRoles(response.data);
      } catch (err) {
        console.error(err);
        return null;
      }
    })();
  }, []);

//   const changeHandler = (e) => {
//     setUser({
//       ...user,
//       [e.target.name]: e.target.value,
//     });
//   };

  const changeHandler = (e) => {
    setUser(prevUser => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
  };

  const changeImageHandler = (e) => {
    const formData = new FormData();
    formData.append("attachment", e.target.files[0]);
    setFileState(formData);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const mailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (user.name.trim().length === 0) {
      setError({
        email: false,
        role: false,
        phone: false,
        organization: false,
        name: true,
        textError: "The name cannot be empty",
      });
      return;
    }

    if (user.organization.trim().length === 0) {
      setError({
        email: false,
        role: false,
        phone: false,
        organization: true,
        name: false,
        textError: "The organization cannot be empty",
      });
      return;
    }

    if (contact.email.trim().length === 0 || !contact.email.trim().match(mailFormat)) {
      setError({
        role: false,
        name: false,
        phone: false,
        organization: false,
        email: true,
        textError: "The email is not valid",
      });
      return;
    }

    if (role.id === "") {
      setError({
        name: false,
        email: false,
        role: false,
        phone: false,
        organization: false,
        role: true,
        textError: "Role is required",
      });
      return;
    }

    const newUser = {
      data: {
        type: "users",
        attributes: {
          name: user.name,
          email: contact?.email,
          phone: contact?.phone,
          organization: user.organization,
          profile_image: '',
          contactId: contact.id
        },
        relationships: {
          roles: {
            data: [
              {
                id: role.id?.toString(),
                type: "roles",
              },
            ],
          },
        },
      },
    };

    let res = null;
    try {
        console.log(newUser, 'newUser')
        res = await CrudService.createUser(newUser);
    } catch (err) {
        setError({ ...error, error: true, textError: err.message });
        return null;
    }
    if (res) {
      if (fileState) {
        try {
          const { url } = await CrudService.imageUpload(fileState, res.data.id);
          const userData = {
            data: {
              type: "profile",
              attributes: {
                profile_image: `${process.env.REACT_APP_IMAGES}${url}`,
              },
            },
          };
          const toUpdateUser = {
            data: {
              id: res.data.id?.toString(),
              type: "users",
              attributes: {
                email: contact?.email,
                phone: contact?.phone,      
                profile_image: fileState ? `${process.env.REACT_APP_IMAGES}${url}` : null,
              },
            },
          };
          await CrudService.updateUser(toUpdateUser, res.data.id);
          handleClose();
          navigate("/user-management", {
            state: { value: true, text: "The user was successfully created" },
          });
        } catch (err) {
          if (err.hasOwnProperty("errors")) {
            setError({ ...error, error: true, textError: err.errors[0].detail });
          }
          return null;
        }
      } else {
        handleClose();
        navigate("/user-management", {
          state: { value: true, text: "The user was successfully created" },
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <MDBox component="form" method="POST" onSubmit={submitHandler} encType="multipart/form-data">
          <MDBox display="flex" flexDirection="column" px={3} my={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <MDInput
                  fullWidth
                  label="Name"
                  placeholder="Alec"
                  name="name"
                  value={user.name}
                  onChange={changeHandler}
                  error={error.name}
                  inputProps={{
                    autoComplete: "name",
                    form: {
                      autoComplete: "off",
                    },
                  }}
                />
                {error.name && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    {error.textError}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  fullWidth
                  label="Email"
                  inputProps={{
                    type: "email",
                    autoComplete: "email",
                    form: {
                      autoComplete: "off",
                    },
                  }}
                  name="email"
                  value={contact?.email}
                  error={error.email}
                  readOnly
                />
                {error.email && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    {error.textError}
                  </MDTypography>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={3} mt={4}>
              <Grid item xs={12} sm={6}>
                <MDInput
                  fullWidth
                  label="Phone"
                  inputProps={{ type: "text", autoComplete: "" }}
                  name="phone"
                  value={contact?.phone}
                  error={error.phone}
                  readOnly
                />
                {error.phone && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    {error.textError}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  fullWidth
                  label="Organization"
                  inputProps={{ type: "text", autoComplete: "" }}
                  name="organization"
                  value={user.organization}
                  onChange={changeHandler}
                  error={error.organization}
                  disabled={true}
                />
                {error.organization && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    {error.textError}
                  </MDTypography>
                )}
              </Grid>
            </Grid>
            <MDBox display="flex" flexDirection="column" fullWidth>
              <MDBox display="flex" flexDirection="column" fullWidth marginBottom="1rem" marginTop="2rem">
                <Autocomplete
                    defaultValue=""
                    options={roles}
                    getOptionLabel={(option) => (option ? option.attributes.name : "")}
                    value={role ?? ""}
                    onChange={(event, newValue) => {
                        setRole(newValue);
                    }}
                    renderInput={(params) => (
                        <FormField {...params} label="Role" InputLabelProps={{ shrink: true }} />
                    )}
                />
                {error.role && (
                  <MDTypography variant="caption" color="error" fontWeight="light" paddingTop="1rem">
                    {error.textError}
                  </MDTypography>
                )}
              </MDBox>
              <MDBox display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" fullWidth>
                <MDBox mt={2} display="flex" flexDirection="column">
                  <InputLabel id="demo-simple-select-label">Profile Image</InputLabel>
                  <MDInput
                    fullWidth
                    type="file"
                    name="attachment"
                    onChange={changeImageHandler}
                    id="file-input"
                    accept="image/*"
                    sx={{ mt: "16px" }}
                  />
                </MDBox>

                {imageUrl && (
                  <MDBox ml={4} mt={2}>
                    <MDAvatar src={imageUrl} alt="profile-image" size="xxl" shadow="sm" />
                  </MDBox>
                )}
              </MDBox>
            </MDBox>
          </MDBox>
        </MDBox>
      </DialogContent>
      <DialogActions>
        <MDButton variant="outlined" color="secondary" onClick={handleClose}>
          Cancel
        </MDButton>
        <MDButton variant="gradient" color="dark" onClick={submitHandler}>
          Save
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

export default NewUserModal;
