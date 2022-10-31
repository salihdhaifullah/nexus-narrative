import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { IUser } from '../types/user';
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
            write a tag category or a title to get the best result .
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
  sections: ReadonlyArray<{
    title: string;
    url: string;
  }>;
  title: string;
}

export default function Header(props: HeaderProps) {
  const { sections, title } = props;
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const isBrowser: boolean = typeof window !== 'undefined';
  const isFound = isBrowser && localStorage.getItem("user")
  const user: IUser | null = isFound ? JSON.parse(isFound) : null;

  return (
    <React.Fragment>
      <Search open={open} setOpen={setOpen} search={search} setSearch={setSearch} />
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Button size="small">Subscribe</Button>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>
        <IconButton>
          <SearchIcon onClick={() => setOpen(true)} />
        </IconButton>
        <Button variant="outlined" size="small">
          {user !== null ? "logout" : "Sign up"}
        </Button>
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
      >
        {sections && sections.map((section) => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            href={section.url}
            sx={{ p: 1, flexShrink: 0 }}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
    </React.Fragment>
  );
}