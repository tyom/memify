import { send } from 'micro';
import { router, get } from 'microrouter';
import { renderImage } from './render';

const error = (code = 404, message = 'Not Found') => (req, res) => {
  return send(res, code, message);
};

const configureImage = (memeId, query) => async (req, res) => {
  res.setHeader('Content-Type', 'image/jpeg');
  const composerUrl = process.env.COMPOSER_URL || `https://${req.headers.host}`;
  const image = await renderImage(composerUrl, { memeId, query });
  return send(res, 200, image);
};

async function renderer(req, res) {
  let { memeId } = req.params;

  const image = configureImage(memeId, req.query);
  return image(req, res);
}

export default router(
  get('/r/:memeId', renderer),
  get('/*', error('Invalid URL: Meme ID is required'))
);
