'use client';

import {
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { usePathname } from 'next/navigation';

type NavItem = {
  text: string;
  icon: React.ReactNode;
  ref: string;
};

type SideNavProps = {
  items: NavItem[];
};
export default function SideNav({ items }: SideNavProps) {
  const pathname = usePathname();
  return (
    <div>
      <List>
        {items.map((item) => {
          const active = pathname === item.ref;
          return (
            <ListItem key={item.text}>
              <Link
                href={item.ref}
                style={{
                  textDecoration: 'none',
                  color: '#000',
                  width: '100%',
                  borderRadius: '20%',
                }}
              >
                <ListItemButton selected={active}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
