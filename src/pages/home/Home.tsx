import { FC } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  Grid,
  Image,
  SimpleGrid,
  Paper,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { Rocket, Calendar, Target, ArrowRight } from "lucide-react";

const Home: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  return (
    <Container size="xl">
      <Stack spacing={120} py={100}>
        {/* Hero Section */}
        <Grid gutter={50} align="center">
          <Grid.Col md={6}>
            <Stack spacing="xl">
              <Title order={1} size={44}>
                Explore SpaceX Launches and Missions
              </Title>
              <Text size="lg" color="dimmed">
                Track SpaceX's journey through space with comprehensive data on
                launches, missions, and achievements in space exploration
              </Text>
              <Group>
                {!isAuthenticated ? (
                  <Button size="lg" onClick={() => navigate("/signin")}>
                    Start Exploring
                  </Button>
                ) : (
                  <Button size="lg" onClick={() => navigate("/dashboard")}>
                    View Dashboard
                  </Button>
                )}
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col md={6}>
            <Image
              src="https://www.spacex.com/static/images/share.jpg"
              alt="SpaceX Rocket"
              radius="md"
            />
          </Grid.Col>
        </Grid>

        {/* Features */}
        <Stack spacing="xl">
          <Title order={2} align="center">
            Mission Control Features
          </Title>
          <SimpleGrid cols={3} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
            {[
              {
                title: "Launch Tracking",
                description: "Real-time launch data and mission statistics",
                icon: Rocket,
              },
              {
                title: "Mission History",
                description: "Comprehensive archive of past missions",
                icon: Calendar,
              },
              {
                title: "Success Metrics",
                description: "Detailed success rates and performance analytics",
                icon: Target,
              },
            ].map((feature, index) => (
              <Paper key={index} p="xl" radius="md" withBorder>
                <feature.icon size={24} strokeWidth={1.5} />
                <Text weight={500} mt="md">
                  {feature.title}
                </Text>
                <Text size="sm" color="dimmed" mt="sm">
                  {feature.description}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>

        {/* Additional Info Section */}
        <Stack spacing="xl">
          <Grid gutter={50}>
            <Grid.Col md={6}>
              <Paper p="xl" radius="md" withBorder>
                <Title order={3} mb="md">
                  About SpaceX
                </Title>
                <Text size="md" color="dimmed">
                  Space Exploration Technologies Corp. (SpaceX) is
                  revolutionizing space technology with its advanced rockets and
                  spacecraft. Track their groundbreaking missions, from routine
                  satellite launches to historic crewed flights to the
                  International Space Station.
                </Text>
              </Paper>
            </Grid.Col>
            <Grid.Col md={6}>
              <Paper p="xl" radius="md" withBorder>
                <Title order={3} mb="md">
                  Mission Stats
                </Title>
                <Stack spacing="md">
                  <Text size="md">
                    • Multiple successful Falcon 9 launches and landings
                  </Text>
                  <Text size="md">
                    • Regular cargo and crew missions to the ISS
                  </Text>
                  <Text size="md">• Pioneering reusable rocket technology</Text>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Home;
