// src/components/SubDataTable.js

import React from 'react';
import MUIDataTable from 'mui-datatables';

const SubDataTable = ({ data, classes }) => {
  const columns = [
    { name: 'id', label: 'ID' },
    { name: 'name', label: 'Name' },
    { name: 'detail', label: 'Detail' },
  ];

  const options = {
    filter: false,
    search: false,
    selectableRows: 'none',
    pagination: false,
    viewColumns: false,
    print: false,
    download: false,
  };

  return (
    <MUIDataTable
      title={"Details"}
      data={data}
      columns={columns}
      options={options}
      className={classes.table}
    />
  );
};

export default SubDataTable;
