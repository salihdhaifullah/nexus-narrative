import { useEffect, useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { ISocial } from '../static';
import { ISocil } from '../types/profile';
import { SocilTypes } from '@prisma/client';
interface IProps {
    name: SocilTypes
    setOpen: (state: boolean) => void
    open: boolean
    setValue: (state: ISocial[]) => void
    handel: (data: ISocil) => Promise<void>
    value: ISocial[]
}

export default function DialogInputs({ name, setOpen, open, setValue, value, handel }: IProps) {
    const [item, setItem] = useState("")
    let apiData: ISocil |  undefined = undefined;
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setItem(value.filter((i: any) => i.name.split(" ")[0] === name)[0]?.url || "")
    }, [name, value])

    const handelSetValue = () => {
        if (item) {
            const data: ISocial[] = value.filter((i: any) => i.name.split(" ")[0] !== name);
            const signalItem: ISocial = value.filter((i: any) => i.name.split(" ")[0] === name)[0];
            data.push({ icon: signalItem.icon, name: signalItem.name, url: item, color: signalItem.color })
            const endData: ISocial[] = data
            setValue(endData)
            apiData = { name: name, link: item}
            handel(apiData)
            setItem("")
        }
    }

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>

            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle className='px-10'>add social account</DialogTitle>
                <DialogContent className='px-20'>
                    <DialogContentText>
                        enter your social account link
                    </DialogContentText>
                    <TextField
                        value={item}
                        onChange={(event) => setItem(event.target.value)}
                        autoFocus
                        margin="dense"
                        id="social"
                        label="social account"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handelSetValue}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}