import { composePlugins, withNx, ModuleFederationConfig } from '@nx/webpack';
import { withReact } from '@nx/react';
import { withModuleFederation } from '@nx/react/module-federation';

import baseConfig from './module-federation.config';
import {withZephyr} from "zephyr-webpack-plugin";

const config: ModuleFederationConfig = {
  ...baseConfig,
};

// Nx plugins for webpack to build config object from Nx options and context.
export default composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(config),
  withZephyr(),
  (config) => {
    return patch_import_issue(config);
  }
);

function patch_import_issue(config: any) {
  config.plugins
    ?.filter((plugin) => plugin?.constructor.name === 'ModuleFederationPlugin')
    ?.forEach(mfConfig => {
      Object.keys(mfConfig._options.remotes)
        .forEach(remoteName => {
          mfConfig._options.remotes[remoteName] = mfConfig._options.remotes[remoteName]
            .replace(`__import__`, `import`)
        });
    });
  return config;
}
