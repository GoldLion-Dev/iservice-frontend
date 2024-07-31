import HttpService from "./http.service";

class CrudService {
  // users requests
  imageUpload = async (formData, id) => {
    const imageUpdate = `uploads/users/${id}/profile-image`;
    return await HttpService.post(imageUpdate, formData);
  };

  getUsers = async () => {
    const usersEndpoint = "users?include=Role,Organization";
    return await HttpService.get(usersEndpoint);
  };

  deleteUser = async (id) => {
    const endpoint = `users/${id}`;
    return await HttpService.delete(endpoint);
  };

  createUser = async (payload) => {
    const endpoint = "users";
    return await HttpService.post(endpoint, payload);
  };

  getUser = async (id) => {
    const endpoint = `users/${id}?include=Role`;
    return await HttpService.get(endpoint);
  };

  getUserWithPermissions = async (id) => {
    const endpoint = `users/${id}?include=Role,Role.Permission,Organization`;
    return await HttpService.get(endpoint);
  };

  updateUser = async (payload, id) => {
    const endpoint = `users/${id}`;
    return await HttpService.patch(endpoint, payload);
  };

  // roles requests
  getRoles = async () => {
    const rolesEndpoint = "roles";
    return await HttpService.get(rolesEndpoint);
  };

  // module 

  getOrganizations = async () => {
    const organizationsEndpoint = "modules/organizations";
    return await HttpService.get(organizationsEndpoint);
  };

  getAddressTypes = async () => {
    const addressTypesEndpoint = "modules/address_types";
    return await HttpService.get(addressTypesEndpoint);
  };

  getEntityTypes = async () => {
    const entityTypesEndpoint = "modules/entity_types";
    return await HttpService.get(entityTypesEndpoint);
  };

  getItemTypes = async () => {
    const itemTypesEndpoint = "modules/item_types";
    return await HttpService.get(itemTypesEndpoint);
  };

  getContactTypes = async () => {
    const contactTypesEndpoint = "modules/contact_types";
    return await HttpService.get(contactTypesEndpoint);
  };

  getContactAddressTypes = async () => {
    const contactAddressTypesEndpoint = "modules/contact_address_types";
    return await HttpService.get(contactAddressTypesEndpoint);
  };
  
  getItemAttributes = async () => {
    const companiesEndpoint = "modules/item-attributes";
    return await HttpService.get(companiesEndpoint);
  };

  getModuleAddresses = async (payload) => {
    const endpoint = "modules/module_addresses";
    return await HttpService.post(endpoint, payload);
  };

  getDeviceTypes = async () => {
    const deviceTypesEndpoint = "modules/device_types";
    return await HttpService.get(deviceTypesEndpoint);
  };

  getEntityAddressItems = async () => {
    const entityAddressItemsEndpoint = "modules/entity_address_items";
    return await HttpService.get(entityAddressItemsEndpoint);
  };
  
  getDeviceBrands = async () => {
    const deviceBrandsEntityEndpoint = "modules/device_brands";
    return await HttpService.get(deviceBrandsEntityEndpoint);
  };

  getDeviceModels = async () => {
    const deviceModelsEntityEndpoint = "modules/device_models";
    return await HttpService.get(deviceModelsEntityEndpoint);
  };
  
  getDeviceTypeBrand = async () => {
    const deviceTypeBrandsEntityEndpoint = "modules/device-type-brand";
    return await HttpService.get(deviceTypeBrandsEntityEndpoint);
  };
  
  getDeviceBrandModel = async () => {
    const deviceBrandModelsEndpoint = "modules/device-brand-model";
    return await HttpService.get(deviceBrandModelsEndpoint);
  };

  getAPINames = async () => {
    const apiNamesEndpoint = "modules/api-name";
    return await HttpService.get(apiNamesEndpoint);
  }
  
  getDeviceParameters = async () => {
    const deviceParametersEndpoint = "modules/device-parameters";
    return await HttpService.get(deviceParametersEndpoint);
  }

  getIcons = async () => {
    const iconsEndpoint = "modules/icons";
    return await HttpService.get(iconsEndpoint);
  }

  getFieldTypes = async () => {
    const fieldTypesEndpoint = "modules/fieldTypes";
    return await HttpService.get(fieldTypesEndpoint);
  }

  getEventTypes = async () => {
    const endpoint = "modules/eventTypes";
    return await HttpService.get(endpoint);
  }
  
  getAlertSubTypes = async () => {
    const endpoint = "modules/alert_sub_types";
    return await HttpService.get(endpoint);
  }
  
  getSendToTypes = async () => {
    const endpoint = "modules/sendToTypes";
    return await HttpService.get(endpoint);
  }

  getEntityContacts = async (payload) => {
    const endpoint = "modules/entityContacts";
    return await HttpService.post(endpoint, payload);
  }

