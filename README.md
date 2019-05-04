# Memify

The meme creation service.

The configuration is set in `preset.json`, which could be moved to GitHub gists.
Each item in preset consists of background image, text and optional foreground
image, which is overlaid on top of text for additional effects, such as shades.

To run the service locally:

```
yarn dev
```

This runs server and client on different ports and then proxied to one place 
http://localhost:9000 to emulate the production environment.

The service is designed to be deployed to [now.sh](https://zeit.co/now)
as a serverless app:

```
yarn deploy
``` 

It uses [Konva](https://konvajs.org) (canvas library) to compose the text 
and images and then rendered with Puppeteer.
