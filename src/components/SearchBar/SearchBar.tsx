import { FC } from "react";
import {
  TextInput,
  Group,
  Select,
  SegmentedControl,
  Box,
  createStyles,
} from "@mantine/core";
import { Search, ArrowDown, ArrowUp } from "lucide-react";

// Create custom styles to ensure consistent heights and alignments
const useStyles = createStyles((theme) => ({
  controlsGroup: {
    gap: theme.spacing.xs,
    alignItems: "center",
  },
  input: {
    height: 36,
  },
  select: {
    width: 200,
    input: {
      height: 36,
    },
  },
  statusSelect: {
    width: 160,
    input: {
      height: 36,
    },
  },
  iconWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
}));

interface SearchBarProps {
  onSearch: (value: string) => void;
  onSort: (value: string) => void;
  onSortDirection: (value: "asc" | "desc") => void;
  onStatusFilter: (value: string) => void;
  initialSearch?: string;
  initialSort?: string;
  initialSortDirection?: "asc" | "desc";
  initialStatus?: string;
}

export const SearchBar: FC<SearchBarProps> = ({
  onSearch,
  onSort,
  onSortDirection,
  onStatusFilter,
  initialSearch = "",
  initialSort = "",
  initialSortDirection = "desc",
  initialStatus = "",
}) => {
  const { classes } = useStyles();

  return (
    <Group mb="md" align="center" spacing="md" noWrap>
      <TextInput
        placeholder="Search missions..."
        icon={<Search size={16} />}
        onChange={(e) => onSearch(e.currentTarget.value)}
        value={initialSearch}
        sx={{ flex: 1 }}
        classNames={{ input: classes.input }}
      />
      <Group spacing="xs" className={classes.controlsGroup} noWrap>
        <Select
          placeholder="Sort by"
          value={initialSort}
          onChange={(value) => {
            if (value) {
              const [field, direction] = value.split("_");
              onSort(field);
              onSortDirection(direction as "asc" | "desc");
            } else {
              onSort("");
              onSortDirection("desc");
            }
          }}
          data={[
            { value: "date", label: "Launch Date" },
            { value: "flight", label: "Flight Number" },
            { value: "name", label: "Mission Name" },
          ]}
          clearable
          classNames={{ root: classes.select, input: classes.input }}
        />
        <SegmentedControl
          value={initialSortDirection}
          size="md"
          onChange={(value: "asc" | "desc") => onSortDirection(value)}
          data={[
            {
              value: "asc",
              label: (
                <div className={classes.iconWrapper}>
                  <ArrowUp size={16} />
                </div>
              ),
            },
            {
              value: "desc",
              label: (
                <div className={classes.iconWrapper}>
                  <ArrowDown size={16} />
                </div>
              ),
            },
          ]}
        />
      </Group>
      <Select
        placeholder="Filter by status"
        value={initialStatus}
        onChange={(value) => onStatusFilter(value || "")}
        data={[
          { value: "success", label: "Success" },
          { value: "failed", label: "Failed" },
        ]}
        clearable
        classNames={{ root: classes.statusSelect, input: classes.input }}
      />
    </Group>
  );
};
