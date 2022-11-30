import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from 'next/link';
import useGetUser from '../hooks/useGetUser';
import { Logout } from '../api';
import Router, { useRouter } from 'next/router';
import SideBarHead from './SideBarHead';

interface ISearchProps {
  open: boolean;
  setOpen: (boolean: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
}
const Search = ({ open, setOpen, search, setSearch }: ISearchProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Search</DialogTitle>
        <DialogContent>
          <DialogContentText>
            search by title to get the best result .
          </DialogContentText>
          <TextField
            autoFocus
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            margin="dense"
            id="search"
            label="search"
            type="search"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {search ? (
            <Link className="no-underline" href={`/search/?search=${search}`}>
              <Button className="no-underline" onClick={handleClose}>Search</Button>
            </Link>
          ) : (
            <Button onClick={handleClose}>Search</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}


export default function Header() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [user] = useGetUser();
  const router = useRouter()
  
  const handelLogout = async () => {
    await Logout();
    localStorage.clear();
    await router.push("/login")
    router.reload()
  }

  return (
    <header>
      <Search open={open} setOpen={setOpen} search={search} setSearch={setSearch} />
      <Toolbar className="flex justify-between" sx={{ borderBottom: 1, borderColor: 'divider' }}> 
      <SideBarHead />

        <div>
           <IconButton className="mr-2" onClick={() => setOpen(true)}>
            <SearchIcon />
          </IconButton>
          {user !== null ? (
            <Button onClick={handelLogout} variant="outlined" size="small">
              logout
            </Button>
          ) : (
            <Link className="no-underline" href="/sing-up">
              <Button variant="outlined" size="small">
                Sign up
              </Button>
            </Link>
          )} 
        </div>

       </Toolbar> 
    </header>
  );
}