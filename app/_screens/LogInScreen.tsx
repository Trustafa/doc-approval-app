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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AppTheme from '../../shared-theme/AppTheme';
import ControlledCheckbox from '../_components/controlled/controlled-checkbox';
import ControlledStyledTextField from '../_components/controlled/controlled-styled-text-field';
import LoadingBox from '../_components/loading-box';
import { logIn } from '../api/_client/auth.client';
import { getMe } from '../api/_client/user.client';

type LogInProps = {
  email: string;
  password: string;
  remember: boolean;
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

const LogInContainer = styled(Stack)(({ theme }) => ({
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

export default function LogInScreen(props: { disableCustomTheme?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { handleSubmit, control, setError, setValue } = useForm<LogInProps>({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: LogInProps) => {
    const result = await logIn({
      email: data.email,
      password: data.password,
      longLife: data.remember,
    });

    if (!result.success) {
      setValue('password', '');

      setError('password', {
        type: 'manual',
        message: 'Incorrect email or password',
      });

      return;
    }

    router.push('/dashboard');
  };

  useEffect(() => {
    async function checkForLoggedInUser() {
      setLoading(true);
      try {
        const user = await getMe();
        if (user.success) {
          router.replace('/dashboard');
        }
      } finally {
        setLoading(false);
      }
    }

    checkForLoggedInUser();
  }, []);

  if (loading) return <LoadingBox />;

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <LogInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Log in
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
              <FormLabel htmlFor="email">Email</FormLabel>
              <ControlledStyledTextField<LogInProps>
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
                    checkEmail: (v) => {
                      if (typeof v !== 'string') return 'Invalid value';
                      return (
                        /\S+@\S+\.\S+/.test(v) ||
                        'Please enter a valid email address.'
                      );
                    },
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <ControlledStyledTextField<LogInProps>
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
            <ControlledCheckbox<LogInProps>
              name="remember"
              control={control}
              label="Remember me"
            />
            <Button type="submit" fullWidth variant="contained">
              Log in
            </Button>
            <Link
              href="/signup"
              variant="body2"
              sx={{ alignSelf: 'center', cursor: 'pointer' }}
            >
              Don’t have an account? Create one
            </Link>
          </Box>
        </Card>
      </LogInContainer>
    </AppTheme>
  );
}
