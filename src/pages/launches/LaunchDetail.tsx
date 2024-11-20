import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Group,
  Image,
  Text,
  Badge,
  Stack,
  Button,
  Grid,
  SimpleGrid,
} from "@mantine/core";
import { useSpaceXStore } from "../../store/spacex.store";
import { Navigation } from "../../components/Navigation/Navigation";
import { Youtube, Link } from "lucide-react";

const LaunchDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    getLaunchById,
    fetchLaunchDetails,
    fetchLaunches,
    enrichedLaunches,
    isLoading,
    launches,
  } = useSpaceXStore();

  const launch = getLaunchById(id!);
  const enrichedLaunch = enrichedLaunches[id!];

  useEffect(() => {
    const initializePage = async () => {
      if (launches.length === 0) {
        await fetchLaunches();
      }
      if (id) {
        await fetchLaunchDetails(id);
      }
    };

    initializePage();
  }, [id, fetchLaunchDetails, fetchLaunches, launches.length]);

  if (isLoading) {
    return (
      <>
        <Navigation />
        <Container size="xl">
          <Paper radius="md" p="xl" withBorder>
            <Stack spacing="md">
              <Group position="apart">
                <div
                  style={{
                    width: 200,
                    height: 24,
                    backgroundColor: "#e0e0e0",
                    borderRadius: 4,
                  }}
                ></div>
                <div
                  style={{
                    width: 100,
                    height: 24,
                    backgroundColor: "#e0e0e0",
                    borderRadius: 4,
                  }}
                ></div>
              </Group>
              <div
                style={{
                  width: 150,
                  height: 20,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 4,
                }}
              ></div>
              <div
                style={{
                  width: 200,
                  height: 20,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 4,
                }}
              ></div>
              <div
                style={{
                  width: "100%",
                  height: 100,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 4,
                }}
              ></div>
            </Stack>
          </Paper>
        </Container>
      </>
    );
  }

  if (!launch) {
    return (
      <>
        <Navigation />
        <Container size="xl">
          <Paper radius="md" p="xl" withBorder>
            <Text>Launch not found</Text>
          </Paper>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Container size="xl">
        <Stack spacing="xl">
          <Paper radius="md" p="xl" withBorder>
            <Grid>
              <Grid.Col md={4}>
                <Image
                  src={launch.links.patch.large}
                  alt={launch.name}
                  radius="md"
                  withPlaceholder
                />
              </Grid.Col>
              <Grid.Col md={8}>
                <Stack spacing="lg">
                  <Group position="apart">
                    <Title order={2}>{launch.name}</Title>
                    <Badge size="lg" color={launch.success ? "green" : "red"}>
                      {launch.success ? "Successful" : "Failed"}
                    </Badge>
                  </Group>

                  <Text size="lg" color="dimmed">
                    Flight Number: {launch.flight_number}
                  </Text>
                  <Text size="lg" color="dimmed">
                    Launch Date:{" "}
                    {new Date(launch.date_utc).toLocaleDateString()}
                  </Text>

                  {launch.details && <Text size="md">{launch.details}</Text>}

                  <Group>
                    {launch.links.webcast && (
                      <Button
                        component="a"
                        href={launch.links.webcast}
                        target="_blank"
                        leftIcon={<Youtube size={16} />}
                      >
                        Watch Launch
                      </Button>
                    )}
                    {launch.links.article && (
                      <Button
                        component="a"
                        href={launch.links.article}
                        target="_blank"
                        variant="light"
                        leftIcon={<Link size={16} />}
                      >
                        Read Article
                      </Button>
                    )}
                  </Group>
                </Stack>
              </Grid.Col>
            </Grid>
          </Paper>

          {enrichedLaunch?.rocket_details && (
            <Paper radius="md" p="xl" withBorder>
              <Title order={3} mb="md">
                Rocket Information
              </Title>
              <Stack>
                <Text size="lg" weight={500}>
                  {enrichedLaunch.rocket_details.name}
                </Text>
                <Text color="dimmed">
                  {enrichedLaunch.rocket_details.description}
                </Text>
                <Group>
                  <Badge>Type: {enrichedLaunch.rocket_details.type}</Badge>
                  <Badge color="green">
                    Success Rate: {enrichedLaunch.rocket_details.success_rate}%
                  </Badge>
                </Group>
              </Stack>
            </Paper>
          )}

          {enrichedLaunch?.cores && enrichedLaunch.cores.length > 0 && (
            <Paper radius="md" p="xl" withBorder>
              <Title order={3} mb="md">
                Core Details
              </Title>
              <SimpleGrid
                cols={2}
                spacing="xl"
                breakpoints={[{ maxWidth: "sm", cols: 1 }]}
              >
                {enrichedLaunch.cores.map((core, index) => (
                  <Paper key={index} p="md" withBorder>
                    <Stack spacing="xs">
                      <Text weight={500}>Core Serial: {core.serial}</Text>
                      <Text>Reuse Count: {core.reuse_count}</Text>
                      <Badge color={core.landing_success ? "green" : "red"}>
                        Landing:{" "}
                        {core.landing_success ? "Successful" : "Failed"}
                      </Badge>
                      {core.landing_type && (
                        <Text size="sm">Landing Type: {core.landing_type}</Text>
                      )}
                    </Stack>
                  </Paper>
                ))}
              </SimpleGrid>
            </Paper>
          )}

          {enrichedLaunch?.crew && enrichedLaunch.crew.length > 0 && (
            <Paper radius="md" p="xl" withBorder>
              <Title order={3} mb="md">
                Crew Members
              </Title>
              <Group spacing="md">
                {enrichedLaunch.crew.map((member, index) => (
                  <Badge key={index} size="lg">
                    {member}
                  </Badge>
                ))}
              </Group>
            </Paper>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default LaunchDetail;
