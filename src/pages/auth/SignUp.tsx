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
  Divider,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuthStore } from "../../store/auth.store";
import { showNotification } from '@mantine/notifications';
import { User, Mail, Lock, Github, Chrome } from "lucide-react";

const SignUp: FC = () => {
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await signUp(values.name, values.email, values.password);
      navigate("/dashboard");
    } catch (error) {
      showNotification({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to sign up',
        color: 'red'
      });
    }
  };

  return (
    <Container size={420} my={40}>
      <Title align="center" order={2}>
        Create an account
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{" "}
        <Text
          component="span"
          color="blue"
          onClick={() => navigate("/signin")}
          style={{ cursor: "pointer" }}
        >
          Sign in
        </Text>
      </Text>

      <Paper radius="lg" p="xl" withBorder mt={30}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            icon={<User size={18} />}
            radius="md"
            size="md"
            label="Name"
            placeholder="Your name"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            icon={<Mail size={18} />}
            radius="md"
            size="md"
            label="Email"
            placeholder="your@email.com"
            required
            mt="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            icon={<Lock size={18} />}
            radius="md"
            size="md"
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            icon={<Lock size={18} />}
            radius="md"
            size="md"
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            mt="md"
            {...form.getInputProps("confirmPassword")}
          />
          <Button
            radius="md"
            size="md"
            type="submit"
            fullWidth
            mt="xl"
            gradient={{ from: 'cyan', to: 'indigo' }}
            variant="gradient"
          >
            Sign up
          </Button>

          <Divider label="Or continue with" labelPosition="center" my="lg" />

          <Group grow mb="md" mt="md">
            <Button variant="default" radius="md">
              <Chrome size={18} />
            </Button>
            <Button variant="default" radius="md">
              <Github size={18} />
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default SignUp;
