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
  header?: string;
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
      <TableHeader className="border-none">
        <TableRow className="w-full border-none hover:bg-gray-50">
          {columns.map(
            (col) =>
              col.header && (
                <TableHead className="text-left text-secondary" key={col.key}>
                  {col.header}
                </TableHead>
              ),
          )}
          {actions && <TableHead className="border-none">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((col) => (
              <TableCell
                className="max-w-44 overflow-hidden truncate border-none font-semibold text-secondary/70"
                key={col.key}
              >
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </TableCell>
            ))}
            {actions && (
              <TableCell className="border-none">{actions(row)}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GenericTable;
