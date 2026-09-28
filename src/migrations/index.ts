import * as migration_20260926_062803_initial from './20260926_062803_initial';
import * as migration_20260926_180825_navigation_link_library from './20260926_180825_navigation_link_library';
import * as migration_20260927_111352_two_factor_auth from './20260927_111352_two_factor_auth';
import * as migration_20260928_072232_product_showcase_tab from './20260928_072232_product_showcase_tab';
import * as migration_20260928_090051_hover_details from './20260928_090051_hover_details';

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
    name: '20260927_111352_two_factor_auth',
  },
  {
    up: migration_20260928_072232_product_showcase_tab.up,
    down: migration_20260928_072232_product_showcase_tab.down,
    name: '20260928_072232_product_showcase_tab',
  },
  {
    up: migration_20260928_090051_hover_details.up,
    down: migration_20260928_090051_hover_details.down,
    name: '20260928_090051_hover_details'
  },
];
