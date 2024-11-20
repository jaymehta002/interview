import { FC } from "react";
import { Table, Loader, Text } from "@mantine/core";
import { Launch } from "../../types/api";

interface Column {
  key: string;
  label: string;
  render: (row: Launch) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps {
  data: Launch[];
  columns: Column[];
  isLoading: boolean;
}

export const DataTable: FC<DataTableProps> = ({ data, columns, isLoading }) => {
  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
      >
        <Loader />
      </div>
    );
  }

  if (data.length === 0) {
    return <Text align="center">No launches found</Text>;
  }

  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td key={`${row.id}-${column.key}`}>{column.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
