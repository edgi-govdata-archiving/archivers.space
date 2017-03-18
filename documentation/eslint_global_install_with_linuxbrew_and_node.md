# ESLint SETUP

To setup ESLint, one needs Node and NPM (Node Package Manager)
To install Node, one can use Homebrew / Linuxbrew

Source - 
1. http://blog.teamtreehouse.com/install-node-js-npm-linux
2. http://eslint.org/docs/user-guide/getting-started
3. https://docs.npmjs.com/
4. http://stackoverflow.com

### NPM[node package manager]

npm makes it easy for JavaScript developers to share and reuse code, and it makes it easy to update the code that you're sharing.
These bits of reusable code are called packages, or sometimes modules. A package is just a directory with one or more files in it, that also has a file called "package.json" with some metadata about this package.

**_NPM_** can mean

1. Website 
2. Registry 
3. NPM Client (to publish reusable code to registry or pull code from registry)

Node comes with npm installed

## Steps 

1. Install the pre-requisite Developer Tools (e.g. `Fedora`)

`# sudo dnf groupinstall 'Development Tools' && sudo yum install curl git m4 ruby texinfo bzip2-devel curl-devel expat-devel ncurses-devel zlib-devel -y`

2. Install Linuxbrew

`$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)"]`

3. Update the Bashrc file 

Edit using Vim / Nano / Editor - `$vim ~/.bashrc`

```
export PATH="$HOME/.linuxbrew/bin:$PATH"
export MANPATH="$HOME/.linuxbrew/share/man:$MANPATH"  
export INFOPATH="$HOME/.linuxbrew/share/info:$INFOPATH"
```

4. Reflect changes immediately w/o closing and reopening console/terminal

`$ . ~/.bashrc` OR
`$ source ~/.bashrc`

5. Install `NODE` using Brew

`$ brew install node`

6. Check if properly installed

`$ node -v 
v7.7.3`

7. Check if NPM working 

`$ npm -v 
4.1.2`

8. Update NPM - since npm is updated more frequently than node is. 

`$ npm install npm@latest -g`

9. Create package.json - 

`$ npm init -y`

10. Install package eslint using NPM


`$ npm install eslint --save-dev `
```
chai@1.0.0 /home/chai 
└── eslint@3.18.0 
npm WARN chai@1.0.0 No description 
npm WARN chai@1.0.0 No repository field. 
npm WARN The package eslint is included as both a dev and production dependency.```
```

11. Initialize ESLINT 

`$ /node_modules/.bin/eslint --init `
```
? How would you like to configure ESLint? Use a popular style guide 
? Which style guide do you want to follow? Standard 
? What format do you want your config file to be in? JavaScript 

Installing eslint-plugin-standard, eslint-plugin-promise, eslint-config-standard 

chai@1.0.0 /home/chai 
├── eslint-config-standard@7.1.0 
├── eslint-plugin-promise@3.5.0 
└── eslint-plugin-standard@2.1.1 

npm WARN chai@1.0.0 No description 
npm WARN chai@1.0.0 No repository field. 
npm WARN The package eslint is included as both a dev and production dependency. 

Successfully created .eslintrc.js file in /home/chai```
```

12. Test Eslint

`$ ./node_modules/.bin/eslint sample.js `

## Possible Errors

1. Running as root/admin

```# ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)" 
Don't run this as root! 
-e:110: warning: Insecure world writable dir /usr/lib/jvm/jdk1.8.0_121/bin in PATH, mode 040777
```
Solution - Dont run as root
Clue - Notice the change of prompt from `$` (in normal user) to `#` (super user)

`# exit`

2. While installing Linuxbrew

`-e:52: warning: Insecure world writable dir /usr/lib/jvm/jdk1.8.0_121/bin in PATH, mode 040777`

`$ chmod go-w `

#### Meaning :- 

go (group and others) 
-w (remove write permission)

`-e:52: warning: Insecure world writable dir /usr/lib/jvm/jdk1.8.0_121 in PATH, mode 040777`
`-e:52: warning: Insecure world writable dir /usr/lib in PATH, mode 040777`

Solution - Not found. Ignored warning

3. While installing node
`$ brew install node `

```
Error: Unsupported special dependency :perl 
Please report this bug:    https://github.com/Linuxbrew/linuxbrew/blob/master/share/doc/homebrew/Troubleshooting.md#troubleshooting
```

Solution 

`$ brew update`

4. Write access missing while installing package using node

```
npm WARN checkPermissions Missing write access to /home/chai/node_modules 
/home/chai 
└── eslint@3.18.0
```

Solution
Find groups

```
$ groups chai
chai : chai wheel
```

Provide write access using chown

`$ sudo chown -R chai:chai /home/chai/node_modules/ `

Best way to solve Access permissions - https://docs.npmjs.com/getting-started/fixing-npm-permissions

5. ENOENT error package.json

`npm WARN saveError ENOENT: no such file or directory, open '/home/chai/package.json'`
`npm WARN enoent ENOENT: no such file or directory, open '/home/chai/package.json'`

Issue - Unable to find package.json. Hence, create it and then install

Solution

`$ npm init -y `

6. Trying to execute eslint directly

```
$ eslint sample.js 
bash: eslint: command not found...
```

7. If you remove the config fine (eslintrc), and try running ESLINT

```
Oops! Something went wrong! :(

ESLint couldn't find a configuration file.
```

Solution
Setup config file using 
`$ eslint init`
