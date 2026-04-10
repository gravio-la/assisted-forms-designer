import { makeConfigWithExternals } from '@formswizard/tsup-config/tsup.config.js'
import pkg from './package.json'

export default {
  ...makeConfigWithExternals(pkg),
  entry: ['src/index.ts'],
}
