import { FC } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Checkbox,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuthStore } from "../../store/auth.store";
import { showNotification } from "@mantine/notifications";
import { Mail, Lock, Github, Chrome } from "lucide-react";

const SignIn: FC = () => {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await signIn(values.email, values.password);
      navigate("/dashboard");
    } catch (error) {
      showNotification({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to sign in",
        color: "red",
      });
    }
  };

  return (
    <Container size={420} my={40}>
      <Paper radius="md" p="xl" withBorder>
        <Title order={2} align="center" mb="lg">
          Sign In
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            icon={<Mail size={16} />}
            radius="md"
            label="Email"
            placeholder="your@email.com"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            icon={<Lock size={16} />}
            radius="md"
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />

          <Group position="apart" mt="sm">
            <Checkbox label="Remember me" size="sm" />
            <Anchor size="sm">Forgot password?</Anchor>
          </Group>

          <Button type="submit" fullWidth mt="xl" variant="filled">
            Sign in
          </Button>
        </form>

        <Text color="dimmed" size="sm" align="center" mt="xl">
          Don't have an account?{" "}
          <Anchor size="sm" onClick={() => navigate("/signup")}>
            Create account
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
};

export default SignIn;
