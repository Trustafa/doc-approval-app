'use client';

import MuiCard from '@mui/material/Card';

import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  FormLabel,
  Link,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import AppTheme from '../../shared-theme/AppTheme';
import ControlledStyledTextField from '../_components/controlled/controlled-styled-text-field';
import { signUp } from '../api/_services/auth.client';

type SignUpProps = {
  name: string;
  email: string;
  password: string;
};

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUpScreen(props: { disableCustomTheme?: boolean }) {
  const { handleSubmit, control } = useForm<SignUpProps>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const router = useRouter();

  const onSubmit = async (data: SignUpProps) => {
    const result = await signUp(data.name, data.email, data.password);

    if (!result.success) {
      return;
    }

    router.push('/login');
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <ControlledStyledTextField<SignUpProps>
                control={control}
                autoComplete="name"
                name="name"
                fullWidth
                placeholder="Jon Snow"
                rules={{ required: 'Name is required' }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <ControlledStyledTextField<SignUpProps>
                control={control}
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                fullWidth
                variant="outlined"
                rules={{
                  required: 'Email is required',
                  validate: {
                    checkEmail: (v) =>
                      /\S+@\S+\.\S+/.test(v) ||
                      'Please enter a valid email address.',
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <ControlledStyledTextField<SignUpProps>
                control={control}
                name="password"
                placeholder="••••••"
                type="password"
                autoComplete="current-password"
                autoFocus
                fullWidth
                variant="outlined"
                rules={{ required: 'Password is required' }}
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              Sign Up
            </Button>
            <Link
              href="/login"
              variant="body2"
              sx={{ alignSelf: 'center', cursor: 'pointer' }}
            >
              Already have an account? Log In
            </Link>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
