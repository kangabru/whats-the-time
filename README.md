<div align="center">

# 🕓 What's the time?

A timezone converter and dashboard to help you communicate with contacts around the world.

![Screenshot](https://raw.githubusercontent.com/kangabru/whats-the-time/assets/assets/screenshot.jpg)

👉 [View the site here](https://whats-the-time.netlify.app/) 👈

[![Netlify Status](https://api.netlify.com/api/v1/badges/1a0c4ed5-aeea-4379-ad20-ea374aa1f071/deploy-status)](https://app.netlify.com/sites/whats-the-time/deploys)

</div>

## Features

- 🕗 **Quickly convert times** e.g. *Time in `New York` when `10 pm` in `London`*.
- 👀 **Create a dashboard** - Save common times and places so you know what time it'll be anywhere at a glance.

---

## 👟 Install

```
npm install
```
> Ensure [node](https://nodejs.org) (v12.13+) is installed.

## 🍕 Develop

```
npm start
```
Open dev server on [localhost:1234](http://localhost:1234/).

## 💻 Release

```
npm run build
```
Files are built and minified in the `dist` folder.

Deploy statically (e.g. [Netlify](https://www.netlify.com/)) with the following build settings:
- Command: `npm run build`
- Directory: `dist`

### 💻 Environment variables

Use the `.env.example` file to get started and [read how they're used in Parcel here](https://parceljs.org/env.html).

Variable | Example Value | Description
| - | :-: | - | - |
URL_SITE | `https://mysite.com` | The main site url. Used for links and full static image paths. *Do not use a final `/` character.*

*Note: You may need to delete the `.cache` folder and rebuild to apply changes in dev.*

