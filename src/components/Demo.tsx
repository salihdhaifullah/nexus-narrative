import { demoAccount } from '../api';
import { Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import Toast from '../utils/sweetAlert';
import { useState } from 'react';

const Demo = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();

    const demoHandler = async () => {
        setIsLoading(true)
        await demoAccount()
            .then(async (res) => {
                Toast.fire("Success", "Successfully Login", 'success');
                localStorage.setItem("user", JSON.stringify(res.data.data));
                await router.push("/posts")
                router.reload()
            })
            .catch(({ response }) => { Toast.fire("something want wrong", response.data.error, 'error') })
            .finally(() => { setIsLoading(false) })
    }


    return (
        <Button
            fullWidth
            onClick={demoHandler}
            variant="contained"
            className='mt-3 mb-4 bg-[#1976d2] hover:bg-[#1d81e6] text-white'
        >
            {isLoading ? <CircularProgress size={28} className='text-white ' /> : "Demo"}
        </Button>)
}

export default Demo
