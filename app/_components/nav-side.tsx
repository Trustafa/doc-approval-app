'use client';

import {
  AccountCircle,
  ExpandLess,
  ExpandMore,
  Logout,
} from '@mui/icons-material';
import {
  Box,
  Collapse,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type NavItem = {
  text: string;
  icon: React.ReactNode;
  ref: string;
  children?: NavItem[];
};

type SideNavProps = {
  items: NavItem[];
  username: string;
  onLogout: () => void;
};
export default function SideNav({ items, username, onLogout }: SideNavProps) {
  const pathname = usePathname();

  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggleDropdown = (name: string) => {
    setOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <List sx={{ flexGrow: 1, minWidth: '100%' }}>
        {items.map((item) => {
          const active = pathname === item.ref;
          const isOpen = open[item.text] ?? false;
          const hasChildren = !!item.children?.length;
          return (
            <Box key={item.text}>
              <ListItemButton
                selected={active}
                onClick={() => hasChildren && toggleDropdown(item.text)}
                component={!hasChildren ? Link : 'div'}
                href={hasChildren ? undefined : item.ref}
                style={{
                  textDecoration: 'none',
                  color: '#000',
                  width: '100%',
                }}
              >
                <ListItemIcon sx={{ pr: 3 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />

                {hasChildren ? isOpen ? <ExpandLess /> : <ExpandMore /> : null}
              </ListItemButton>

              {hasChildren && (
                <Collapse in={isOpen} unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children?.map((child) => {
                      const childActive = pathname === child.ref;

                      return (
                        <ListItem key={child.text}>
                          <ListItemButton
                            selected={childActive}
                            component={Link}
                            href={child.ref}
                            style={{
                              textDecoration: 'none',
                              color: '#000',
                              width: '100%',
                              borderRadius: '20px',
                            }}
                          >
                            <ListItemText primary={child.text} />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderTop: '1px solid #ddd',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          <IconButton>
            <AccountCircle />
          </IconButton>
          {username}
        </Typography>

        <IconButton onClick={onLogout} variant="icon">
          <Logout />
        </IconButton>
      </Box>
    </Box>
  );
}
