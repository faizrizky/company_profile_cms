import * as migration_20260926_062803_initial from './20260926_062803_initial';
import * as migration_20260926_180825_navigation_link_library from './20260926_180825_navigation_link_library';
import * as migration_20260927_111352_two_factor_auth from './20260927_111352_two_factor_auth';
import * as migration_20260928_072232_product_showcase_tab from './20260928_072232_product_showcase_tab';
import * as migration_20260928_090051_hover_details from './20260928_090051_hover_details';
import * as migration_20260928_091750_problem_item_image from './20260928_091750_problem_item_image';
import * as migration_20260928_095512_cert_icon_hover from './20260928_095512_cert_icon_hover';
import * as migration_20260928_100915_product_tags from './20260928_100915_product_tags';
import * as migration_20260929_041421_partner_hover_tooltip from './20260929_041421_partner_hover_tooltip';
import * as migration_20260929_042847_partner_description_localized from './20260929_042847_partner_description_localized';

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
    name: '20260928_090051_hover_details',
  },
  {
    up: migration_20260928_091750_problem_item_image.up,
    down: migration_20260928_091750_problem_item_image.down,
    name: '20260928_091750_problem_item_image',
  },
  {
    up: migration_20260928_095512_cert_icon_hover.up,
    down: migration_20260928_095512_cert_icon_hover.down,
    name: '20260928_095512_cert_icon_hover',
  },
  {
    up: migration_20260928_100915_product_tags.up,
    down: migration_20260928_100915_product_tags.down,
    name: '20260928_100915_product_tags',
  },
  {
    up: migration_20260929_041421_partner_hover_tooltip.up,
    down: migration_20260929_041421_partner_hover_tooltip.down,
    name: '20260929_041421_partner_hover_tooltip',
  },
  {
    up: migration_20260929_042847_partner_description_localized.up,
    down: migration_20260929_042847_partner_description_localized.down,
    name: '20260929_042847_partner_description_localized'
  },
];
