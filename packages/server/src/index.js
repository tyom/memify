import { send } from 'micro';
import { router, get } from 'microrouter';
import { db } from '@memify/shared';
const { renderImage } = require('./render');

const error = (code = 404, message = 'Not Found') => (req, res) => {
  return send(res, code, message);
};

const configureImage = (meme, query) => async (req, res) => {
  res.setHeader('Content-Type', 'image/jpeg');
  const composerUrl = process.env.COMPOSER_URL || `https://${req.headers.host}`;
  const image = await renderImage(composerUrl, { meme, query });
  return send(res, 200, image);
};

async function renderer(req, res) {
  let { memeId } = req.params;

  const memeDoc = await db
    .collection('memes')
    .doc(memeId)
    .get();

  if (!memeDoc.exists) {
    return error(404, `Could't find meme ${memeId}`)(req, res);
  }
  const meme = memeDoc.data();
  const image = configureImage(meme, req.query);
  return image(req, res);
}

export default router(
  get('/r/:memeId', renderer),
  get('/*', error('Invalid URL: Meme ID is required'))
);
