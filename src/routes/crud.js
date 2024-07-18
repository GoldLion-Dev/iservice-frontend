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

import EditItem from "cruds/item-management/edit-item";
import NewCompany from "cruds/company-management/new-company";
import NewEntity from "cruds/entity-management/new-entity";
import NewItem from "cruds/item-management/new-item";
import EditRole from "cruds/role-managament/edit-role";
import NewRole from "cruds/role-managament/new-role";
import EditTag from "cruds/tag-management/edit-tag";
import NewTag from "cruds/tag-management/new-tag";
import EditUser from "cruds/user-management/edit-user";
import NewUser from "cruds/user-management/new-user";
import EditCompany from "cruds/company-management/edit-company";
import EditEntity from "cruds/entity-management/edit-entity";
import NewDevice from "cruds/device-management/internal-device-management/new-device";
import EditDevice from "cruds/device-management/internal-device-management/edit-device";
import ViewEntity from "cruds/entity-management/view-entity";
import NewContact from "cruds/contact-management/new-contact";
import EditContact from "cruds/contact-management/edit-contact";
import NewAPI from "cruds/api-management/new-api";
import EditAPI from "cruds/api-management/edit-api";
import NewMonitorDevice from "cruds/device-management/monitor-management/new-monitor";
import EditMonitorDevice from "cruds/device-management/monitor-management/edit-monitor";
import ViewMonitorDevice from "cruds/device-management/monitor-management/view-monitor";
import NewParameter from "cruds/api/mapping/internal-parameter/new-parameter";
import EditParameter from "cruds/api/mapping/internal-parameter/edit-parameter";
import NewMessage from "cruds/message-management/new-message";
import EditMessage from "cruds/message-management/edit-message";
import ViewDevice from "cruds/device-management/internal-device-management/view-device";
import EditProvider from "cruds/provider-management/edit-provider";

/** 
  All of the routes for the Material Dashboard 2 PRO React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 PRO React layouts

const crudRoutes = [
  {
    key: "new-company",
    route: "/company-management/new-company",
    component: <NewCompany />,
    type: "companies",
  },
  {
    key: "edit-company",
    route: "/company-management/edit-company/:id",
    component: <EditCompany />,
    type: "companies",
  },
  {
    key: "view-entity",
    route: "/entity-management/view-entity/:id",
    component: <ViewEntity />,
    type: "entities",
  },
  {
    key: "new-entity",
    route: "/entity-management/new-entity",
    component: <NewEntity />,
    type: "entities",
  },
  {
    key: "edit-entity",
    route: "/entity-management/edit-entity/:id",
    component: <EditEntity />,
    type: "entities",
  },
  {
    key: "new-tag",
    route: "/tag-management/new-tag",
    component: <NewTag />,
    type: "tags",
  },
  {
    key: "edit-tag",
    route: "/tag-management/edit-tag/:id",
    component: <EditTag />,
    type: "tags",
  },
  {
    key: "new-role",
    route: "/role-management/new-role",
    component: <NewRole />,
    type: "roles",
  },
  {
    key: "edit-role",
    route: "/role-management/edit-role/:id",
    component: <EditRole />,
    type: "roles",
  },
  {
    key: "new-user",
    route: "/user-management/new-user",
    component: <NewUser />,
    type: "users",
  },
  {
    key: "edit-user",
    route: "/user-management/edit-user/:id",
    component: <EditUser />,
    type: "users",
  },
  {
    key: "new-item",
    route: "/item-management/new-item",
    component: <NewItem />,
    type: "items",
  },
  {
    key: "edit-item",
    route: "/item-management/edit-item/:id",
    component: <EditItem />,
    type: "items",
  },
  {
    key: "view-device",
    route: "/internal-device-management/view-device/:id",
    component: <ViewDevice />,
    type: "devices",
  },
  {
    key: "new-device",
    route: "/internal-device-management/new-device",
    component: <NewDevice />,
    type: "devices",
  },
  {
    key: "edit-device",
    route: "/internal-device-management/edit-device/:id",
    component: <EditDevice />,
    type: "devices",
  },
  {
    key: "new-monitor",
    route: "/monitor-management/new-monitor",
    component: <NewMonitorDevice />,
    type: "monitors",
  },
  {
    key: "view-monitor",
    route: "/monitor-management/view-monitor/:id",
    component: <ViewMonitorDevice />,
    type: "monitors",
  },
  {
    key: "edit-monitor",
    route: "/monitor-management/edit-monitor/:id",
    component: <EditMonitorDevice />,
    type: "monitors",
  },
  {
    key: "new-contact",
    route: "/contact-management/new-contact",
    component: <NewContact />,
    type: "contacts",
  },
  {
    key: "edit-contact",
    route: "/contact-management/edit-contact/:id",
    component: <EditContact />,
    type: "contacts",
  },
  {
    key: "new-api",
    route: "/api-management/new-api",
    component: <NewAPI />,
    type: "apis",
  },
  {
    key: "edit-api",
    route: "/api-management/edit-api/:id",
    component: <EditAPI />,
    type: "apis",
  },
  {
    key: "new-internal-parameter",
    route: "/internal-parameter-management/new-parameter",
    component: <NewParameter />,
    type: "parameters",
  },
  {
    key: "edit-internal-parameter",
    route: "/internal-parameter-management/edit-parameter/:id",
    component: <EditParameter />,
    type: "parameters",
  },
  {
    key: "new-message",
    route: "/message-management/new-message",
    component: <NewMessage />,
    type: "messages",
  },
  {
    key: "edit-message",
    route: "/message-management/edit-message/:id",
    component: <EditMessage />,
    type: "messages",
  },
  {
    key: "edit-provider",
    route: "/provider-management/edit-provider/:id",
    component: <EditProvider />,
    type: "providers",
  },

];

export default crudRoutes;
