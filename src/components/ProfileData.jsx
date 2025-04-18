import React from "react";
import Table from 'react-bootstrap/Table';

/**
 * Renders information about the user obtained from MS Graph 
 * @param props
 */
export const ProfileData = (props) => {
  // Add checks to prevent accessing properties of undefined
  if (!props.graphqlData || !props.graphqlData.data || !props.graphqlData.data.factInternetSales) {
    return <div>No data available</div>;
  }
  
  // Use factInternetSales with capital S to match your GraphQL query
  const factInternetSales = props.graphqlData.data.factInternetSales.items;
  
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ProductKey</th>
          <th>TotalProductCost</th>
          <th>SalesOrderNumber</th>
        </tr>
      </thead>
      <tbody>
        {factInternetSales.map((item, i) => (
          <tr key={i}>
            <td>{item.ProductKey}</td>
            <td>{item.TotalProductCost}</td>
            <td>{item.SalesOrderNumber}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};