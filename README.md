# rainbow-bridge-wars frontend

## Description
This is frontend in VUE for RawinbowWars. The RainbowWars project consists of three parts:
- ethereum contract
- near contract
- frontend

## Modify the Network Config
### ethereum network config
Modify the `src/lib/ethConfig.js`, changing the `ethBridge` and `ethNodeUrl` to your config:
```
{
    ...
    ethBridge: 'ETH contract address',
    ethNodeUrl: 'eth node rpc url',
    ...
}
```
### near network config
Modify the `src/lib/nearConfig.js`, changing the `CONTRACT_NAME` to your Near ContractID:
```
...
const CONTRACT_NAME = 'Near ContractID'; /* TODO: fill this in! */
...
```
The `development` configuration is now used by default, if you want to change it, you can modify the `src/lib/nearInit.js`:
```
...
const nearConfig = getConfig("development"); // change to your config name
...
```

## Requirements
### compile and deploy
- Nodejs
- yarn
### play the game
- [meatmask][metamask] browser plug-in

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

[metamask]: https://metamask.io