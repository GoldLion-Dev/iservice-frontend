import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Visibility from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@material-ui/core/styles';
import MDBox from 'components/MDBox';
import { TableSortLabel, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';

// Create a row function
const Row = ({ group, columns, clickViewHandler, clickDeleteHandler }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {columns.map((column) => (
          <TableCell key={column.accessor} width={column.width}>
            {column.accessor === 'actions' ? (
              <Box display="flex" alignItems="center">
                <Tooltip title="View Info">
                  <IconButton onClick={() => clickViewHandler(group.header.id)}>
                    <Visibility />
                  </IconButton>
                </Tooltip>
                {
                  clickDeleteHandler &&
                  <Tooltip title="Delete Alert">
                    <IconButton onClick={(e) => clickDeleteHandler(e, group.header.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>

                }
              </Box>
            ) : (
              group.header[column.accessor]
            )}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell colSpan={columns.length + 1} style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: '100px', paddingRight: '50px' }} >
          <Collapse in={open} timeout="auto" unmountOnExit>
            {group.children.map((child) => (
              <TableRow key={child.id}>
                {columns.map((column) => (
                  <TableCell key={column.accessor} width={column.width}>
                    {column.accessor === 'actions' ? (
                      <Box display="flex" alignItems="center">
                        <Tooltip title="View Info">
                          <IconButton onClick={() => clickViewHandler(group.header.id)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <TableCell key={column.accessor}>{child[column.accessor]}</TableCell>
                    )}
                  </TableCell>
                ))}

              </TableRow>
            ))}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
  

Row.propTypes = {
  parentRow: PropTypes.shape({
    id: PropTypes.string.isRequired,
    alert_type: PropTypes.string,
    device: PropTypes.string,
    alert_message: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    status: PropTypes.node.isRequired,
  }).isRequired,
  childRows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      alert_type: PropTypes.string,
      device: PropTypes.string,
      alert_message: PropTypes.string,
      created_at: PropTypes.string,
      updated_at: PropTypes.string,
      status: PropTypes.node.isRequired,
    })
  ).isRequired,
  columns: PropTypes.array.isRequired,
  clickViewHandler: PropTypes.func.isRequired,
  clickDeleteHandler: PropTypes.func.isRequired,
};

const useStyles = makeStyles({
    customTableHead: {
        display: 'table-header-group!important', // Use the correct CSS property without quotes
    },
});

export default function CollapsibleTable({ data, columns, clickViewHandler, clickDeleteHandler }) {
    const classes = useStyles();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');
    
    const groupAlerts = (alerts) => {
      const groupedAlerts = [];
      let currentGroup = null;
    
      alerts.forEach((alert) => {
        console.log(alert, '-------alert---------')
        if (alert.is_parent) {
          if (currentGroup) {
            groupedAlerts.push(currentGroup);
          }
          currentGroup = {
            alert_type_id: alert.alert_type_id,
            header: alert,
            children: [],
          };
        } else if (currentGroup && currentGroup.alert_type_id === alert.alert_type_id) {
          currentGroup.children.push(alert);
        }
      });
    
      if (currentGroup) {
        groupedAlerts.push(currentGroup);
      }
    
      return groupedAlerts;
    };

    const groupedData = groupAlerts(data);

    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
    };

    const handleSort = (column) => {
      const isAsc = orderBy === column && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(column);
    };
    

    
    return (
      <TableContainer component={Paper}>
        <MDBox style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
          {/* <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
          </Select> */}
          <MDBox></MDBox>
          <TextField
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                </InputAdornment>
              ),
            }}
          />
        </MDBox>
        <Table aria-label="collapsible table">
          <TableHead classes={{ root: classes.customTableHead }}>
            <TableRow>
              <TableCell />
              {columns.map((column) => (
                <TableCell
                  key={column.accessor}
                  sx={{
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    userSelect: 'none',
                    color: '#7b809a',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    justifyContent: 'left',
                    marginLeft: 0,
                  }}
                  sortDirection={orderBy === column.accessor ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === column.accessor}
                    direction={orderBy === column.accessor ? order : 'asc'}
                    onClick={() => handleSort(column.accessor)}
                  >
                    {column.Header}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedData
              .filter(group => Object.values(group.header).some(value => String(value).toLowerCase().includes(searchQuery.toLowerCase())))
              .sort((a, b) => {
                if (orderBy) {
                  if (a.header[orderBy] < b.header[orderBy]) return order === 'asc' ? -1 : 1;
                  if (a.header[orderBy] > b.header[orderBy]) return order === 'asc' ? 1 : -1;
                  return 0;
                }
                return 0;
              })
              .map((group) => (
                <Row
                  key={group.header.id}
                  group={group}
                  columns={columns}
                  clickViewHandler={clickViewHandler}
                  clickDeleteHandler={clickDeleteHandler}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
}
  

CollapsibleTable.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    clickViewHandler: PropTypes.func.isRequired,
    clickDeleteHandler: PropTypes.func.isRequired,
};
