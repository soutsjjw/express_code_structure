import pkg from '../package.json'

const env = (pkg.config && pkg.config.env &&
             pkg.config.env.toUpperCase()) || 'DEV'

const appId = 100008661

const configs = {
  DEV: require('./dev').default,
  FAT: require('./fat').default,
  FWS: require('./fat').default,
  UAT: require('./uat').default,
  PRD: require('./prod').default,
  PRO: require('./prod').default,
  PROD: require('./prod').default
}

const CONFIG = {
  env,
  appId,
  ...configs[env]
}

export default CONFIG
