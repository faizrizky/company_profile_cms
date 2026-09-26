import * as migration_20260926_062803_initial from './20260926_062803_initial';

export const migrations = [
  {
    up: migration_20260926_062803_initial.up,
    down: migration_20260926_062803_initial.down,
    name: '20260926_062803_initial'
  },
];