  getProviderContacts = async (payload) => {
    const endpoint = "modules/providerContacts";
    return await HttpService.post(endpoint, payload);
  }
  
  getDeviceParameterTypes = async () => {
    const deviceParameterTypesEndpoint = "modules/device-parameter-types";
    return await HttpService.get(deviceParameterTypesEndpoint);
  }
  
  getComparisonOperators = async () => {
    const comparisonOperatorsEndpoint = "modules/comparison_operators";
    return await HttpService.get(comparisonOperatorsEndpoint);
  }
  
  getThresholdTypes = async () => {
    const thresholdTypesEndpoint = "modules/threshold_types";
    return await HttpService.get(thresholdTypesEndpoint);
  }
  
  getAlertTypes = async () => {
    const endpoint = `modules/alert_types`;
    return await HttpService.get(endpoint);
  };

  getStatusTypes = async (payload) => {
    const endpoint = "modules/status_types";
    return await HttpService.post(endpoint, payload);
  };

  getServiceItems = async () => {
    const endpoint = `modules/service_items`;
    return await HttpService.get(endpoint);
  };

  getPriorities = async () => {
    const endpoint = `modules/priorities`;
    return await HttpService.get(endpoint);
  };

  ////////////// service reuqest ////////////////
  
  createServiceRequest = async (payload) => {
    const endpoint = "service-request";
    return await HttpService.post(endpoint, payload);
  };

  getServiceRequests = async (payload) => {
    const endpoint = `service-request/${payload}`;
    return await HttpService.get(endpoint);
  };
  ////////////// role //////////////

  deleteRole = async (id) => {
    const endpoint = `roles/${id}`;
    return await HttpService.delete(endpoint);
  };

  createRole = async (payload) => {
    const endpoint = "roles";
    return await HttpService.post(endpoint, payload);
  };

  updateRole = async (payload, id) => {
    const endpoint = `roles/${id}`;
    return await HttpService.patch(endpoint, payload);
  };

  getRole = async (id) => {
    const endpoint = `roles/${id}`;
    return await HttpService.get(endpoint);
  };

  // categories requests
  getCategories = async () => {
    const categoriesEndpoint = "categories";
    return await HttpService.get(categoriesEndpoint);
  };

  deleteCategory = async (id) => {
    const endpoint = `categories/${id}`;
    return await HttpService.delete(endpoint);
  };

  createCategory = async (payload) => {
    const endpoint = "categories";
    return await HttpService.post(endpoint, payload);
  };

  getCategory = async (id) => {
    const categoriesEndpoint = `categories/${id}`;
    return await HttpService.get(categoriesEndpoint);
  };

  updateCategory = async (payload, id) => {
    const categoriesEndpoint = `categories/${id}`;
    return await HttpService.patch(categoriesEndpoint, payload);
  };

  // companies requests

  getCompanies = async () => {
    const companiesEndpoint = "companies";
    return await HttpService.get(companiesEndpoint);
  };

  deleteCompany = async (id) => {
    const endpoint = `companies/${id}`;
    return await HttpService.delete(endpoint);
  };

  createCompany = async (payload) => {
    const endpoint = "companies";
    return await HttpService.post(endpoint, payload);
  };

  getCompany = async (id) => {
    const companiesEndpoint = `companies/${id}`;
    return await HttpService.get(companiesEndpoint);
  };

  updateCompany = async (payload, id) => {
    const companiesEndpoint = `companies/${id}`;
    return await HttpService.patch(companiesEndpoint, payload);
  };  

  // Entity
  getEntities = async () => {
    const EntitiesEndpoint = "entities";
    return await HttpService.get(EntitiesEndpoint);
  };

  deleteEntity = async (id) => {
    const endpoint = `entities/${id}`;
    return await HttpService.delete(endpoint);
  };

  createEntity = async (payload) => {
    const endpoint = "entities";
    return await HttpService.post(endpoint, payload);
  };

  getEntity = async (id) => {
    const EntitiesEndpoint = `entities/${id}`;
    return await HttpService.get(EntitiesEndpoint);
  };

  updateEntity = async (payload, id) => {
    const EntitiesEndpoint = `entities/${id}`;
    return await HttpService.patch(EntitiesEndpoint, payload);
  };  

  // Event logs
  getEventLogs = async () => {
    const eventlogsEndpoint = "eventlogs";
    return await HttpService.get(eventlogsEndpoint);
  };


  // alert
  getAlerts = async () => {
    const alertsEndpoint = "alerts";
    return await HttpService.get(alertsEndpoint);
  };

  getDeviceAlerts = async (payload) => {
    const alertsEndpoint = "alerts/device";
    return await HttpService.post(alertsEndpoint, payload);
  };

