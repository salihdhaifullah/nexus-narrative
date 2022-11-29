import { useState, KeyboardEvent, MouseEvent } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import CreateIcon from '@mui/icons-material/Create';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Link from 'next/link';
import useGetUser from '../hooks/useGetUser';

export default function SideBarHead() {
    const [state, setState] = useState(false);
    const [user] = useGetUser()
    const toggleDrawer = (value: boolean) => (event: KeyboardEvent | MouseEvent) => {
        if (event.type === 'keydown' && ((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')) return;

        setState(value);
    };

    const ListSide = () => (
        <Box role="presentation" onClick={toggleDrawer(true)} onKeyDown={toggleDrawer(true)} >
            
            {user ? (
            <List>
                <ListItem disablePadding>
                    <Link href="/admin/posts">
                        <ListItemButton>
                            <ListItemIcon>
                                <DynamicFeedIcon />
                            </ListItemIcon>
                            <ListItemText primary={"my posts"} />
                        </ListItemButton>
                    </Link>
                </ListItem>

                <ListItem disablePadding>
                    <Link href="/admin/create-post">
                        <ListItemButton>
                            <ListItemIcon>
                                <CreateIcon />
                            </ListItemIcon>
                            <ListItemText primary={"create post"} />
                        </ListItemButton>
                    </Link>
                </ListItem>

                <ListItem disablePadding>
                    <Link href="/admin/profile">
                        <ListItemButton>
                            <ListItemIcon>
                                <AccountBoxIcon />
                            </ListItemIcon>
                            <ListItemText primary={"my profile"} />
                        </ListItemButton>
                    </Link>
                </ListItem>

            </List> 
        ) : null}


            <Divider />

            <List>
                <ListItem disablePadding>
                    <Link href="/posts">
                        <ListItemButton>
                            <ListItemIcon>
                                <DynamicFeedIcon />
                            </ListItemIcon>
                            <ListItemText primary={"posts"} />
                        </ListItemButton>
                    </Link>
                </ListItem>
            </List>

        </Box>
    );

    return (
        <div>
            <Button onClick={toggleDrawer(true)}><MenuIcon /></Button>
            <Drawer anchor="left" open={state} onClose={toggleDrawer(false)} >
                <ListSide />
            </Drawer>
        </div>
    );
}




