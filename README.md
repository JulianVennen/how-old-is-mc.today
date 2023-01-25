# [how-old-is-mc.today](https://how-old-is-mc.today)
A simple website to show the age of any Minecraft version including snapshots and alphas.

This website uses Cloudflare Workers. Please don't look at how I send html, css or svg. It's pretty ugly.

Inspired by [howoldisminecraft1710.today](https://howoldisminecraft1710.today/) and [howoldisminecraft1122.today](https://howoldisminecraft1122.today/).


### Development
Run a development server:
```shell
npm install
npx wrangler dev
```

Deploy to production
```shell
npm install
npx wrangler login
npx wrangler publish
```
