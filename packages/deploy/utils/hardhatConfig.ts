import {HardhatUserConfig} from 'hardhat/types';
import path from 'path';
import {traverse} from 'hardhat-deploy/dist/src/utils';
import fs from "fs";

export function nodeUrl(networkName: string): string {
  if (networkName) {
    const uri = process.env['ETH_NODE_URI_' + networkName.toUpperCase()];
    if (uri && uri !== '') {
      return uri;
    }
  }

  let uri = process.env.ETH_NODE_URI;
  if (uri) {
    uri = uri.replace('{{networkName}}', networkName);
  }
  if (!uri || uri === '') {
    // throw new Error(`environment variable "ETH_NODE_URI" not configured `);
    return '';
  }
  if (uri.indexOf('{{') >= 0) {
    throw new Error(
      `invalid uri or network not supported by node provider : ${uri}`
    );
  }
  return uri;
}

export function getMnemonic(networkName?: string): string {
  if (networkName) {
    const mnemonic = process.env['MNEMONIC_' + networkName.toUpperCase()];
    if (mnemonic && mnemonic !== '') {
      return mnemonic;
    }
  }

  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic || mnemonic === '') {
    return 'test test test test test test test test test test test junk';
  }
  return mnemonic;
}

export function accounts(networkName?: string): { mnemonic: string } {
  return {mnemonic: getMnemonic(networkName)};
}

export function addSourceFiles(initial: HardhatUserConfig): HardhatUserConfig {
  // const path = await import('path');
  const dirs = require.main ? require.main.paths.filter(fs.existsSync)
    .map(d => fs.readdirSync(d).filter(x => x.startsWith('sandbox-smart-contracts')).map(f => path.join(d, f)))
    .flat() : []
  let paths: string[] = [];
  for (const d of dirs) {
    const entries = traverse(d, [], d,
      (name, stats) => !name.startsWith('.') && name != "node_modules" && (stats.isDirectory() || name.endsWith('.sol'))
    ).filter(x => !x.directory);
    const b = path.basename(d);
    paths = [...paths, ...entries.map(x => path.join(b, x.relativePath))];
  }

  return {
    ...initial,
    dependencyCompiler: {
      ...initial.dependencyCompiler,
      paths: [...(initial.dependencyCompiler && initial.dependencyCompiler.paths || []), ...paths]
    }
  };
}
