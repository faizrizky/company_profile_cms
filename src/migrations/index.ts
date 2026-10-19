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
import * as migration_20261002_111145_media_display_name from './20261002_111145_media_display_name';
import * as migration_20261012_044724_show_in_mega_menu from './20261012_044724_show_in_mega_menu';
import * as migration_20261012_050504_navigation_link_visible from './20261012_050504_navigation_link_visible';
import * as migration_20261012_161226_tutorial from './20261012_161226_tutorial';
import * as migration_20261013_002155_content_drafts from './20261013_002155_content_drafts';
import * as migration_20261013_074132_email_notifications from './20261013_074132_email_notifications';
import * as migration_20261014_090051_site_settings_drafts from './20261014_090051_site_settings_drafts';
import * as migration_20261014_092153_navigation_footer_drafts from './20261014_092153_navigation_footer_drafts';
import * as migration_20261019_073205_tab_brochure from './20261019_073205_tab_brochure';

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
    name: '20260929_042847_partner_description_localized',
  },
  {
    up: migration_20261002_111145_media_display_name.up,
    down: migration_20261002_111145_media_display_name.down,
    name: '20261002_111145_media_display_name',
  },
  {
    up: migration_20261012_044724_show_in_mega_menu.up,
    down: migration_20261012_044724_show_in_mega_menu.down,
    name: '20261012_044724_show_in_mega_menu',
  },
  {
    up: migration_20261012_050504_navigation_link_visible.up,
    down: migration_20261012_050504_navigation_link_visible.down,
    name: '20261012_050504_navigation_link_visible',
  },
  {
    up: migration_20261012_161226_tutorial.up,
    down: migration_20261012_161226_tutorial.down,
    name: '20261012_161226_tutorial',
  },
  {
    up: migration_20261013_002155_content_drafts.up,
    down: migration_20261013_002155_content_drafts.down,
    name: '20261013_002155_content_drafts',
  },
  {
    up: migration_20261013_074132_email_notifications.up,
    down: migration_20261013_074132_email_notifications.down,
    name: '20261013_074132_email_notifications',
  },
  {
    up: migration_20261014_090051_site_settings_drafts.up,
    down: migration_20261014_090051_site_settings_drafts.down,
    name: '20261014_090051_site_settings_drafts',
  },
  {
    up: migration_20261014_092153_navigation_footer_drafts.up,
    down: migration_20261014_092153_navigation_footer_drafts.down,
    name: '20261014_092153_navigation_footer_drafts',
  },
  {
    up: migration_20261019_073205_tab_brochure.up,
    down: migration_20261019_073205_tab_brochure.down,
    name: '20261019_073205_tab_brochure'
  },
];
