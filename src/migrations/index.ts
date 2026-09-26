import * as migration_20260926_062803_initial from './20260926_062803_initial';
import * as migration_20260926_180825_navigation_link_library from './20260926_180825_navigation_link_library';

export const migrations = [
  {
    up: migration_20260926_062803_initial.up,
    down: migration_20260926_062803_initial.down,
    name: '20260926_062803_initial',
  },
  {
    up: migration_20260926_180825_navigation_link_library.up,
    down: migration_20260926_180825_navigation_link_library.down,
    name: '20260926_180825_navigation_link_library'
  },
];
