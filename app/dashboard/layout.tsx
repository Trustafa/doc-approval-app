'use client';

import Theme from '@/theme/Theme';
import {
  Description as DescriptionIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SideNav from '../_components/nav-side';
import { logOut } from '../api/_client/auth.client';
import { getMe } from '../api/_client/user.client';

const drawerWidth = 240;

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/requests/received': 'Received Requests',
  '/dashboard/requests/sent': 'Sent Requests',
};

async function getUserName() {
  const res = await getMe();

  if (!res.success) {
    alert(res.status);
    return;
  }

  return res.data.name;
}
export default function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [username, setUsername] = useState<string | undefined>('');

  useEffect(() => {
    async function fetchData() {
      setUsername(await getUserName());
    }

    fetchData();
  }, []);

  const pathname = usePathname();
  const pageTitle = titles[pathname] || 'Document Approval';

  const toggleMobileDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  const onLogout = async () => {
    const res = await logOut();

    if (res.success) {
      router.push('/login');
    }
  };

  const handleNavigate = (url: string) => {
    setMobileOpen(false);

    setTimeout(() => {
      router.push(url);
    }, 200);
  };

  const drawer = (
    <SideNav
      items={[
        { text: 'Home', icon: <HomeIcon />, ref: '/dashboard' },
        {
          text: 'Received Requests',
          icon: <DescriptionIcon />,
          ref: '/dashboard/requests/received',
        },

        {
          text: 'Sent Requests',
          icon: <SendIcon />,
          ref: '/dashboard/requests/sent',
        },
      ]}
      username={username ?? ''}
      onLogout={onLogout}
      onNavigate={handleNavigate}
    />
  );

  return (
    <Theme>
      <Box sx={{ display: 'flex' }}>
        {isMobile && (
          <AppBar position="fixed" color="inherit" elevation={0}>
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={toggleMobileDrawer}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6">{pageTitle}</Typography>
            </Toolbar>
          </AppBar>
        )}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="sidebar navigation"
        >
          <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isMobile ? mobileOpen : true}
            onClose={toggleMobileDrawer}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'block' },
              '& .MuiDrawer-paper': { width: drawerWidth, overflowX: 'hidden' },
            }}
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            mt: isMobile ? 8 : 0,
          }}
        >
          {children}
        </Box>
      </Box>
    </Theme>
  );
}
