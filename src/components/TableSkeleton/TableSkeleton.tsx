import { FC } from "react";
import { Skeleton, Paper } from "@mantine/core";

interface TableSkeletonProps {
  columns: number;
  rows: number;
}

export const TableSkeleton: FC<TableSkeletonProps> = ({ columns, rows }) => {
  return (
    <Paper radius="md" withBorder p="md">
      {Array(rows)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} height={40} mb="sm" />
        ))}
    </Paper>
  );
};
