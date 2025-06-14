# How to run
From first terminal
```shell
cd miniapi
npm install
npm run start
```
and from the second terminal
```shell
npm install
npm run dev
```

Note that the miniapi subproject requires a .env file in it's root with variable `TOKEN_SECRET` set.
# How to test
1. Open 'Recorder' tab in browser devtools
2. Click the 'Import recording' button
3. Select any file from the `tests` directory
4. After loading, click the 'Replay' button

This workflow has been verified to work in Chrome and Edge.