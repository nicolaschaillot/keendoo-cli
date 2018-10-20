![Alt text](/screenshot.jpg?raw=true "keendoo-cli")

# About

Keendoo CLI is a command-line interface for helping developers around Keendoo ecosystem.

# For keendoo-cli developers

Install via NPM:
(from projet root folder)

```bash
npm install
```

Then run :

```bash
node bin/keendoo-cli.js migrate --src /path/to/my/studio/git/folder --dest /path/to/destination
```

For the moment the files are generated in the project under the directory /results which is in .gitignore file.
The directory must be manually created before first launch.