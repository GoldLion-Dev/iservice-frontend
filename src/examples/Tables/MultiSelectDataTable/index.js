import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Badge } from '@mui/material';
import { makeStyles } from '@mui/styles';

const MultiSelectDataTable = ({ rowData, selectedRows, setSelectedRows }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const useStyles = makeStyles({
    root: {
      position: 'relative',
    },
    searchInput: {
      position: 'absolute',
      top: '7%',
      right: '3%',
      padding: '5px',
      borderRadius: '5px',
    },
  });
  const classes = useStyles();

  const handleRowSelection = (selectedItems) => {
    setSelectedRows(selectedItems);
    console.log(selectedItems, selectedItems.selectionModel, 'selectedItems');
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredRows = rowData.filter((row) =>
    Object.values(row).some(
      (value) =>
        String(value)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
  );

  const columns = filteredRows.length > 0 ? Object.keys(filteredRows[0]).map((key) => {
    let column = {
      field: key,
      headerName: key.toUpperCase().replace('_', ' '),
      flex: 1,
    };

    if (key === 'StatusType') {
      column.headerName = 'Status';
      column.renderCell = (params) => {
          console.log(params, 'params')
          const status = params.row?.StatusType?.StatusType?.status_name;
          const badge = params.row?.StatusType?.BadgeDetail;

          return (
              <Badge
                color={badge?.color || 'primary'}
                variant={badge?.variant}
                badgeContent={status}
                style={{ marginLeft: '15px' }}
              />
          );
      };
    }

    if (key === 'AddressType') {
      column.headerName = 'Type';
      column.renderCell = (params) => {
        return params.row?.AddressType?.type_name;
      };
    }

    if (key === 'Company') {
      column.renderCell = (params) => {
        return params.row?.Company?.name;
      };
    }

    if (key === 'ItemType') {
      column.renderCell = (params) => {
        return params.row?.ItemType?.type_name;
      };
    }

    return column;
  }).filter(column => column.field !== 'StatusOption' && column.field !== 'status' && column.field !== 'Attributes' && column.field !== 'Company' && column.field !== 'created_at' && column.field !== 'updated_at') : [];

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        className={classes.searchInput}
      />
      <DataGrid
        className={classes.root}
        rows={filteredRows}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={handleRowSelection}
        selectionModel={selectedRows}
        getRowId={(row) => row.id}
        sx={{
          maxHeight: '70vh',
        }}
      />
    </div>
  );
};

export default MultiSelectDataTable;