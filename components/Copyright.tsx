import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';


export default function Copyright(props: any) {
    return (
        <div className="flex flex-col min-h-[50px] mt-4">
            <Typography variant="body2" color="text.secondary" align="center" {...props}>
                {'Copyright © '}
                <Link color="inherit" href="https://mui.com/">
                    Your Website
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </div>
    );
}