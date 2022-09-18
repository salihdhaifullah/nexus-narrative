import nextConnect from 'next-connect';


const apiRoute = nextConnect({
  onError(error, req, res: any) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use();

apiRoute.post(async (req: any, res) => {
  res.status(200).json({ data: 'success' });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false
  },
};