import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

interface Column {
  header: string;
  key: string;
  render?: (value: any, row: any) => React.ReactNode;
}
interface TableProps {
  columns: Column[];
  data: any[];
  actions?: (row: any) => React.ReactNode;
}

const GenericTable = ({ columns, data, actions }: TableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="w-full bg-secondary/10 hover:bg-secondary/10">
          {columns.map((col) => (
            <TableHead key={col.key}>{col.header}</TableHead>
          ))}
          {actions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((col) => (
              <TableCell key={col.key}>
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </TableCell>
            ))}
            {actions && <TableCell>{actions(row)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GenericTable;
