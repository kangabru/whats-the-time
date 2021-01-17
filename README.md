<div align="center">

# Typescript + Preact + Tailwind CSS Boilerplate

A minimal [Preact](https://preactjs.com/) and [Typescript](https://www.typescriptlang.org/) app using [Tailwind CSS](https://tailwindcss.com/) and bundled with [Parcel](https://parceljs.org/).
</div>

## Features

- 🤍 **Dead simple usage**. Forget the project setup and just focus on the code.
- 🎨 **Easy to extend**. Parcel brings zero config support for a [dizzyingly array](https://parceljs.org/transforms.html) of plugins.
- 🍕 **Fast development**. The site starts with a single command and automatically refreshes on file changes.
- 💻 **Deployment ready**. Build, optimise, and minify files with a single command.
- 🔎 **Productive typechecking**. Write untyped code while prototyping and only typecheck when it matters.

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

---

## 🤔 Notes

<details>
  <summary><b>Typescript typecheck notes</b></summary>

- Typescript code is typechecked via the `typecheck` command and at the start of the `start` and `build` commands
- Code is *not* typechecked on automatic files changes like most bundlers. This allows you write scrappy, untyped code whilst prototyping to keep development fast. Simply add types later before committing code.
</details>

---

### Have an issue?

Post an issue and I'll be happy to help 🙂
