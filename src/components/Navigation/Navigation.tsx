import { FC } from "react";
import { Header, Container, Group, Button, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { Rocket, Database, LogOut } from "lucide-react";

export const Navigation: FC = () => {
  const navigate = useNavigate();
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <Header height={60} mb={30}>
      <Container size="xl" h="100%">
        <Group position="apart" h="100%">
          <Group>
            <Rocket size={24} />
            <Title order={3}>SpaceX Explorer</Title>
          </Group>

          <Group>
            <Button
              variant="subtle"
              leftIcon={<Rocket size={16} />}
              onClick={() => navigate("/launches")}
            >
              Launches
            </Button>
            <Button
              variant="light"
              color="red"
              leftIcon={<LogOut size={16} />}
              onClick={signOut}
            >
              Logout
            </Button>
          </Group>
        </Group>
      </Container>
    </Header>
  );
};
