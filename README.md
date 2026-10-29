# To-Do List

A React and Vite to-do list with Tailwind CSS, React Router, and localStorage.

## Run locally

```sh
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd` if the execution policy blocks `npm`.

## Check and build

```sh
npm run lint
npm test
npm run build
npm run preview
```

## Pages

- `/`: add ungrouped tasks, mark them Done or Not Done, delete them, and view statistics for all tasks.
- `/groups`: create, open, or delete groups and view their task counts.
- `/groups/:groupId`: manage tasks in one group and clear them after confirmation.
- `/guide`: short instructions for each feature.
- `/developers`: developer names and roles, editable in `src/pages/Developers.jsx`.

Tasks and groups share state in `src/App.jsx` and are saved together under the `todo-list-data` localStorage key. The four default groups are created on the first visit. Deleting a group also deletes its tasks. Saved data stays in the same browser and does not sync between devices.

The dependency-free tests in `src/data.test.js` check task actions, group validation, group deletion, clearing, and saved data restoration. They do not replace browser interaction or responsive layout testing.

## Vercel

Use the Vite preset, `npm run build` as the build command, and `dist` as the output directory. The root directory is this existing project. `vercel.json` serves the React app for direct route visits, including group URLs. No deployment is performed by this configuration.
