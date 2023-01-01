import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from 'next/link';
import useGetUser from '../hooks/useGetUser';
import { Logout } from '../api';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

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
    Swal.fire({
      title: 'Are you sure you want to Logout',
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true
    })
      .then(async (res) => {
        if (!res.value) return;
        await Logout();
        localStorage.clear();
        await router.push("/login")
        router.reload()
      })

  }

  const handelSingUp = async () => {
    await router.push("/sing-up")
  }

  return (
    <header>
      <Search open={open} setOpen={setOpen} search={search} setSearch={setSearch} />
      <Toolbar className="min-w-[95vw]" sx={{ borderBottom: 1, borderColor: 'divider' }}>

        <div className="inline-flex w-full">
          <IconButton className="mr-2" onClick={() => setOpen(true)}>
            <SearchIcon />
          </IconButton>

          <Box className="inline-flex w-full justify-between">
            {user !== null
              ? <Button onClick={handelLogout} variant="outlined" size="small"> Logout </Button>
              : <Button onClick={handelSingUp} variant="outlined" size="small"> Sign up </Button>}

            <Link href="/admin/dashboard">
              <Button onClick={handelSingUp} variant="outlined" size="small"> DashBoard </Button>
            </Link>
          </Box>
        </div>

      </Toolbar>
    </header>
  );
}
