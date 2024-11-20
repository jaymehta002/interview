import { FC, useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Title,
  Stack,
  Button,
  Group,
  Text,
  SimpleGrid,
  Progress,
  RingProgress,
  Badge,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  Rocket,
  BarChart3,
  Percent,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { useSpaceXStore } from "../../store/spacex.store";
import { useAuthStore } from "../../store/auth.store";
import { Navigation } from "../../components/Navigation/Navigation";
import { DataTable } from "../../components/DataTable/DataTable";
import { Launch } from "../../types/api";

const Dashboard: FC = () => {
  const navigate = useNavigate();
  const { launches, rockets, fetchLaunches, fetchRockets } = useSpaceXStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchLaunches();
    fetchRockets();
  }, [fetchLaunches, fetchRockets]);

  // Calculate statistics
  const successfulLaunches = launches.filter((launch) => launch.success).length;
  const successRate = (successfulLaunches / launches.length) * 100;
  const recentLaunches = launches.slice(-5);

  const columns = [
    {
      key: "name",
      label: "Mission Name",
      render: (row: Launch) => row.name,
    },
    {
      key: "date_utc",
      label: "Launch Date",
      render: (row: Launch) => new Date(row.date_utc).toLocaleDateString(),
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
  ];

  return (
    <>
      <Navigation />
      <Container size="xl" py="xl">
        <Stack spacing="xl">
          {/* Welcome Section */}
          <Paper p="md" radius="md" withBorder>
            <Group position="apart">
              <div>
                <Text size="xl" weight={500}>
                  Welcome back, {user?.name}!
                </Text>
                <Text color="dimmed">Here's what's happening with SpaceX</Text>
              </div>
              <Button
                rightIcon={<ArrowUpRight size={16} />}
                onClick={() => navigate("/launches")}
              >
                View All Launches
              </Button>
            </Group>
          </Paper>

          {/* Stats Cards */}
          <SimpleGrid cols={4} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
            <Paper p="md" radius="md" withBorder>
              <Group position="apart">
                <div>
                  <Text size="xs" color="dimmed" transform="uppercase">
                    Total Launches
                  </Text>
                  <Text size="xl" weight={500}>
                    {launches.length}
                  </Text>
                </div>
                <Rocket size={32} strokeWidth={1.5} />
              </Group>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <Group position="apart">
                <div>
                  <Text size="xs" color="dimmed" transform="uppercase">
                    Success Rate
                  </Text>
                  <Text size="xl" weight={500}>
                    {successRate.toFixed(1)}%
                  </Text>
                </div>
                <Percent size={32} strokeWidth={1.5} />
              </Group>
              <Progress
                value={successRate}
                mt="sm"
                size="sm"
                color={successRate > 75 ? "green" : "yellow"}
              />
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <Group position="apart">
                <div>
                  <Text size="xs" color="dimmed" transform="uppercase">
                    Active Rockets
                  </Text>
                  <Text size="xl" weight={500}>
                    {rockets.length}
                  </Text>
                </div>
                <BarChart3 size={32} strokeWidth={1.5} />
              </Group>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <Group position="apart">
                <div>
                  <Text size="xs" color="dimmed" transform="uppercase">
                    Recent Activity
                  </Text>
                  <Text size="xl" weight={500}>
                    {recentLaunches.length}
                  </Text>
                </div>
                <Calendar size={32} strokeWidth={1.5} />
              </Group>
            </Paper>
          </SimpleGrid>

          {/* Recent Launches Table */}
          <Paper p="md" radius="md" withBorder>
            <Title order={3} mb="md">
              Recent Launches
            </Title>
            <DataTable
              data={recentLaunches}
              columns={columns}
              isLoading={false}
            />
          </Paper>
        </Stack>
      </Container>
    </>
  );
};

export default Dashboard;