  getAlertRules = async (payload) => {
    console.log(payload, 'rules')
    const endpoint = "alertrules/list";
    return await HttpService.post(endpoint, payload);
  };

  getAlertRule = async (id) => {
    console.log(id, 'id')
    const endpoint = `alertrules/${id}`;
    return await HttpService.get(endpoint);
  };

  createAlertRule = async (payload) => {
    const endpoint = `alertrules`;
    return await HttpService.post(endpoint, payload);
  };

  editAlertRule = async (payload, id) => {
    console.log(id, 'id')
    const endpoint = `alertrules/${id}`;
    return await HttpService.patch(endpoint, payload);
  };

  deleteAlertRule = async (id) => {
    const endpoint = `alertrules/${id}`;
    return await HttpService.delete(endpoint);
  };

  deleteAlert = async (id) => {
    const endpoint = `alertrules/${id}`;
    return await HttpService.delete(endpoint);
  };

  getSendGrid = async () => {
    const endpoint = "alerts/sendgrid";
    return await HttpService.get(endpoint);
  };

  getAlert = async (id) => {
    const endpoint = `alerts/${id}`;
    return await HttpService.get(endpoint);
  };

  deleteAlert = async (id) => {
    const endpoint = `alerts/${id}`;
    return await HttpService.delete(endpoint);
  };

  // provider
  getProviders = async () => {
    const providersEndpoint = "providers";
    return await HttpService.get(providersEndpoint);
  };

  getProvider = async (id) => {
    const endpoint = `providers/${id}`;
    return await HttpService.get(endpoint);
  };

  getProviderServices = async () => {
    const providersEndpoint = "providers/services";
    return await HttpService.get(providersEndpoint);
  };

  updateProvider = async (payload, id) => {
    const endpoint = `providers/${id}`;
    return await HttpService.patch(endpoint, payload);
  };

  setProviderActive = async (payload) => {
    const endpoint = `providers/active-device`;
    return await HttpService.post(endpoint, payload);
  };


  // tag requests
  getTags = async () => {
    const tagsEndpoint = "tags";
    return await HttpService.get(tagsEndpoint);
  };

  deleteTag = async (id) => {
    const endpoint = `tags/${id}`;
    return await HttpService.delete(endpoint);
  };

  createTag = async (payload) => {
    const endpoint = "tags";
    return await HttpService.post(endpoint, payload);
  };

  getTag = async (id) => {
    const endpoint = `tags/${id}`;
    return await HttpService.get(endpoint);
  };

  updateTag = async (payload, id) => {
    const endpoint = `tags/${id}`;
    return await HttpService.patch(endpoint, payload);
  };

  getCategoryOfItem = async (id) => {
    const endpoint = `items/${id}/category`;
    return await HttpService.get(endpoint);
  };

  getTagsOfItem = async (id) => {
    const endpoint = `items/${id}/tags`;
    return await HttpService.get(endpoint);
  };

  itemImageUpload = async (formData, id) => {
    const imageUpdate = `uploads/items/${id}/image`;
    return await HttpService.post(imageUpdate, formData);
  };

  // item requests
  getItems = async () => {
    const tagsEndpoint = "items";
    return await HttpService.get(tagsEndpoint);
  };

  createItem = async (payload) => {
    const endpoint = "items";
    return await HttpService.post(endpoint, payload);
  };

  deleteItem = async (id) => {
    const endpoint = `items/${id}`;
    return await HttpService.delete(endpoint);
  };

  getItem = async (id) => {
    const endpoint = `items/${id}?include=category,tags`
    return await HttpService.get(endpoint);
  }

  getItemAttributeTypes = async () => {
    const itemTypesEndpoint = "items/attributetypes";
    return await HttpService.get(itemTypesEndpoint);
  };

  updateItem = async (payload, id) => {
    const endpoint = `items/${id}`;
    return await HttpService.patch(endpoint, payload);
  };

  ////////// device ////////////

  getInternalDevices = async () => {
    const tagsEndpoint = "devices";
    return await HttpService.get(tagsEndpoint);
  };

  createDevice = async (payload) => {
    const endpoint = "devices";
    return await HttpService.post(endpoint, payload);
  };

  deleteDevice = async (id) => {
    const endpoint = `devices/${id}`;
    return await HttpService.delete(endpoint);
  };

  getDevice = async (id) => {
    const endpoint = `devices/${id}`
    return await HttpService.get(endpoint);
  }

  getDeviceView = async (id) => {
    const endpoint = `devices/view/${id}`
    return await HttpService.get(endpoint);
  }

  setDeviceAlertEnable = async (payload) => {
    const endpoint = `devices/set_alert_enable`;
    return await HttpService.post(endpoint, payload);
  };

  updateDevice = async (payload, id) => {
    const endpoint = `devices/${id}`;
    return await HttpService.patch(endpoint, payload);
  };


