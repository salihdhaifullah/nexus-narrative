import Storage from '../../libs/supabase/index'
import nextConnect from 'next-connect';
import multer from 'multer';

const upload = multer();
const clg = console.log;
const storage = new Storage;
const apiRoute = nextConnect({
  onError(error, req, res: any) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req: any, res) => {
    await storage.uploadFile(req.file).then(() => clg("Succses")).catch((err: any) => clg(err));
  res.status(200).json({ data: 'success' });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false
  },
};