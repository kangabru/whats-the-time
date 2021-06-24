declare module "*.jpg" { const value: any; export = value; }
declare module "*.png" { const value: any; export = value; }
declare module "*.svg" { const value: any; export = value; }

declare var process: { env: { NODE_ENV: 'development' | 'production' } }

/** Import icons directly from their source file to only import what we use.
 *
 *  ✘ import { MyIcon } from '@heroicons/react/outline';
 *
 *  ✔ import MyIcon from '@heroicons/react/outline/MyIcon';
 */
declare module "@heroicons/react/outline" { export = never }

/** Import icons directly from their source file to only import what we use.
 *
 *  ✘ import { MyIcon } from '@heroicons/react/solid';
 *
 *  ✔ import MyIcon from '@heroicons/react/solid/MyIcon';
 */
declare module "@heroicons/react/solid" { export = never }
