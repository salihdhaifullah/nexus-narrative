import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import { IUser } from '../types/user';
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { logout } from '../context/reducers/userReducer';
import { useDispatch } from 'react-redux';
import Link from 'next/link';

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

interface HeaderProps {
  title: string;
}

export default function Header(props: HeaderProps) {
  const { title } = props;
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const isBrowser: boolean = typeof window !== 'undefined';
  const isFound = isBrowser && localStorage.getItem("user")
  const user: IUser | null = isFound ? JSON.parse(isFound) : null;
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <Search open={open} setOpen={setOpen} search={search} setSearch={setSearch} />
      <Toolbar className="flex justify-between" sx={{ borderBottom: 1, borderColor: 'divider' }}>

        <Link className="no-underline" href="/posts">
          <Button size="small">
            Posts
          </Button>
        </Link>

        {user && (
          <>
            <Link className="no-underline" href="/admin/profile">
              <Button size="small">
                Profile
              </Button>
            </Link>

            <Link className="no-underline" href="/admin/create-post">
              <Button size="small">
                Create Post
              </Button>
            </Link>

            <Link className="no-underline" href="/admin">
              <Button size="small">
                Dashboard
              </Button>
            </Link>
          </>
        )}


        <div>
          <IconButton>
            <SearchIcon onClick={() => setOpen(true)} />
          </IconButton>
          {user !== null ? (
            <Button onClick={() => logout()(dispatch)} variant="outlined" size="small">
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
    </React.Fragment>
  );
}