# To-Do List

A React and Vite to-do list with Tailwind CSS, React Router, Zustand, and Axios. The interface uses top navigation, a blue/purple/teal background, task groups, and Done / Not Done controls, with responsive cards, interactive colors, keyboard focus states, and confirmation dialogs. Background motion respects the browser’s reduced-motion preference.

## Run locally

```sh
npm ci
npm run dev
```

On Windows PowerShell, use `npm.cmd` if the execution policy blocks `npm`. `npm ci` installs the versions recorded in `package-lock.json`.

## Check and build

```sh
npm run lint
npm test
npm run build
npm run preview
```

## Pages

- `/`: view the dashboard welcome, statistics for all tasks, and a sample user profile.
- `/my-task`: add ungrouped tasks, mark them Done or Not Done, and delete them.
- `/groups`: create, open, or delete groups and view their task counts.
- `/groups/:groupId`: manage tasks in one group and clear them after confirmation.
- `/guide`: How to Use cards and detailed instructions for task workflows, navigation, shared state, and user information.
- `/users`: sample names, usernames, email addresses, and avatars retrieved from DummyJSON.
- `/developers`: project developers Gerald Constantino and Kelvin dan Dela Cruz.

## Tasks and user information

Tasks and groups share Zustand state in `src/store.js`, accessed through `src/hooks/useTodoStore.js`. React state manages form inputs and dialogs. My Task manages ungrouped tasks. Task lists and statistics update together; the dashboard counts all tasks, while group pages count only their own tasks.

Changes are saved under the existing `todo-list-data` localStorage key using the original `{ groups, tasks }` format, so existing saved work is retained. The four default groups are School Activities, Personal Tasks, Projects, and Daily Tasks. Deleting a group also deletes its tasks; clearing a group keeps the group itself. Both actions require confirmation. Saved data stays in the same browser and does not sync between devices. A save failure displays a warning while keeping changes in memory.

Axios in `src/api.js` requests six sample users from `https://dummyjson.com/users`, selecting only the displayed profile fields. It does not send tasks or groups to the API. Profile sections include loading, empty, error, refresh, and retry states. Requests time out after ten seconds and are cancelled when the section unmounts. Missing or failed avatars fall back to initials. An API failure does not prevent local task management. DummyJSON profiles are demonstration data, separate from the actual project developers.

The Node test runner checks task and group actions, Zustand subscriptions, saved-data compatibility, storage failures and recovery, and Axios response/error/cancellation handling. API tests use local fixtures and make no network requests. Browser interaction and responsive layout checks are separate from these tests.

## GitHub files

Keep `src/`, `public/`, the project configuration, `README.md`, and both package files in Git. The lockfile makes installs repeatable. Dependencies (`node_modules/`), build output (`dist/`), local environment files, and Vercel’s local metadata are excluded by `.gitignore`. Run `npm run build` again whenever you need a fresh production preview.

## Vercel

Use the Vite preset, `npm run build` as the build command, and `dist` as the output directory. The root directory is this existing project. `vercel.json` serves the React app for direct route visits, including group URLs. No deployment is performed by this configuration.
