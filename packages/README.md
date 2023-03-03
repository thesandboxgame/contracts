# Smart-Contracts for [The Sandbox](https://www.sandbox.game) source code workspaces

This directory contains the source code used by [The Sandbox](https://www.sandbox.game)

Each workspace can use any tool needed for development, but, it must have at least one the test npm script to run tests 

We recommend:

- hardhat 
- hardhat-toolbox
- typescript
- eslint 
- prettier 
- solcover
- solhint

# Deploy

Each workspace must export via nmp the solidity source code then we import the source code from different places in the
deploy workspace that manage the deployment to our different environments.
