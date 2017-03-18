# Contribution Guidelines

We love improvements to our tools! EDGI has general [guidelines for contributing](https://github.com/edgi-govdata-archiving/overview/blob/master/CONTRIBUTING.md) to all of our organizational repos.

## Getting Started

If you're new to the project, please check out the [issue queue](https://github.com/edgi-govdata-archiving/archivers.space/issues) for some ideas about what needs to be done.

## Installation

To run the application locally, you'll need to install [Node.js](https://nodejs.org/en/download/) and [Meteor](https://www.meteor.com/install). With those in hand, cd into your clone of the repo and run `meteor npm install` to download dependencies. Then run `meteor run` to start the app, which you should be able to visit in a browser by going to `http://localhost:3000/`. Log in as "root"/"change_this_password_right_now" and you're in business.

## Getting Oriented

We have a [code walkthrough video](https://youtu.be/v-1nrXCIHn8) to help you get familiar with the codebase. The file structure has changed slightly since this video was recorded but the concepts are the same.

## Code Linting

With any collaborative project, it's helpful to have a defined code formatting standard. For background on this, check out [EDGI's proposed linting standards](https://github.com/edgi-govdata-archiving/overview/blob/master/protocol/linting.md). archivers.space follows the standards set out in the [Meteor code style guide](https://guide.meteor.com/code-style.html), which is based on the [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) configuration package.

The easiest way to enforce these rules is to use [eslint](http://eslint.org/). We require all of our code to pass eslint inspection before it is committed. You can install eslint on your work station globally or use the eslint executable that is one of the dev dependencies in this project's `package.json`. Contributor ChaiBapchya did a global install using Linuxbrew and Node and documented the process [here](https://github.com/edgi-govdata-archiving/archivers.space/blob/master/documentation/eslint_global_install_with_linuxbrew_and_node.md).

There are a handful of eslint rule exceptions in `package.json` and you will also find [case-by-case exceptions](http://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments) in comments throughout the code.

The tricky part is getting eslint integrated with your editor so that you see lint exceptions as you work. Here is a [list of resources](http://eslint.org/docs/user-guide/integrations) to help you get started. If you code in vim, [here are some extra hints](https://github.com/edgi-govdata-archiving/archivers.space/blob/master/documentation/eslint_vim_integration.md).
