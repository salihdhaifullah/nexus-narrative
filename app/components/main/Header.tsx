import Toolbar from '@mui/material/Toolbar';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from 'next/link';
import useGetUser from '../../hooks/useGetUser';
import { Logout } from '../../api';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

interface ISearchProps {
  open: boolean;
  setOpen: (boolean: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
}
const Search = ({ open, setOpen, search, setSearch }: ISearchProps) => {
  const router = useRouter()

  return (
    <Dialog
      onClose={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setOpen(false)
          router.push(`/posts/?search=${search}`)
        }
      }}
      open={open}
    >
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
        {search ?
          <Link className="no-underline" href={`/posts/?search=${search}`}>
            <Button className="no-underline" onClick={() => setOpen(false)}>Search</Button>
          </Link>
          : <Button onClick={() => setOpen(false)}>Search</Button>}
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}


export default function Header() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [user] = useGetUser();
  const router = useRouter()

  useEffect(() => { console.log(open) }, [open])

  const handelLogout = async () => {
    Swal.fire({
      title: 'Are you sure you want to Logout',
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true
    }).then(async (res) => {
      if (!res.value) return;
      await Logout();
      localStorage.clear();
      router.push("/login")
      router.reload()
    })

  }

  return (
    <header className="shadow-md">
      <Search open={open} setOpen={setOpen} search={search} setSearch={setSearch} />
      <Toolbar className="min-w-[95vw] h-fit" sx={{ borderBottom: 1, borderColor: 'divider' }}>

        <div className="inline-flex w-full items-center ">
          <SearchIcon
            className="p-2 w-10 h-10 rounded-full hover:bg-gray-300 text-gray-700 cursor-pointer mr-2"
            onClick={() => { setOpen(true)}}
            />

          <Box className="inline-flex w-full justify-start">

            {user === null ? null : (
              <Link href="/dashboard">
                <Button variant="text" size="small" className="h-fit"> DashBoard </Button>
              </Link>
            )}
            <Link href="/posts">
              <Button variant="text" size="small" className="h-fit ml-2"> Posts </Button>
            </Link>
          </Box>

          {user !== null
            ? <Button onClick={handelLogout} variant="text" size="small" className="h-fit"> Logout </Button>
            : <Button
              onClick={() => { router.push("/sing-up") }}
              variant="text"
              size="small"
              className="h-fit"> Sign up </Button>}
        </div>
      </Toolbar>
    </header>
  );
}
