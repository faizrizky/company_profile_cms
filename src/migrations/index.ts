import * as migration_20260926_062803_initial from './20260926_062803_initial';
import * as migration_20260926_180825_navigation_link_library from './20260926_180825_navigation_link_library';
import * as migration_20260927_111352_two_factor_auth from './20260927_111352_two_factor_auth';

export const migrations = [
  {
    up: migration_20260926_062803_initial.up,
    down: migration_20260926_062803_initial.down,
    name: '20260926_062803_initial',
  },
  {
    up: migration_20260926_180825_navigation_link_library.up,
    down: migration_20260926_180825_navigation_link_library.down,
    name: '20260926_180825_navigation_link_library',
  },
  {
    up: migration_20260927_111352_two_factor_auth.up,
    down: migration_20260927_111352_two_factor_auth.down,
    name: '20260927_111352_two_factor_auth'
  },
];