  //////////// external devices ///////////////

  getExternalDevices = async () => {
    const tagsEndpoint = "devices/external";
    return await HttpService.get(tagsEndpoint);
  };

  mapDevice = async (payload) => {
    const endpoint = "devices/map";
    return await HttpService.post(endpoint, payload);
  };


  /////////////////// parameter ///////////////////
  
  getExternalParameters = async () => {
    const paramsEndpoint = "parameters/external-parameters";
    return await HttpService.get(paramsEndpoint);
  };

  getInternalParameters = async () => {
    const paramsEndpoint = "parameters/internal-parameters";
    return await HttpService.get(paramsEndpoint);
  };

  getDeviceParameterValues = async (id) => {
    const endpoint = `parameters/parameter-logs/${id}`;
    return await HttpService.get(endpoint);
  };
   
  getInternalParameter = async (id) => {
    const endpoint = `parameters/${id}`
    return await HttpService.get(endpoint);
  }

  getInternalFromExternalParameter = async (id) => {
    const endpoint = `parameters/external/${id}`
    return await HttpService.get(endpoint);
  }

  mapParameter = async (payload) => {
    const endpoint = "parameters/map-parameter";
    return await HttpService.post(endpoint, payload);
  };

  createInternalParameter = async (payload) => {
    const endpoint = "parameters";
    return await HttpService.post(endpoint, payload);
  };

  updateInternalParameter = async (payload, id) => {
    const endpoint = `parameters/${id}`;
    return await HttpService.patch(endpoint, payload);
  };

  deleteInternalParameter = async (id) => {
    const endpoint = `parameters/${id}`;
    return await HttpService.delete(endpoint);
  };

  ////////// device monitor ////////////

    getDeviceMonitors = async () => {
      const tagsEndpoint = "monitors";
      return await HttpService.get(tagsEndpoint);
    };

    getInternalRestDevices = async () => {
      const tagsEndpoint = "devices/rest";
      return await HttpService.get(tagsEndpoint);
    };  
  
    createDeviceMonitor = async (payload) => {
      const endpoint = "monitors";
      return await HttpService.post(endpoint, payload);
    };
  
    deleteDeviceMonitor = async (id) => {
      const endpoint = `monitors/${id}`;
      return await HttpService.delete(endpoint);
    };
  
    getDeviceMonitor = async (id) => {
      const endpoint = `monitors/${id}`
      console.log(endpoint, 'endpoint')
      return await HttpService.get(endpoint);
    }
  
    updateDeviceMonitor = async (payload, id) => {
      const endpoint = `monitors/${id}`;
      return await HttpService.patch(endpoint, payload);
    };
  
  //////////// contacts //////////////

  getContacts = async () => {
    const tagsEndpoint = "contacts";
    return await HttpService.get(tagsEndpoint);
  };

  createContact = async (payload) => {
    const endpoint = "contacts";
    return await HttpService.post(endpoint, payload);
  };

  updateContact = async (payload, id) => {
    const endpoint = `contacts/${id}`;
    return await HttpService.patch(endpoint, payload);
  };

  deleteContact = async (id) => {
    const endpoint = `contacts/${id}`;
    return await HttpService.delete(endpoint);
  };

  getContact = async (id) => {
    const endpoint = `contacts/${id}`
    return await HttpService.get(endpoint);
  }

    //////////// apis //////////////

    getAPIs = async () => {
      const apisEndpoint = "apis";
      return await HttpService.get(apisEndpoint);
    };
  
    createAPI = async (payload) => {
      const endpoint = "apis";
      return await HttpService.post(endpoint, payload);
    };
  
    updateAPI = async (payload, id) => {
      const endpoint = `apis/${id}`;
      return await HttpService.patch(endpoint, payload);
    };
  
    deleteAPI = async (id) => {
      const endpoint = `apis/${id}`;
      return await HttpService.delete(endpoint);
    };
  
    getAPI = async (id) => {
      const endpoint = `apis/${id}`
      return await HttpService.get(endpoint);
    }
  
    //////////// message template //////////////

    getMessages = async () => {
      const messagesEndpoint = "messages";
      return await HttpService.get(messagesEndpoint);
    };
  
    createMessage = async (payload) => {
      const endpoint = "messages";
      return await HttpService.post(endpoint, payload);
    };
  
    updateMessage = async (payload, id) => {
      const endpoint = `messages/${id}`;
      return await HttpService.patch(endpoint, payload);
    };
  
    deleteMessage = async (id) => {
      const endpoint = `messages/${id}`;
      return await HttpService.delete(endpoint);
    };
  
    getMessage = async (id) => {
      const endpoint = `messages/${id}`
      return await HttpService.get(endpoint);
    }
  
}

export default new CrudService();
