import React, { useState } from 'react';
import { DataGrid, FilterToolbar } from '@mui/x-data-grid';
import { TextField } from '@mui/material';
import MDBox from 'components/MDBox';
import { makeStyles } from '@mui/styles';

const EntityAddressItemSelectDataTable = ({rowData, selectedRows, setSelectedRows}) => {
  const useStyles = makeStyles({
    root: {
      '& .MuiDataGrid-row.Mui-selected': {
        backgroundColor: 'rgba(0, 0, 255, 0.3)', // Customize selected row background color
      },
      '& .MuiDataGrid-row.Mui-selected:hover': {
        backgroundColor: 'rgba(0, 0, 255, 0.3)', // Keep the same background color on hover
      },
      '& .MuiDataGrid-row:hover': {
        backgroundColor: 'rgba(0, 0, 255, 0.04)', // Customize background color on hover
      },
      '& .MuiDataGrid-cell:focus-within': {
        outline: 'none', // Remove outline on cell focus
      },
    },
  });
  const classes = useStyles();

  const [searchQuery, setSearchQuery] = useState('');

  // const filteredRows = rowData.filter((row) =>
  //   row.Entity?.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  const filteredRows = rowData.filter((row) => {
    // Convert searchQuery to lowercase for case-insensitive comparison
    const searchLower = searchQuery.toLowerCase();

    // Check if any property value in any cell of the row matches the search query
    return Object.values(row).some((cellValue) => {
        // If cellValue is an object, extract its string representation for comparison
        if (typeof cellValue === 'object' && cellValue !== null) {
            cellValue = Object.values(cellValue).join(' ');
        }
        // Check if the cellValue exists, is a string, and includes the search query (case-insensitive)
        return cellValue && typeof cellValue === 'string' && cellValue.toLowerCase().includes(searchLower);
    });
  });

  const handleRowSelection = (selectedItems) => {
    setSelectedRows(selectedItems);
  };

  const columns = [
    { field: 'address_item_id', headerName: 'Entity Address Item ID', flex: 1 },
    {
      field: 'Entity.name',
      headerName: 'Entity Name',
      flex: 1,
      valueGetter: (params) => {
        const entityName = params.row.Entity?.name;
        const firstName = params.row.Entity?.first_name;
        const lasttName = params.row.Entity?.last_name;
    
        // Check if Entity.name is empty or null, then use first_name
        return entityName ? entityName : firstName + ' ' + lasttName;
      }
    },
    { field: 'Item.name', headerName: 'Item Name', flex: 1, valueGetter: (params) => params.row.Item?.name },
    { field: 'name', headerName: 'Entity Address Name', flex: 1, valueGetter: (params) => params.row?.name },
    { field: 'Address.street_address1', headerName: 'Street Address', flex: 1, valueGetter: (params) => params.row.Address?.street_address1 },
    { field: 'Address.city', headerName: 'City', flex: 1, valueGetter: (params) => params.row.Address?.city },
    { field: 'Address.state', headerName: 'State', flex: 1, valueGetter: (params) => params.row.Address?.state },
    { field: 'Address.country', headerName: 'Country', flex: 1, valueGetter: (params) => params.row.Address?.country },
    { field: 'Address.latitude', headerName: 'Latitude', flex: 1, valueGetter: (params) => params.row.Address?.latitude },
    { field: 'Address.longitude', headerName: 'Longitude', flex: 1, valueGetter: (params) => params.row.Address?.longitude },

  ];

  return (
    <MDBox display="flex" flexDirection="column">
      <MDBox display="flex" justifyContent="right" alignItems="right">
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </MDBox>
      <DataGrid
        className={classes.root}
        rows={filteredRows}
        columns={columns}
        onRowSelectionModelChange={handleRowSelection}
        selectionModel={selectedRows}
        getRowId={(row) => row.id}
        sx={{
          maxHeight: '70vh', // Limit the modal height to 80% of viewport height
        }}
      />
    </MDBox>
  );
};

export default EntityAddressItemSelectDataTable;
