import { FC, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Badge,
  Image,
  ActionIcon,
  Group,
  Skeleton,
} from "@mantine/core";
import { Eye } from "lucide-react";
import { useSpaceXStore } from "../../store/spacex.store";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { DataTable } from "../../components/DataTable/DataTable";
import { Navigation } from "../../components/Navigation/Navigation";
import { Launch } from "../../types/api";
import { TableSkeleton } from "../../components/TableSkeleton/TableSkeleton";

const Launches: FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { launches, isLoading, fetchLaunches } = useSpaceXStore();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    (searchParams.get("direction") as "asc" | "desc") || "desc"
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || ""
  );

  useEffect(() => {
    fetchLaunches();
  }, [fetchLaunches]);

  const handleSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    setSearchParams(params);
  };

  const handleSortDirection = (value: "asc" | "desc") => {
    setSortDirection(value);
    const params = new URLSearchParams(searchParams);
    params.set("direction", value);
    setSearchParams(params);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    setSearchParams(params);
  };

  const columns = [
    {
      key: "patch",
      label: "Patch",
      render: (row: Launch) => (
        <Image
          src={row.links.patch.small || ""}
          alt={row.name}
          width={40}
          height={40}
          radius="sm"
          withPlaceholder
        />
      ),
    },
    {
      key: "name",
      label: "Mission Name",
      render: (row: Launch) => row.name,
    },
    {
      key: "date_utc",
      label: "Launch Date",
      render: (row: Launch) => new Date(row.date_utc).toLocaleDateString(),
      sortable: true,
    },
    {
      key: "success",
      label: "Status",
      render: (row: Launch) => (
        <Badge color={row.success ? "green" : "red"}>
          {row.success ? "Success" : "Failed"}
        </Badge>
      ),
    },
    {
      key: "flight_number",
      label: "Flight #",
      render: (row: Launch) => row.flight_number,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Launch) => (
        <Group spacing={4}>
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => navigate(`/launches/${row.id}`)}
          >
            <Eye size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  const filteredAndSortedData = launches
    .filter((launch) =>
      launch.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((launch) => {
      if (!statusFilter) return true;
      if (statusFilter === "upcoming") return !launch.date_utc;
      if (statusFilter === "success") return launch.success === true;
      if (statusFilter === "failed") return launch.success === false;
      return true;
    })
    .sort((a, b) => {
      const multiplier = sortDirection === "asc" ? 1 : -1;
      if (sortBy === "date") {
        return (
          multiplier *
          (new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime())
        );
      }
      if (sortBy === "flight") {
        return multiplier * (b.flight_number - a.flight_number);
      }
      if (sortBy === "name") {
        return multiplier * a.name.localeCompare(b.name);
      }
      return 0;
    });

  if (isLoading) {
    return (
      <>
        <Navigation />
        <Container size="xl">
          <TableSkeleton columns={6} rows={10} />
        </Container>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Container size="xl">
        <Paper p="md" radius="md" withBorder mb="xl">
          <Title order={2} mb="lg">
            SpaceX Launches
          </Title>
          <SearchBar
            onSearch={handleSearch}
            onSort={handleSort}
            onSortDirection={handleSortDirection}
            onStatusFilter={handleStatusFilter}
            initialSearch={search}
            initialSort={sortBy}
            initialSortDirection={sortDirection}
            initialStatus={statusFilter}
          />
          <DataTable
            data={filteredAndSortedData}
            columns={columns}
            isLoading={isLoading}
          />
        </Paper>
      </Container>
    </>
  );
};

export default Launches;
