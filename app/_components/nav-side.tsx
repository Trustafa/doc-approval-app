'use client';

import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Collapse,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
};
export default function SideNav({ items }: SideNavProps) {
  const pathname = usePathname();

  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggleDropdown = (name: string) => {
    setOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  return (
    <List sx={{ minWidth: '100%' }}>
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
              <ListItemIcon>{item.icon}</ListItemIcon>
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
  );
}
