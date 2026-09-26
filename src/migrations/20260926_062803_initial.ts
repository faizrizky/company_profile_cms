import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_pages_blocks_hero_buttons_style" AS ENUM('fill', 'stroke');
  CREATE TYPE "public"."enum_pages_blocks_hero_variant" AS ENUM('home', 'centered', 'page');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_variant" AS ENUM('cards', 'values');
  CREATE TYPE "public"."enum_pages_blocks_certifications_variant" AS ENUM('cards', 'gallery');
  CREATE TYPE "public"."enum_pages_blocks_cta_buttons_style" AS ENUM('fill', 'stroke');
  CREATE TYPE "public"."enum_pages_blocks_cta_variant" AS ENUM('simple', 'withMedia');
  CREATE TYPE "public"."enum_pages_blocks_badge_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_heading_level" AS ENUM('h1', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_heading_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_heading_color" AS ENUM('accent', 'white');
  CREATE TYPE "public"."enum_pages_blocks_heading_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_paragraph_size" AS ENUM('sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_paragraph_tone" AS ENUM('default', 'muted');
  CREATE TYPE "public"."enum_pages_blocks_paragraph_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_image_aspect" AS ENUM('video', 'landscape', 'square', 'portrait');
  CREATE TYPE "public"."enum_pages_blocks_button_style" AS ENUM('fill', 'stroke');
  CREATE TYPE "public"."enum_pages_blocks_button_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_spacer_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_layout_section_columns" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_layout_section_vertical_align" AS ENUM('start', 'center');
  CREATE TYPE "public"."enum_pages_blocks_layout_section_gap" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_layout_section_background" AS ENUM('dark', 'darker', 'gradient', 'image');
  CREATE TYPE "public"."enum_pages_blocks_layout_section_padding" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_layout_section_width" AS ENUM('narrow', 'default', 'wide');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_buttons_style" AS ENUM('fill', 'stroke');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_variant" AS ENUM('home', 'centered', 'page');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_variant" AS ENUM('cards', 'values');
  CREATE TYPE "public"."enum__pages_v_blocks_certifications_variant" AS ENUM('cards', 'gallery');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_buttons_style" AS ENUM('fill', 'stroke');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_variant" AS ENUM('simple', 'withMedia');
  CREATE TYPE "public"."enum__pages_v_blocks_badge_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_heading_level" AS ENUM('h1', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_heading_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_heading_color" AS ENUM('accent', 'white');
  CREATE TYPE "public"."enum__pages_v_blocks_heading_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_paragraph_size" AS ENUM('sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_paragraph_tone" AS ENUM('default', 'muted');
  CREATE TYPE "public"."enum__pages_v_blocks_paragraph_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_image_aspect" AS ENUM('video', 'landscape', 'square', 'portrait');
  CREATE TYPE "public"."enum__pages_v_blocks_button_style" AS ENUM('fill', 'stroke');
  CREATE TYPE "public"."enum__pages_v_blocks_button_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_section_columns" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_section_vertical_align" AS ENUM('start', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_section_gap" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_section_background" AS ENUM('dark', 'darker', 'gradient', 'image');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_section_padding" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_section_width" AS ENUM('narrow', 'default', 'wide');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_certifications_icon_shape" AS ENUM('square', 'wide', 'narrow');
  CREATE TYPE "public"."enum_certifications_certificate_focus" AS ENUM('center', 'top');
  CREATE TYPE "public"."enum_solution_categories_challenges_items_icon" AS ENUM('downtime', 'cost', 'error', 'inconsistent');
  CREATE TYPE "public"."enum_solution_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__solution_categories_v_version_challenges_items_icon" AS ENUM('downtime', 'cost', 'error', 'inconsistent');
  CREATE TYPE "public"."enum__solution_categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__solution_categories_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_contact_submissions_status" AS ENUM('new', 'in-progress', 'done', 'spam');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_audit_logs_action" AS ENUM('create', 'update', 'delete', 'login');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_site_settings_socials_platform" AS ENUM('facebook', 'instagram', 'linkedin', 'tiktok', 'youtube', 'x', 'whatsapp', 'other');
  CREATE TABLE "pages_blocks_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"style" "enum_pages_blocks_hero_buttons_style" DEFAULT 'fill'
  );
  
  CREATE TABLE "pages_blocks_hero_buttons_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_hero_variant" DEFAULT 'home',
  	"background_id" integer,
  	"background_mobile_id" integer,
  	"show_partners" boolean,
  	"show_certificates" boolean,
  	"show_scroll_hint" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_problem_showcase_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "pages_blocks_problem_showcase_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_problem_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_problem_showcase_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_video_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"poster_id" integer,
  	"video_id" integer,
  	"video_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_showcase_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"caption_title" varchar,
  	"caption_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_solution_highlights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_solution_highlights_items_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_solution_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"featured_image_id" integer,
  	"featured_button_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_solution_highlights_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"featured_title" varchar,
  	"featured_description" varchar,
  	"featured_tags_label" varchar DEFAULT 'Recommended For',
  	"featured_button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_expertise_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric
  );
  
  CREATE TABLE "pages_blocks_expertise_stats_locales" (
  	"suffix" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_expertise_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"icon_id" integer
  );
  
  CREATE TABLE "pages_blocks_expertise_cards_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_expertise" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_expertise_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_feature_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "pages_blocks_feature_grid_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_feature_grid_variant" DEFAULT 'cards',
  	"background_id" integer,
  	"background_overlay_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"quote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_leadership_leaders" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer
  );
  
  CREATE TABLE "pages_blocks_leadership_leaders_locales" (
  	"name" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_leadership" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_leadership_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_team_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric
  );
  
  CREATE TABLE "pages_blocks_team_stats_items_locales" (
  	"suffix" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_team_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_stats_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_partners_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_certifications_variant" DEFAULT 'cards',
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_certifications_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_solution_overview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_solution_overview_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_items_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_workflow_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_workflow_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_workflow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_workflow_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_form_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"title_mobile" varchar,
  	"description" varchar,
  	"description_mobile" varchar,
  	"submit_label" varchar DEFAULT 'Request Consultation',
  	"response_note" varchar DEFAULT 'Response within 1–2 business days.',
  	"whatsapp_text" varchar,
  	"success_message" varchar DEFAULT 'Thank you! Our team will contact you shortly.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_office_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_office_map_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"style" "enum_pages_blocks_cta_buttons_style" DEFAULT 'fill'
  );
  
  CREATE TABLE "pages_blocks_cta_buttons_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_cta_variant" DEFAULT 'simple',
  	"background_id" integer,
  	"background_mobile_id" integer,
  	"media_id" integer,
  	"video_id" integer,
  	"video_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_badge" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"align" "enum_pages_blocks_badge_align" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_badge_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"level" "enum_pages_blocks_heading_level" DEFAULT 'h2',
  	"size" "enum_pages_blocks_heading_size" DEFAULT 'lg',
  	"color" "enum_pages_blocks_heading_color" DEFAULT 'accent',
  	"align" "enum_pages_blocks_heading_align" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_heading_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_paragraph" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_paragraph_size" DEFAULT 'base',
  	"tone" "enum_pages_blocks_paragraph_tone" DEFAULT 'default',
  	"align" "enum_pages_blocks_paragraph_align" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_paragraph_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"aspect" "enum_pages_blocks_image_aspect" DEFAULT 'video',
  	"framed" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_button" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"style" "enum_pages_blocks_button_style" DEFAULT 'fill',
  	"align" "enum_pages_blocks_button_align" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_button_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_card_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_spacer_size" DEFAULT 'md',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_layout_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_pages_blocks_layout_section_columns" DEFAULT '2',
  	"vertical_align" "enum_pages_blocks_layout_section_vertical_align" DEFAULT 'center',
  	"gap" "enum_pages_blocks_layout_section_gap" DEFAULT 'md',
  	"background" "enum_pages_blocks_layout_section_background" DEFAULT 'dark',
  	"padding" "enum_pages_blocks_layout_section_padding" DEFAULT 'md',
  	"width" "enum_pages_blocks_layout_section_width" DEFAULT 'default',
  	"background_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"partners_id" integer,
  	"certifications_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"style" "enum__pages_v_blocks_hero_buttons_style" DEFAULT 'fill',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_buttons_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_hero_variant" DEFAULT 'home',
  	"background_id" integer,
  	"background_mobile_id" integer,
  	"show_partners" boolean,
  	"show_certificates" boolean,
  	"show_scroll_hint" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_problem_showcase_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_problem_showcase_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_problem_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_problem_showcase_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_video_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"poster_id" integer,
  	"video_id" integer,
  	"video_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_showcase_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"caption_title" varchar,
  	"caption_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_solution_highlights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_solution_highlights_items_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_solution_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"featured_image_id" integer,
  	"featured_button_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_solution_highlights_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"featured_title" varchar,
  	"featured_description" varchar,
  	"featured_tags_label" varchar DEFAULT 'Recommended For',
  	"featured_button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_expertise_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_expertise_stats_locales" (
  	"suffix" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_expertise_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_expertise_cards_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_expertise" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_expertise_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_feature_grid_variant" DEFAULT 'cards',
  	"background_id" integer,
  	"background_overlay_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"quote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_leadership_leaders" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_leadership_leaders_locales" (
  	"name" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_leadership" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_leadership_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_team_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_stats_items_locales" (
  	"suffix" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_team_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_stats_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_partners_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_certifications_variant" DEFAULT 'cards',
  	"background_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_certifications_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_solution_overview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_solution_overview_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_workflow_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_workflow_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_workflow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_workflow_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"title_mobile" varchar,
  	"description" varchar,
  	"description_mobile" varchar,
  	"submit_label" varchar DEFAULT 'Request Consultation',
  	"response_note" varchar DEFAULT 'Response within 1–2 business days.',
  	"whatsapp_text" varchar,
  	"success_message" varchar DEFAULT 'Thank you! Our team will contact you shortly.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_office_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_office_map_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"style" "enum__pages_v_blocks_cta_buttons_style" DEFAULT 'fill',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_buttons_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_cta_variant" DEFAULT 'simple',
  	"background_id" integer,
  	"background_mobile_id" integer,
  	"media_id" integer,
  	"video_id" integer,
  	"video_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_locales" (
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_badge" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"align" "enum__pages_v_blocks_badge_align" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_badge_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"level" "enum__pages_v_blocks_heading_level" DEFAULT 'h2',
  	"size" "enum__pages_v_blocks_heading_size" DEFAULT 'lg',
  	"color" "enum__pages_v_blocks_heading_color" DEFAULT 'accent',
  	"align" "enum__pages_v_blocks_heading_align" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_heading_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_paragraph" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_paragraph_size" DEFAULT 'base',
  	"tone" "enum__pages_v_blocks_paragraph_tone" DEFAULT 'default',
  	"align" "enum__pages_v_blocks_paragraph_align" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_paragraph_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"aspect" "enum__pages_v_blocks_image_aspect" DEFAULT 'video',
  	"framed" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_button" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"style" "enum__pages_v_blocks_button_style" DEFAULT 'fill',
  	"align" "enum__pages_v_blocks_button_align" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_button_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_spacer_size" DEFAULT 'md',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_layout_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"columns" "enum__pages_v_blocks_layout_section_columns" DEFAULT '2',
  	"vertical_align" "enum__pages_v_blocks_layout_section_vertical_align" DEFAULT 'center',
  	"gap" "enum__pages_v_blocks_layout_section_gap" DEFAULT 'md',
  	"background" "enum__pages_v_blocks_layout_section_background" DEFAULT 'dark',
  	"padding" "enum__pages_v_blocks_layout_section_padding" DEFAULT 'md',
  	"width" "enum__pages_v_blocks_layout_section_width" DEFAULT 'default',
  	"background_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"partners_id" integer,
  	"certifications_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"website" varchar,
  	"show_in_hero" boolean DEFAULT true,
  	"logo_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "certifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"icon_id" integer NOT NULL,
  	"icon_shape" "enum_certifications_icon_shape" DEFAULT 'square',
  	"certificate_id" integer,
  	"certificate_focus" "enum_certifications_certificate_focus" DEFAULT 'center',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "certifications_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "solution_categories_challenges_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_solution_categories_challenges_items_icon" DEFAULT 'downtime'
  );
  
  CREATE TABLE "solution_categories_challenges_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solution_categories_showcase_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"video_mobile_id" integer
  );
  
  CREATE TABLE "solution_categories_showcase_tabs_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solution_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"slug" varchar,
  	"has_detail_page" boolean DEFAULT true,
  	"hero_image_id" integer,
  	"showcase_background_id" integer,
  	"showcase_background_video_id" integer,
  	"showcase_brochure_id" integer,
  	"cta_background_id" integer,
  	"cta_button_href" varchar DEFAULT '/contact',
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_solution_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "solution_categories_locales" (
  	"title" varchar,
  	"hero_title" varchar,
  	"hero_description" varchar,
  	"challenges_eyebrow" varchar DEFAULT 'The Challenges',
  	"challenges_title" varchar,
  	"challenges_description" varchar,
  	"cta_eyebrow" varchar,
  	"cta_title" varchar,
  	"cta_description" varchar,
  	"cta_button_label" varchar DEFAULT 'Request Consultation',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "solution_categories_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "_solution_categories_v_version_challenges_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__solution_categories_v_version_challenges_items_icon" DEFAULT 'downtime',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solution_categories_v_version_challenges_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solution_categories_v_version_showcase_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"video_mobile_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solution_categories_v_version_showcase_tabs_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solution_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_slug" varchar,
  	"version_has_detail_page" boolean DEFAULT true,
  	"version_hero_image_id" integer,
  	"version_showcase_background_id" integer,
  	"version_showcase_background_video_id" integer,
  	"version_showcase_brochure_id" integer,
  	"version_cta_background_id" integer,
  	"version_cta_button_href" varchar DEFAULT '/contact',
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__solution_categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__solution_categories_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_solution_categories_v_locales" (
  	"version_title" varchar,
  	"version_hero_title" varchar,
  	"version_hero_description" varchar,
  	"version_challenges_eyebrow" varchar DEFAULT 'The Challenges',
  	"version_challenges_title" varchar,
  	"version_challenges_description" varchar,
  	"version_cta_eyebrow" varchar,
  	"version_cta_title" varchar,
  	"version_cta_description" varchar,
  	"version_cta_button_label" varchar DEFAULT 'Request Consultation',
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solution_categories_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"category_id" integer NOT NULL,
  	"slug" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"image_mobile_id" integer,
  	"layout_wide" boolean,
  	"layout_large_title" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_contact_submissions_status" DEFAULT 'new',
  	"full_name" varchar NOT NULL,
  	"organization" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"interest" varchar,
  	"message" varchar,
  	"internal_notes" varchar,
  	"meta_ip" varchar,
  	"meta_user_agent" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "audit_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"action" "enum_audit_logs_action" NOT NULL,
  	"resource" varchar NOT NULL,
  	"document_id" varchar,
  	"user_id" integer,
  	"ip" varchar,
  	"user_agent" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "audit_logs_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"media_id" integer,
  	"partners_id" integer,
  	"certifications_id" integer,
  	"solution_categories_id" integer,
  	"products_id" integer,
  	"contact_submissions_id" integer,
  	"users_id" integer,
  	"audit_logs_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_socials_platform" DEFAULT 'other' NOT NULL,
  	"url" varchar NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "site_settings_socials_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL,
  	"contact_latitude" numeric,
  	"contact_longitude" numeric,
  	"contact_email" varchar NOT NULL,
  	"contact_phone" varchar NOT NULL,
  	"contact_whatsapp_number" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"site_name" varchar NOT NULL,
  	"site_description" varchar NOT NULL,
  	"contact_address" varchar NOT NULL,
  	"contact_short_address" varchar,
  	"contact_whatsapp_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "navigation_solution_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL,
  	"highlight" boolean
  );
  
  CREATE TABLE "navigation_solution_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_cards_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_image_id" integer NOT NULL,
  	"featured_href" varchar NOT NULL,
  	"cta_href" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_locales" (
  	"solutions_label" varchar DEFAULT 'Our Solutions',
  	"featured_title" varchar NOT NULL,
  	"featured_description" varchar,
  	"cta_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_columns_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"description" varchar,
  	"copyright" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_hero_buttons" ADD CONSTRAINT "pages_blocks_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_buttons_locales" ADD CONSTRAINT "pages_blocks_hero_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_background_mobile_id_media_id_fk" FOREIGN KEY ("background_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_locales" ADD CONSTRAINT "pages_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_problem_showcase_items" ADD CONSTRAINT "pages_blocks_problem_showcase_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_problem_showcase_items" ADD CONSTRAINT "pages_blocks_problem_showcase_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_problem_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_problem_showcase_items_locales" ADD CONSTRAINT "pages_blocks_problem_showcase_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_problem_showcase_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_problem_showcase" ADD CONSTRAINT "pages_blocks_problem_showcase_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_problem_showcase" ADD CONSTRAINT "pages_blocks_problem_showcase_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_problem_showcase" ADD CONSTRAINT "pages_blocks_problem_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_problem_showcase_locales" ADD CONSTRAINT "pages_blocks_problem_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_problem_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_showcase" ADD CONSTRAINT "pages_blocks_video_showcase_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_showcase" ADD CONSTRAINT "pages_blocks_video_showcase_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_showcase" ADD CONSTRAINT "pages_blocks_video_showcase_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_showcase" ADD CONSTRAINT "pages_blocks_video_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_showcase_locales" ADD CONSTRAINT "pages_blocks_video_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_video_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_solution_highlights_items" ADD CONSTRAINT "pages_blocks_solution_highlights_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_solution_highlights_items" ADD CONSTRAINT "pages_blocks_solution_highlights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_solution_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_solution_highlights_items_locales" ADD CONSTRAINT "pages_blocks_solution_highlights_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_solution_highlights_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_solution_highlights" ADD CONSTRAINT "pages_blocks_solution_highlights_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_solution_highlights" ADD CONSTRAINT "pages_blocks_solution_highlights_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_solution_highlights" ADD CONSTRAINT "pages_blocks_solution_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_solution_highlights_locales" ADD CONSTRAINT "pages_blocks_solution_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_solution_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_expertise_stats" ADD CONSTRAINT "pages_blocks_expertise_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_expertise_stats_locales" ADD CONSTRAINT "pages_blocks_expertise_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_expertise_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_expertise_cards" ADD CONSTRAINT "pages_blocks_expertise_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_expertise_cards" ADD CONSTRAINT "pages_blocks_expertise_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_expertise_cards" ADD CONSTRAINT "pages_blocks_expertise_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_expertise_cards_locales" ADD CONSTRAINT "pages_blocks_expertise_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_expertise_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_expertise" ADD CONSTRAINT "pages_blocks_expertise_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_expertise" ADD CONSTRAINT "pages_blocks_expertise_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_expertise_locales" ADD CONSTRAINT "pages_blocks_expertise_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_items" ADD CONSTRAINT "pages_blocks_feature_grid_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_items" ADD CONSTRAINT "pages_blocks_feature_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_items_locales" ADD CONSTRAINT "pages_blocks_feature_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid" ADD CONSTRAINT "pages_blocks_feature_grid_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid" ADD CONSTRAINT "pages_blocks_feature_grid_background_overlay_id_media_id_fk" FOREIGN KEY ("background_overlay_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid" ADD CONSTRAINT "pages_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_locales" ADD CONSTRAINT "pages_blocks_feature_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_leadership_leaders" ADD CONSTRAINT "pages_blocks_leadership_leaders_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_leadership_leaders" ADD CONSTRAINT "pages_blocks_leadership_leaders_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_leadership"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_leadership_leaders_locales" ADD CONSTRAINT "pages_blocks_leadership_leaders_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_leadership_leaders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_leadership" ADD CONSTRAINT "pages_blocks_leadership_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_leadership" ADD CONSTRAINT "pages_blocks_leadership_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_leadership_locales" ADD CONSTRAINT "pages_blocks_leadership_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_leadership"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_stats_items" ADD CONSTRAINT "pages_blocks_team_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_stats_items_locales" ADD CONSTRAINT "pages_blocks_team_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_stats" ADD CONSTRAINT "pages_blocks_team_stats_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_stats" ADD CONSTRAINT "pages_blocks_team_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_stats_locales" ADD CONSTRAINT "pages_blocks_team_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partners" ADD CONSTRAINT "pages_blocks_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partners_locales" ADD CONSTRAINT "pages_blocks_partners_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_certifications" ADD CONSTRAINT "pages_blocks_certifications_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_certifications" ADD CONSTRAINT "pages_blocks_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_certifications_locales" ADD CONSTRAINT "pages_blocks_certifications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_solution_overview" ADD CONSTRAINT "pages_blocks_solution_overview_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_solution_overview" ADD CONSTRAINT "pages_blocks_solution_overview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_solution_overview_locales" ADD CONSTRAINT "pages_blocks_solution_overview_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_solution_overview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items_locales" ADD CONSTRAINT "pages_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_locales" ADD CONSTRAINT "pages_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_workflow_steps" ADD CONSTRAINT "pages_blocks_workflow_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_workflow"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_workflow_steps_locales" ADD CONSTRAINT "pages_blocks_workflow_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_workflow_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_workflow" ADD CONSTRAINT "pages_blocks_workflow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_workflow_locales" ADD CONSTRAINT "pages_blocks_workflow_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_workflow"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form_locales" ADD CONSTRAINT "pages_blocks_contact_form_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_office_map" ADD CONSTRAINT "pages_blocks_office_map_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_office_map" ADD CONSTRAINT "pages_blocks_office_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_office_map_locales" ADD CONSTRAINT "pages_blocks_office_map_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_office_map"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_buttons" ADD CONSTRAINT "pages_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_buttons_locales" ADD CONSTRAINT "pages_blocks_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_background_mobile_id_media_id_fk" FOREIGN KEY ("background_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_locales" ADD CONSTRAINT "pages_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_badge" ADD CONSTRAINT "pages_blocks_badge_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_badge_locales" ADD CONSTRAINT "pages_blocks_badge_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_badge"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_heading" ADD CONSTRAINT "pages_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_heading_locales" ADD CONSTRAINT "pages_blocks_heading_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_heading"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_paragraph" ADD CONSTRAINT "pages_blocks_paragraph_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_paragraph_locales" ADD CONSTRAINT "pages_blocks_paragraph_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_paragraph"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_locales" ADD CONSTRAINT "pages_blocks_image_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_button" ADD CONSTRAINT "pages_blocks_button_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_button_locales" ADD CONSTRAINT "pages_blocks_button_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_button"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card" ADD CONSTRAINT "pages_blocks_card_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_card" ADD CONSTRAINT "pages_blocks_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_locales" ADD CONSTRAINT "pages_blocks_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_layout_section" ADD CONSTRAINT "pages_blocks_layout_section_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_layout_section" ADD CONSTRAINT "pages_blocks_layout_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_texts" ADD CONSTRAINT "pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_certifications_fk" FOREIGN KEY ("certifications_id") REFERENCES "public"."certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_buttons" ADD CONSTRAINT "_pages_v_blocks_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_buttons_locales" ADD CONSTRAINT "_pages_v_blocks_hero_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_background_mobile_id_media_id_fk" FOREIGN KEY ("background_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_locales" ADD CONSTRAINT "_pages_v_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problem_showcase_items" ADD CONSTRAINT "_pages_v_blocks_problem_showcase_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problem_showcase_items" ADD CONSTRAINT "_pages_v_blocks_problem_showcase_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_problem_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problem_showcase_items_locales" ADD CONSTRAINT "_pages_v_blocks_problem_showcase_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_problem_showcase_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problem_showcase" ADD CONSTRAINT "_pages_v_blocks_problem_showcase_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problem_showcase" ADD CONSTRAINT "_pages_v_blocks_problem_showcase_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problem_showcase" ADD CONSTRAINT "_pages_v_blocks_problem_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problem_showcase_locales" ADD CONSTRAINT "_pages_v_blocks_problem_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_problem_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_showcase" ADD CONSTRAINT "_pages_v_blocks_video_showcase_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_showcase" ADD CONSTRAINT "_pages_v_blocks_video_showcase_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_showcase" ADD CONSTRAINT "_pages_v_blocks_video_showcase_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_showcase" ADD CONSTRAINT "_pages_v_blocks_video_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_showcase_locales" ADD CONSTRAINT "_pages_v_blocks_video_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_video_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solution_highlights_items" ADD CONSTRAINT "_pages_v_blocks_solution_highlights_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solution_highlights_items" ADD CONSTRAINT "_pages_v_blocks_solution_highlights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_solution_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solution_highlights_items_locales" ADD CONSTRAINT "_pages_v_blocks_solution_highlights_items_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_solution_highlights_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solution_highlights" ADD CONSTRAINT "_pages_v_blocks_solution_highlights_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solution_highlights" ADD CONSTRAINT "_pages_v_blocks_solution_highlights_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solution_highlights" ADD CONSTRAINT "_pages_v_blocks_solution_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solution_highlights_locales" ADD CONSTRAINT "_pages_v_blocks_solution_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_solution_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_expertise_stats" ADD CONSTRAINT "_pages_v_blocks_expertise_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_expertise_stats_locales" ADD CONSTRAINT "_pages_v_blocks_expertise_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_expertise_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_expertise_cards" ADD CONSTRAINT "_pages_v_blocks_expertise_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_expertise_cards" ADD CONSTRAINT "_pages_v_blocks_expertise_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_expertise_cards" ADD CONSTRAINT "_pages_v_blocks_expertise_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_expertise_cards_locales" ADD CONSTRAINT "_pages_v_blocks_expertise_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_expertise_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_expertise" ADD CONSTRAINT "_pages_v_blocks_expertise_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_expertise" ADD CONSTRAINT "_pages_v_blocks_expertise_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_expertise_locales" ADD CONSTRAINT "_pages_v_blocks_expertise_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid_items" ADD CONSTRAINT "_pages_v_blocks_feature_grid_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid_items" ADD CONSTRAINT "_pages_v_blocks_feature_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid_items_locales" ADD CONSTRAINT "_pages_v_blocks_feature_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid" ADD CONSTRAINT "_pages_v_blocks_feature_grid_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid" ADD CONSTRAINT "_pages_v_blocks_feature_grid_background_overlay_id_media_id_fk" FOREIGN KEY ("background_overlay_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid" ADD CONSTRAINT "_pages_v_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid_locales" ADD CONSTRAINT "_pages_v_blocks_feature_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_leadership_leaders" ADD CONSTRAINT "_pages_v_blocks_leadership_leaders_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_leadership_leaders" ADD CONSTRAINT "_pages_v_blocks_leadership_leaders_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_leadership"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_leadership_leaders_locales" ADD CONSTRAINT "_pages_v_blocks_leadership_leaders_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_leadership_leaders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_leadership" ADD CONSTRAINT "_pages_v_blocks_leadership_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_leadership" ADD CONSTRAINT "_pages_v_blocks_leadership_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_leadership_locales" ADD CONSTRAINT "_pages_v_blocks_leadership_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_leadership"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_stats_items" ADD CONSTRAINT "_pages_v_blocks_team_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_stats_items_locales" ADD CONSTRAINT "_pages_v_blocks_team_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_stats" ADD CONSTRAINT "_pages_v_blocks_team_stats_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_stats" ADD CONSTRAINT "_pages_v_blocks_team_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_stats_locales" ADD CONSTRAINT "_pages_v_blocks_team_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partners" ADD CONSTRAINT "_pages_v_blocks_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partners_locales" ADD CONSTRAINT "_pages_v_blocks_partners_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_certifications" ADD CONSTRAINT "_pages_v_blocks_certifications_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_certifications" ADD CONSTRAINT "_pages_v_blocks_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_certifications_locales" ADD CONSTRAINT "_pages_v_blocks_certifications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solution_overview" ADD CONSTRAINT "_pages_v_blocks_solution_overview_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solution_overview" ADD CONSTRAINT "_pages_v_blocks_solution_overview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solution_overview_locales" ADD CONSTRAINT "_pages_v_blocks_solution_overview_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_solution_overview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items_locales" ADD CONSTRAINT "_pages_v_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_locales" ADD CONSTRAINT "_pages_v_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_workflow_steps" ADD CONSTRAINT "_pages_v_blocks_workflow_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_workflow"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_workflow_steps_locales" ADD CONSTRAINT "_pages_v_blocks_workflow_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_workflow_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_workflow" ADD CONSTRAINT "_pages_v_blocks_workflow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_workflow_locales" ADD CONSTRAINT "_pages_v_blocks_workflow_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_workflow"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form_locales" ADD CONSTRAINT "_pages_v_blocks_contact_form_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_office_map" ADD CONSTRAINT "_pages_v_blocks_office_map_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_office_map" ADD CONSTRAINT "_pages_v_blocks_office_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_office_map_locales" ADD CONSTRAINT "_pages_v_blocks_office_map_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_office_map"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_buttons" ADD CONSTRAINT "_pages_v_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_buttons_locales" ADD CONSTRAINT "_pages_v_blocks_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_background_mobile_id_media_id_fk" FOREIGN KEY ("background_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_locales" ADD CONSTRAINT "_pages_v_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_badge" ADD CONSTRAINT "_pages_v_blocks_badge_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_badge_locales" ADD CONSTRAINT "_pages_v_blocks_badge_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_badge"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_heading" ADD CONSTRAINT "_pages_v_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_heading_locales" ADD CONSTRAINT "_pages_v_blocks_heading_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_heading"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_paragraph" ADD CONSTRAINT "_pages_v_blocks_paragraph_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_paragraph_locales" ADD CONSTRAINT "_pages_v_blocks_paragraph_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_paragraph"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_locales" ADD CONSTRAINT "_pages_v_blocks_image_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_button" ADD CONSTRAINT "_pages_v_blocks_button_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_button_locales" ADD CONSTRAINT "_pages_v_blocks_button_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_button"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card" ADD CONSTRAINT "_pages_v_blocks_card_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card" ADD CONSTRAINT "_pages_v_blocks_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_locales" ADD CONSTRAINT "_pages_v_blocks_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_layout_section" ADD CONSTRAINT "_pages_v_blocks_layout_section_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_layout_section" ADD CONSTRAINT "_pages_v_blocks_layout_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_texts" ADD CONSTRAINT "_pages_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_certifications_fk" FOREIGN KEY ("certifications_id") REFERENCES "public"."certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certifications" ADD CONSTRAINT "certifications_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certifications" ADD CONSTRAINT "certifications_certificate_id_media_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certifications_locales" ADD CONSTRAINT "certifications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solution_categories_challenges_items" ADD CONSTRAINT "solution_categories_challenges_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solution_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solution_categories_challenges_items_locales" ADD CONSTRAINT "solution_categories_challenges_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solution_categories_challenges_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solution_categories_showcase_tabs" ADD CONSTRAINT "solution_categories_showcase_tabs_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solution_categories_showcase_tabs" ADD CONSTRAINT "solution_categories_showcase_tabs_video_mobile_id_media_id_fk" FOREIGN KEY ("video_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solution_categories_showcase_tabs" ADD CONSTRAINT "solution_categories_showcase_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solution_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solution_categories_showcase_tabs_locales" ADD CONSTRAINT "solution_categories_showcase_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solution_categories_showcase_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solution_categories" ADD CONSTRAINT "solution_categories_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solution_categories" ADD CONSTRAINT "solution_categories_showcase_background_id_media_id_fk" FOREIGN KEY ("showcase_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solution_categories" ADD CONSTRAINT "solution_categories_showcase_background_video_id_media_id_fk" FOREIGN KEY ("showcase_background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solution_categories" ADD CONSTRAINT "solution_categories_showcase_brochure_id_media_id_fk" FOREIGN KEY ("showcase_brochure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solution_categories" ADD CONSTRAINT "solution_categories_cta_background_id_media_id_fk" FOREIGN KEY ("cta_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solution_categories" ADD CONSTRAINT "solution_categories_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solution_categories_locales" ADD CONSTRAINT "solution_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solution_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solution_categories_texts" ADD CONSTRAINT "solution_categories_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solution_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solution_categories_v_version_challenges_items" ADD CONSTRAINT "_solution_categories_v_version_challenges_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solution_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solution_categories_v_version_challenges_items_locales" ADD CONSTRAINT "_solution_categories_v_version_challenges_items_locales_p_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solution_categories_v_version_challenges_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solution_categories_v_version_showcase_tabs" ADD CONSTRAINT "_solution_categories_v_version_showcase_tabs_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solution_categories_v_version_showcase_tabs" ADD CONSTRAINT "_solution_categories_v_version_showcase_tabs_video_mobile_id_media_id_fk" FOREIGN KEY ("video_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solution_categories_v_version_showcase_tabs" ADD CONSTRAINT "_solution_categories_v_version_showcase_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solution_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solution_categories_v_version_showcase_tabs_locales" ADD CONSTRAINT "_solution_categories_v_version_showcase_tabs_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solution_categories_v_version_showcase_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solution_categories_v" ADD CONSTRAINT "_solution_categories_v_parent_id_solution_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solution_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solution_categories_v" ADD CONSTRAINT "_solution_categories_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solution_categories_v" ADD CONSTRAINT "_solution_categories_v_version_showcase_background_id_media_id_fk" FOREIGN KEY ("version_showcase_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solution_categories_v" ADD CONSTRAINT "_solution_categories_v_version_showcase_background_video_id_media_id_fk" FOREIGN KEY ("version_showcase_background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solution_categories_v" ADD CONSTRAINT "_solution_categories_v_version_showcase_brochure_id_media_id_fk" FOREIGN KEY ("version_showcase_brochure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solution_categories_v" ADD CONSTRAINT "_solution_categories_v_version_cta_background_id_media_id_fk" FOREIGN KEY ("version_cta_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solution_categories_v" ADD CONSTRAINT "_solution_categories_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solution_categories_v_locales" ADD CONSTRAINT "_solution_categories_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solution_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solution_categories_v_texts" ADD CONSTRAINT "_solution_categories_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_solution_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_solution_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."solution_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_image_mobile_id_media_id_fk" FOREIGN KEY ("image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_logs_texts" ADD CONSTRAINT "audit_logs_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_certifications_fk" FOREIGN KEY ("certifications_id") REFERENCES "public"."certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solution_categories_fk" FOREIGN KEY ("solution_categories_id") REFERENCES "public"."solution_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_logs_fk" FOREIGN KEY ("audit_logs_id") REFERENCES "public"."audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials_locales" ADD CONSTRAINT "site_settings_socials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_socials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_solution_links" ADD CONSTRAINT "navigation_solution_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_solution_links_locales" ADD CONSTRAINT "navigation_solution_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_solution_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_cards" ADD CONSTRAINT "navigation_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_cards" ADD CONSTRAINT "navigation_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_cards_locales" ADD CONSTRAINT "navigation_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_links" ADD CONSTRAINT "navigation_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_links_locales" ADD CONSTRAINT "navigation_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation" ADD CONSTRAINT "navigation_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_locales" ADD CONSTRAINT "navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links_locales" ADD CONSTRAINT "footer_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_locales" ADD CONSTRAINT "footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_buttons_order_idx" ON "pages_blocks_hero_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_buttons_parent_id_idx" ON "pages_blocks_hero_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_buttons_locales_locale_parent_id_unique" ON "pages_blocks_hero_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_background_idx" ON "pages_blocks_hero" USING btree ("background_id");
  CREATE INDEX "pages_blocks_hero_background_mobile_idx" ON "pages_blocks_hero" USING btree ("background_mobile_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_locales_locale_parent_id_unique" ON "pages_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_problem_showcase_items_order_idx" ON "pages_blocks_problem_showcase_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_problem_showcase_items_parent_id_idx" ON "pages_blocks_problem_showcase_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_problem_showcase_items_icon_idx" ON "pages_blocks_problem_showcase_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "pages_blocks_problem_showcase_items_locales_locale_parent_id" ON "pages_blocks_problem_showcase_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_problem_showcase_order_idx" ON "pages_blocks_problem_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_problem_showcase_parent_id_idx" ON "pages_blocks_problem_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_problem_showcase_path_idx" ON "pages_blocks_problem_showcase" USING btree ("_path");
  CREATE INDEX "pages_blocks_problem_showcase_background_idx" ON "pages_blocks_problem_showcase" USING btree ("background_id");
  CREATE INDEX "pages_blocks_problem_showcase_image_idx" ON "pages_blocks_problem_showcase" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_problem_showcase_locales_locale_parent_id_uniqu" ON "pages_blocks_problem_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_video_showcase_order_idx" ON "pages_blocks_video_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_showcase_parent_id_idx" ON "pages_blocks_video_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_showcase_path_idx" ON "pages_blocks_video_showcase" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_showcase_background_idx" ON "pages_blocks_video_showcase" USING btree ("background_id");
  CREATE INDEX "pages_blocks_video_showcase_poster_idx" ON "pages_blocks_video_showcase" USING btree ("poster_id");
  CREATE INDEX "pages_blocks_video_showcase_video_idx" ON "pages_blocks_video_showcase" USING btree ("video_id");
  CREATE UNIQUE INDEX "pages_blocks_video_showcase_locales_locale_parent_id_unique" ON "pages_blocks_video_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_solution_highlights_items_order_idx" ON "pages_blocks_solution_highlights_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_solution_highlights_items_parent_id_idx" ON "pages_blocks_solution_highlights_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_solution_highlights_items_image_idx" ON "pages_blocks_solution_highlights_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_solution_highlights_items_locales_locale_parent" ON "pages_blocks_solution_highlights_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_solution_highlights_order_idx" ON "pages_blocks_solution_highlights" USING btree ("_order");
  CREATE INDEX "pages_blocks_solution_highlights_parent_id_idx" ON "pages_blocks_solution_highlights" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_solution_highlights_path_idx" ON "pages_blocks_solution_highlights" USING btree ("_path");
  CREATE INDEX "pages_blocks_solution_highlights_background_idx" ON "pages_blocks_solution_highlights" USING btree ("background_id");
  CREATE INDEX "pages_blocks_solution_highlights_featured_featured_image_idx" ON "pages_blocks_solution_highlights" USING btree ("featured_image_id");
  CREATE UNIQUE INDEX "pages_blocks_solution_highlights_locales_locale_parent_id_un" ON "pages_blocks_solution_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_expertise_stats_order_idx" ON "pages_blocks_expertise_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_expertise_stats_parent_id_idx" ON "pages_blocks_expertise_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_expertise_stats_locales_locale_parent_id_unique" ON "pages_blocks_expertise_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_expertise_cards_order_idx" ON "pages_blocks_expertise_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_expertise_cards_parent_id_idx" ON "pages_blocks_expertise_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_expertise_cards_image_idx" ON "pages_blocks_expertise_cards" USING btree ("image_id");
  CREATE INDEX "pages_blocks_expertise_cards_icon_idx" ON "pages_blocks_expertise_cards" USING btree ("icon_id");
  CREATE UNIQUE INDEX "pages_blocks_expertise_cards_locales_locale_parent_id_unique" ON "pages_blocks_expertise_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_expertise_order_idx" ON "pages_blocks_expertise" USING btree ("_order");
  CREATE INDEX "pages_blocks_expertise_parent_id_idx" ON "pages_blocks_expertise" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_expertise_path_idx" ON "pages_blocks_expertise" USING btree ("_path");
  CREATE INDEX "pages_blocks_expertise_background_idx" ON "pages_blocks_expertise" USING btree ("background_id");
  CREATE UNIQUE INDEX "pages_blocks_expertise_locales_locale_parent_id_unique" ON "pages_blocks_expertise_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_items_order_idx" ON "pages_blocks_feature_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_items_parent_id_idx" ON "pages_blocks_feature_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_items_icon_idx" ON "pages_blocks_feature_grid_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "pages_blocks_feature_grid_items_locales_locale_parent_id_uni" ON "pages_blocks_feature_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_order_idx" ON "pages_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_parent_id_idx" ON "pages_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_path_idx" ON "pages_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_grid_background_idx" ON "pages_blocks_feature_grid" USING btree ("background_id");
  CREATE INDEX "pages_blocks_feature_grid_background_overlay_idx" ON "pages_blocks_feature_grid" USING btree ("background_overlay_id");
  CREATE UNIQUE INDEX "pages_blocks_feature_grid_locales_locale_parent_id_unique" ON "pages_blocks_feature_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_leadership_leaders_order_idx" ON "pages_blocks_leadership_leaders" USING btree ("_order");
  CREATE INDEX "pages_blocks_leadership_leaders_parent_id_idx" ON "pages_blocks_leadership_leaders" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_leadership_leaders_photo_idx" ON "pages_blocks_leadership_leaders" USING btree ("photo_id");
  CREATE UNIQUE INDEX "pages_blocks_leadership_leaders_locales_locale_parent_id_uni" ON "pages_blocks_leadership_leaders_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_leadership_order_idx" ON "pages_blocks_leadership" USING btree ("_order");
  CREATE INDEX "pages_blocks_leadership_parent_id_idx" ON "pages_blocks_leadership" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_leadership_path_idx" ON "pages_blocks_leadership" USING btree ("_path");
  CREATE INDEX "pages_blocks_leadership_background_idx" ON "pages_blocks_leadership" USING btree ("background_id");
  CREATE UNIQUE INDEX "pages_blocks_leadership_locales_locale_parent_id_unique" ON "pages_blocks_leadership_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_team_stats_items_order_idx" ON "pages_blocks_team_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_stats_items_parent_id_idx" ON "pages_blocks_team_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_team_stats_items_locales_locale_parent_id_uniqu" ON "pages_blocks_team_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_team_stats_order_idx" ON "pages_blocks_team_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_stats_parent_id_idx" ON "pages_blocks_team_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_stats_path_idx" ON "pages_blocks_team_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_stats_background_idx" ON "pages_blocks_team_stats" USING btree ("background_id");
  CREATE UNIQUE INDEX "pages_blocks_team_stats_locales_locale_parent_id_unique" ON "pages_blocks_team_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_partners_order_idx" ON "pages_blocks_partners" USING btree ("_order");
  CREATE INDEX "pages_blocks_partners_parent_id_idx" ON "pages_blocks_partners" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_partners_path_idx" ON "pages_blocks_partners" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_partners_locales_locale_parent_id_unique" ON "pages_blocks_partners_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_certifications_order_idx" ON "pages_blocks_certifications" USING btree ("_order");
  CREATE INDEX "pages_blocks_certifications_parent_id_idx" ON "pages_blocks_certifications" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_certifications_path_idx" ON "pages_blocks_certifications" USING btree ("_path");
  CREATE INDEX "pages_blocks_certifications_background_idx" ON "pages_blocks_certifications" USING btree ("background_id");
  CREATE UNIQUE INDEX "pages_blocks_certifications_locales_locale_parent_id_unique" ON "pages_blocks_certifications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_solution_overview_order_idx" ON "pages_blocks_solution_overview" USING btree ("_order");
  CREATE INDEX "pages_blocks_solution_overview_parent_id_idx" ON "pages_blocks_solution_overview" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_solution_overview_path_idx" ON "pages_blocks_solution_overview" USING btree ("_path");
  CREATE INDEX "pages_blocks_solution_overview_background_idx" ON "pages_blocks_solution_overview" USING btree ("background_id");
  CREATE UNIQUE INDEX "pages_blocks_solution_overview_locales_locale_parent_id_uniq" ON "pages_blocks_solution_overview_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_faq_items_locales_locale_parent_id_unique" ON "pages_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_background_idx" ON "pages_blocks_faq" USING btree ("background_id");
  CREATE UNIQUE INDEX "pages_blocks_faq_locales_locale_parent_id_unique" ON "pages_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_workflow_steps_order_idx" ON "pages_blocks_workflow_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_workflow_steps_parent_id_idx" ON "pages_blocks_workflow_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_workflow_steps_locales_locale_parent_id_unique" ON "pages_blocks_workflow_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_workflow_order_idx" ON "pages_blocks_workflow" USING btree ("_order");
  CREATE INDEX "pages_blocks_workflow_parent_id_idx" ON "pages_blocks_workflow" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_workflow_path_idx" ON "pages_blocks_workflow" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_workflow_locales_locale_parent_id_unique" ON "pages_blocks_workflow_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_contact_form_order_idx" ON "pages_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_parent_id_idx" ON "pages_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_path_idx" ON "pages_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_form_background_idx" ON "pages_blocks_contact_form" USING btree ("background_id");
  CREATE UNIQUE INDEX "pages_blocks_contact_form_locales_locale_parent_id_unique" ON "pages_blocks_contact_form_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_office_map_order_idx" ON "pages_blocks_office_map" USING btree ("_order");
  CREATE INDEX "pages_blocks_office_map_parent_id_idx" ON "pages_blocks_office_map" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_office_map_path_idx" ON "pages_blocks_office_map" USING btree ("_path");
  CREATE INDEX "pages_blocks_office_map_background_idx" ON "pages_blocks_office_map" USING btree ("background_id");
  CREATE UNIQUE INDEX "pages_blocks_office_map_locales_locale_parent_id_unique" ON "pages_blocks_office_map_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_buttons_order_idx" ON "pages_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_buttons_parent_id_idx" ON "pages_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_cta_buttons_locales_locale_parent_id_unique" ON "pages_blocks_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_background_idx" ON "pages_blocks_cta" USING btree ("background_id");
  CREATE INDEX "pages_blocks_cta_background_mobile_idx" ON "pages_blocks_cta" USING btree ("background_mobile_id");
  CREATE INDEX "pages_blocks_cta_media_idx" ON "pages_blocks_cta" USING btree ("media_id");
  CREATE INDEX "pages_blocks_cta_video_idx" ON "pages_blocks_cta" USING btree ("video_id");
  CREATE UNIQUE INDEX "pages_blocks_cta_locales_locale_parent_id_unique" ON "pages_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_badge_order_idx" ON "pages_blocks_badge" USING btree ("_order");
  CREATE INDEX "pages_blocks_badge_parent_id_idx" ON "pages_blocks_badge" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_badge_path_idx" ON "pages_blocks_badge" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_badge_locales_locale_parent_id_unique" ON "pages_blocks_badge_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_heading_order_idx" ON "pages_blocks_heading" USING btree ("_order");
  CREATE INDEX "pages_blocks_heading_parent_id_idx" ON "pages_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_heading_path_idx" ON "pages_blocks_heading" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_heading_locales_locale_parent_id_unique" ON "pages_blocks_heading_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_paragraph_order_idx" ON "pages_blocks_paragraph" USING btree ("_order");
  CREATE INDEX "pages_blocks_paragraph_parent_id_idx" ON "pages_blocks_paragraph" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_paragraph_path_idx" ON "pages_blocks_paragraph" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_paragraph_locales_locale_parent_id_unique" ON "pages_blocks_paragraph_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_image_order_idx" ON "pages_blocks_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_parent_id_idx" ON "pages_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_path_idx" ON "pages_blocks_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_image_idx" ON "pages_blocks_image" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_image_locales_locale_parent_id_unique" ON "pages_blocks_image_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_button_order_idx" ON "pages_blocks_button" USING btree ("_order");
  CREATE INDEX "pages_blocks_button_parent_id_idx" ON "pages_blocks_button" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_button_path_idx" ON "pages_blocks_button" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_button_locales_locale_parent_id_unique" ON "pages_blocks_button_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_card_order_idx" ON "pages_blocks_card" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_parent_id_idx" ON "pages_blocks_card" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_path_idx" ON "pages_blocks_card" USING btree ("_path");
  CREATE INDEX "pages_blocks_card_icon_idx" ON "pages_blocks_card" USING btree ("icon_id");
  CREATE UNIQUE INDEX "pages_blocks_card_locales_locale_parent_id_unique" ON "pages_blocks_card_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_spacer_order_idx" ON "pages_blocks_spacer" USING btree ("_order");
  CREATE INDEX "pages_blocks_spacer_parent_id_idx" ON "pages_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spacer_path_idx" ON "pages_blocks_spacer" USING btree ("_path");
  CREATE INDEX "pages_blocks_layout_section_order_idx" ON "pages_blocks_layout_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_layout_section_parent_id_idx" ON "pages_blocks_layout_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_layout_section_path_idx" ON "pages_blocks_layout_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_layout_section_background_image_idx" ON "pages_blocks_layout_section" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_texts_order_parent" ON "pages_texts" USING btree ("order","parent_id");
  CREATE INDEX "pages_texts_locale_parent" ON "pages_texts" USING btree ("locale","parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_partners_id_idx" ON "pages_rels" USING btree ("partners_id");
  CREATE INDEX "pages_rels_certifications_id_idx" ON "pages_rels" USING btree ("certifications_id");
  CREATE INDEX "_pages_v_blocks_hero_buttons_order_idx" ON "_pages_v_blocks_hero_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_buttons_parent_id_idx" ON "_pages_v_blocks_hero_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_hero_buttons_locales_locale_parent_id_unique" ON "_pages_v_blocks_hero_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_background_idx" ON "_pages_v_blocks_hero" USING btree ("background_id");
  CREATE INDEX "_pages_v_blocks_hero_background_mobile_idx" ON "_pages_v_blocks_hero" USING btree ("background_mobile_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_hero_locales_locale_parent_id_unique" ON "_pages_v_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_problem_showcase_items_order_idx" ON "_pages_v_blocks_problem_showcase_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_problem_showcase_items_parent_id_idx" ON "_pages_v_blocks_problem_showcase_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_problem_showcase_items_icon_idx" ON "_pages_v_blocks_problem_showcase_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_problem_showcase_items_locales_locale_parent" ON "_pages_v_blocks_problem_showcase_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_problem_showcase_order_idx" ON "_pages_v_blocks_problem_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_problem_showcase_parent_id_idx" ON "_pages_v_blocks_problem_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_problem_showcase_path_idx" ON "_pages_v_blocks_problem_showcase" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_problem_showcase_background_idx" ON "_pages_v_blocks_problem_showcase" USING btree ("background_id");
  CREATE INDEX "_pages_v_blocks_problem_showcase_image_idx" ON "_pages_v_blocks_problem_showcase" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_problem_showcase_locales_locale_parent_id_un" ON "_pages_v_blocks_problem_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_video_showcase_order_idx" ON "_pages_v_blocks_video_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_showcase_parent_id_idx" ON "_pages_v_blocks_video_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_showcase_path_idx" ON "_pages_v_blocks_video_showcase" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_showcase_background_idx" ON "_pages_v_blocks_video_showcase" USING btree ("background_id");
  CREATE INDEX "_pages_v_blocks_video_showcase_poster_idx" ON "_pages_v_blocks_video_showcase" USING btree ("poster_id");
  CREATE INDEX "_pages_v_blocks_video_showcase_video_idx" ON "_pages_v_blocks_video_showcase" USING btree ("video_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_video_showcase_locales_locale_parent_id_uniq" ON "_pages_v_blocks_video_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_solution_highlights_items_order_idx" ON "_pages_v_blocks_solution_highlights_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_solution_highlights_items_parent_id_idx" ON "_pages_v_blocks_solution_highlights_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_solution_highlights_items_image_idx" ON "_pages_v_blocks_solution_highlights_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_solution_highlights_items_locales_locale_par" ON "_pages_v_blocks_solution_highlights_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_solution_highlights_order_idx" ON "_pages_v_blocks_solution_highlights" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_solution_highlights_parent_id_idx" ON "_pages_v_blocks_solution_highlights" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_solution_highlights_path_idx" ON "_pages_v_blocks_solution_highlights" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_solution_highlights_background_idx" ON "_pages_v_blocks_solution_highlights" USING btree ("background_id");
  CREATE INDEX "_pages_v_blocks_solution_highlights_featured_featured_im_idx" ON "_pages_v_blocks_solution_highlights" USING btree ("featured_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_solution_highlights_locales_locale_parent_id" ON "_pages_v_blocks_solution_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_expertise_stats_order_idx" ON "_pages_v_blocks_expertise_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_expertise_stats_parent_id_idx" ON "_pages_v_blocks_expertise_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_expertise_stats_locales_locale_parent_id_uni" ON "_pages_v_blocks_expertise_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_expertise_cards_order_idx" ON "_pages_v_blocks_expertise_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_expertise_cards_parent_id_idx" ON "_pages_v_blocks_expertise_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_expertise_cards_image_idx" ON "_pages_v_blocks_expertise_cards" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_expertise_cards_icon_idx" ON "_pages_v_blocks_expertise_cards" USING btree ("icon_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_expertise_cards_locales_locale_parent_id_uni" ON "_pages_v_blocks_expertise_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_expertise_order_idx" ON "_pages_v_blocks_expertise" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_expertise_parent_id_idx" ON "_pages_v_blocks_expertise" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_expertise_path_idx" ON "_pages_v_blocks_expertise" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_expertise_background_idx" ON "_pages_v_blocks_expertise" USING btree ("background_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_expertise_locales_locale_parent_id_unique" ON "_pages_v_blocks_expertise_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_items_order_idx" ON "_pages_v_blocks_feature_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_grid_items_parent_id_idx" ON "_pages_v_blocks_feature_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_items_icon_idx" ON "_pages_v_blocks_feature_grid_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_feature_grid_items_locales_locale_parent_id_" ON "_pages_v_blocks_feature_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_order_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_grid_parent_id_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_path_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_grid_background_idx" ON "_pages_v_blocks_feature_grid" USING btree ("background_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_background_overlay_idx" ON "_pages_v_blocks_feature_grid" USING btree ("background_overlay_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_feature_grid_locales_locale_parent_id_unique" ON "_pages_v_blocks_feature_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_leadership_leaders_order_idx" ON "_pages_v_blocks_leadership_leaders" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_leadership_leaders_parent_id_idx" ON "_pages_v_blocks_leadership_leaders" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_leadership_leaders_photo_idx" ON "_pages_v_blocks_leadership_leaders" USING btree ("photo_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_leadership_leaders_locales_locale_parent_id_" ON "_pages_v_blocks_leadership_leaders_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_leadership_order_idx" ON "_pages_v_blocks_leadership" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_leadership_parent_id_idx" ON "_pages_v_blocks_leadership" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_leadership_path_idx" ON "_pages_v_blocks_leadership" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_leadership_background_idx" ON "_pages_v_blocks_leadership" USING btree ("background_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_leadership_locales_locale_parent_id_unique" ON "_pages_v_blocks_leadership_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_team_stats_items_order_idx" ON "_pages_v_blocks_team_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_stats_items_parent_id_idx" ON "_pages_v_blocks_team_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_team_stats_items_locales_locale_parent_id_un" ON "_pages_v_blocks_team_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_team_stats_order_idx" ON "_pages_v_blocks_team_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_stats_parent_id_idx" ON "_pages_v_blocks_team_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_stats_path_idx" ON "_pages_v_blocks_team_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_team_stats_background_idx" ON "_pages_v_blocks_team_stats" USING btree ("background_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_team_stats_locales_locale_parent_id_unique" ON "_pages_v_blocks_team_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_partners_order_idx" ON "_pages_v_blocks_partners" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_partners_parent_id_idx" ON "_pages_v_blocks_partners" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_partners_path_idx" ON "_pages_v_blocks_partners" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_partners_locales_locale_parent_id_unique" ON "_pages_v_blocks_partners_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_certifications_order_idx" ON "_pages_v_blocks_certifications" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_certifications_parent_id_idx" ON "_pages_v_blocks_certifications" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_certifications_path_idx" ON "_pages_v_blocks_certifications" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_certifications_background_idx" ON "_pages_v_blocks_certifications" USING btree ("background_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_certifications_locales_locale_parent_id_uniq" ON "_pages_v_blocks_certifications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_solution_overview_order_idx" ON "_pages_v_blocks_solution_overview" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_solution_overview_parent_id_idx" ON "_pages_v_blocks_solution_overview" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_solution_overview_path_idx" ON "_pages_v_blocks_solution_overview" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_solution_overview_background_idx" ON "_pages_v_blocks_solution_overview" USING btree ("background_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_solution_overview_locales_locale_parent_id_u" ON "_pages_v_blocks_solution_overview_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_background_idx" ON "_pages_v_blocks_faq" USING btree ("background_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_workflow_steps_order_idx" ON "_pages_v_blocks_workflow_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_workflow_steps_parent_id_idx" ON "_pages_v_blocks_workflow_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_workflow_steps_locales_locale_parent_id_uniq" ON "_pages_v_blocks_workflow_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_workflow_order_idx" ON "_pages_v_blocks_workflow" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_workflow_parent_id_idx" ON "_pages_v_blocks_workflow" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_workflow_path_idx" ON "_pages_v_blocks_workflow" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_workflow_locales_locale_parent_id_unique" ON "_pages_v_blocks_workflow_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_order_idx" ON "_pages_v_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_form_parent_id_idx" ON "_pages_v_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_path_idx" ON "_pages_v_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_form_background_idx" ON "_pages_v_blocks_contact_form" USING btree ("background_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_contact_form_locales_locale_parent_id_unique" ON "_pages_v_blocks_contact_form_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_office_map_order_idx" ON "_pages_v_blocks_office_map" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_office_map_parent_id_idx" ON "_pages_v_blocks_office_map" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_office_map_path_idx" ON "_pages_v_blocks_office_map" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_office_map_background_idx" ON "_pages_v_blocks_office_map" USING btree ("background_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_office_map_locales_locale_parent_id_unique" ON "_pages_v_blocks_office_map_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_buttons_order_idx" ON "_pages_v_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_buttons_parent_id_idx" ON "_pages_v_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_buttons_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_background_idx" ON "_pages_v_blocks_cta" USING btree ("background_id");
  CREATE INDEX "_pages_v_blocks_cta_background_mobile_idx" ON "_pages_v_blocks_cta" USING btree ("background_mobile_id");
  CREATE INDEX "_pages_v_blocks_cta_media_idx" ON "_pages_v_blocks_cta" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_cta_video_idx" ON "_pages_v_blocks_cta" USING btree ("video_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_badge_order_idx" ON "_pages_v_blocks_badge" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_badge_parent_id_idx" ON "_pages_v_blocks_badge" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_badge_path_idx" ON "_pages_v_blocks_badge" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_badge_locales_locale_parent_id_unique" ON "_pages_v_blocks_badge_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_heading_order_idx" ON "_pages_v_blocks_heading" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_heading_parent_id_idx" ON "_pages_v_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_heading_path_idx" ON "_pages_v_blocks_heading" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_heading_locales_locale_parent_id_unique" ON "_pages_v_blocks_heading_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_paragraph_order_idx" ON "_pages_v_blocks_paragraph" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_paragraph_parent_id_idx" ON "_pages_v_blocks_paragraph" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_paragraph_path_idx" ON "_pages_v_blocks_paragraph" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_paragraph_locales_locale_parent_id_unique" ON "_pages_v_blocks_paragraph_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_image_order_idx" ON "_pages_v_blocks_image" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_parent_id_idx" ON "_pages_v_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_path_idx" ON "_pages_v_blocks_image" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_image_idx" ON "_pages_v_blocks_image" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_image_locales_locale_parent_id_unique" ON "_pages_v_blocks_image_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_button_order_idx" ON "_pages_v_blocks_button" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_button_parent_id_idx" ON "_pages_v_blocks_button" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_button_path_idx" ON "_pages_v_blocks_button" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_button_locales_locale_parent_id_unique" ON "_pages_v_blocks_button_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_card_order_idx" ON "_pages_v_blocks_card" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_parent_id_idx" ON "_pages_v_blocks_card" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_path_idx" ON "_pages_v_blocks_card" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_card_icon_idx" ON "_pages_v_blocks_card" USING btree ("icon_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_card_locales_locale_parent_id_unique" ON "_pages_v_blocks_card_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_spacer_order_idx" ON "_pages_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_spacer_parent_id_idx" ON "_pages_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_spacer_path_idx" ON "_pages_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_layout_section_order_idx" ON "_pages_v_blocks_layout_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_layout_section_parent_id_idx" ON "_pages_v_blocks_layout_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_layout_section_path_idx" ON "_pages_v_blocks_layout_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_layout_section_background_image_idx" ON "_pages_v_blocks_layout_section" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_texts_order_parent" ON "_pages_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_pages_v_texts_locale_parent" ON "_pages_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_partners_id_idx" ON "_pages_v_rels" USING btree ("partners_id");
  CREATE INDEX "_pages_v_rels_certifications_id_idx" ON "_pages_v_rels" USING btree ("certifications_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners__order_idx" ON "partners" USING btree ("_order");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "certifications__order_idx" ON "certifications" USING btree ("_order");
  CREATE INDEX "certifications_icon_idx" ON "certifications" USING btree ("icon_id");
  CREATE INDEX "certifications_certificate_idx" ON "certifications" USING btree ("certificate_id");
  CREATE INDEX "certifications_updated_at_idx" ON "certifications" USING btree ("updated_at");
  CREATE INDEX "certifications_created_at_idx" ON "certifications" USING btree ("created_at");
  CREATE UNIQUE INDEX "certifications_locales_locale_parent_id_unique" ON "certifications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solution_categories_challenges_items_order_idx" ON "solution_categories_challenges_items" USING btree ("_order");
  CREATE INDEX "solution_categories_challenges_items_parent_id_idx" ON "solution_categories_challenges_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solution_categories_challenges_items_locales_locale_parent_i" ON "solution_categories_challenges_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solution_categories_showcase_tabs_order_idx" ON "solution_categories_showcase_tabs" USING btree ("_order");
  CREATE INDEX "solution_categories_showcase_tabs_parent_id_idx" ON "solution_categories_showcase_tabs" USING btree ("_parent_id");
  CREATE INDEX "solution_categories_showcase_tabs_video_idx" ON "solution_categories_showcase_tabs" USING btree ("video_id");
  CREATE INDEX "solution_categories_showcase_tabs_video_mobile_idx" ON "solution_categories_showcase_tabs" USING btree ("video_mobile_id");
  CREATE UNIQUE INDEX "solution_categories_showcase_tabs_locales_locale_parent_id_u" ON "solution_categories_showcase_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solution_categories__order_idx" ON "solution_categories" USING btree ("_order");
  CREATE UNIQUE INDEX "solution_categories_slug_idx" ON "solution_categories" USING btree ("slug");
  CREATE INDEX "solution_categories_hero_hero_image_idx" ON "solution_categories" USING btree ("hero_image_id");
  CREATE INDEX "solution_categories_showcase_showcase_background_idx" ON "solution_categories" USING btree ("showcase_background_id");
  CREATE INDEX "solution_categories_showcase_showcase_background_video_idx" ON "solution_categories" USING btree ("showcase_background_video_id");
  CREATE INDEX "solution_categories_showcase_showcase_brochure_idx" ON "solution_categories" USING btree ("showcase_brochure_id");
  CREATE INDEX "solution_categories_cta_cta_background_idx" ON "solution_categories" USING btree ("cta_background_id");
  CREATE INDEX "solution_categories_meta_meta_image_idx" ON "solution_categories" USING btree ("meta_image_id");
  CREATE INDEX "solution_categories_updated_at_idx" ON "solution_categories" USING btree ("updated_at");
  CREATE INDEX "solution_categories_created_at_idx" ON "solution_categories" USING btree ("created_at");
  CREATE INDEX "solution_categories__status_idx" ON "solution_categories" USING btree ("_status");
  CREATE UNIQUE INDEX "solution_categories_locales_locale_parent_id_unique" ON "solution_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solution_categories_texts_order_parent" ON "solution_categories_texts" USING btree ("order","parent_id");
  CREATE INDEX "solution_categories_texts_locale_parent" ON "solution_categories_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_solution_categories_v_version_challenges_items_order_idx" ON "_solution_categories_v_version_challenges_items" USING btree ("_order");
  CREATE INDEX "_solution_categories_v_version_challenges_items_parent_id_idx" ON "_solution_categories_v_version_challenges_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solution_categories_v_version_challenges_items_locales_loca" ON "_solution_categories_v_version_challenges_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solution_categories_v_version_showcase_tabs_order_idx" ON "_solution_categories_v_version_showcase_tabs" USING btree ("_order");
  CREATE INDEX "_solution_categories_v_version_showcase_tabs_parent_id_idx" ON "_solution_categories_v_version_showcase_tabs" USING btree ("_parent_id");
  CREATE INDEX "_solution_categories_v_version_showcase_tabs_video_idx" ON "_solution_categories_v_version_showcase_tabs" USING btree ("video_id");
  CREATE INDEX "_solution_categories_v_version_showcase_tabs_video_mobil_idx" ON "_solution_categories_v_version_showcase_tabs" USING btree ("video_mobile_id");
  CREATE UNIQUE INDEX "_solution_categories_v_version_showcase_tabs_locales_locale_" ON "_solution_categories_v_version_showcase_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solution_categories_v_parent_idx" ON "_solution_categories_v" USING btree ("parent_id");
  CREATE INDEX "_solution_categories_v_version_version__order_idx" ON "_solution_categories_v" USING btree ("version__order");
  CREATE INDEX "_solution_categories_v_version_version_slug_idx" ON "_solution_categories_v" USING btree ("version_slug");
  CREATE INDEX "_solution_categories_v_version_hero_version_hero_image_idx" ON "_solution_categories_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_solution_categories_v_version_showcase_version_showcase_idx" ON "_solution_categories_v" USING btree ("version_showcase_background_id");
  CREATE INDEX "_solution_categories_v_version_showcase_version_showca_1_idx" ON "_solution_categories_v" USING btree ("version_showcase_background_video_id");
  CREATE INDEX "_solution_categories_v_version_showcase_version_showca_2_idx" ON "_solution_categories_v" USING btree ("version_showcase_brochure_id");
  CREATE INDEX "_solution_categories_v_version_cta_version_cta_backgroun_idx" ON "_solution_categories_v" USING btree ("version_cta_background_id");
  CREATE INDEX "_solution_categories_v_version_meta_version_meta_image_idx" ON "_solution_categories_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_solution_categories_v_version_version_updated_at_idx" ON "_solution_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_solution_categories_v_version_version_created_at_idx" ON "_solution_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_solution_categories_v_version_version__status_idx" ON "_solution_categories_v" USING btree ("version__status");
  CREATE INDEX "_solution_categories_v_created_at_idx" ON "_solution_categories_v" USING btree ("created_at");
  CREATE INDEX "_solution_categories_v_updated_at_idx" ON "_solution_categories_v" USING btree ("updated_at");
  CREATE INDEX "_solution_categories_v_snapshot_idx" ON "_solution_categories_v" USING btree ("snapshot");
  CREATE INDEX "_solution_categories_v_published_locale_idx" ON "_solution_categories_v" USING btree ("published_locale");
  CREATE INDEX "_solution_categories_v_latest_idx" ON "_solution_categories_v" USING btree ("latest");
  CREATE INDEX "_solution_categories_v_autosave_idx" ON "_solution_categories_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_solution_categories_v_locales_locale_parent_id_unique" ON "_solution_categories_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solution_categories_v_texts_order_parent" ON "_solution_categories_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_solution_categories_v_texts_locale_parent" ON "_solution_categories_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "products__order_idx" ON "products" USING btree ("_order");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");
  CREATE INDEX "products_image_mobile_idx" ON "products" USING btree ("image_mobile_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");
  CREATE INDEX "audit_logs_resource_idx" ON "audit_logs" USING btree ("resource");
  CREATE INDEX "audit_logs_user_idx" ON "audit_logs" USING btree ("user_id");
  CREATE INDEX "audit_logs_updated_at_idx" ON "audit_logs" USING btree ("updated_at");
  CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");
  CREATE INDEX "audit_logs_texts_order_parent" ON "audit_logs_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_certifications_id_idx" ON "payload_locked_documents_rels" USING btree ("certifications_id");
  CREATE INDEX "payload_locked_documents_rels_solution_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("solution_categories_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_audit_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_logs_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_socials_icon_idx" ON "site_settings_socials" USING btree ("icon_id");
  CREATE UNIQUE INDEX "site_settings_socials_locales_locale_parent_id_unique" ON "site_settings_socials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_solution_links_order_idx" ON "navigation_solution_links" USING btree ("_order");
  CREATE INDEX "navigation_solution_links_parent_id_idx" ON "navigation_solution_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_solution_links_locales_locale_parent_id_unique" ON "navigation_solution_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_cards_order_idx" ON "navigation_cards" USING btree ("_order");
  CREATE INDEX "navigation_cards_parent_id_idx" ON "navigation_cards" USING btree ("_parent_id");
  CREATE INDEX "navigation_cards_image_idx" ON "navigation_cards" USING btree ("image_id");
  CREATE UNIQUE INDEX "navigation_cards_locales_locale_parent_id_unique" ON "navigation_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_links_order_idx" ON "navigation_links" USING btree ("_order");
  CREATE INDEX "navigation_links_parent_id_idx" ON "navigation_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_links_locales_locale_parent_id_unique" ON "navigation_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_featured_featured_image_idx" ON "navigation" USING btree ("featured_image_id");
  CREATE UNIQUE INDEX "navigation_locales_locale_parent_id_unique" ON "navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_links_locales_locale_parent_id_unique" ON "footer_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_locales_locale_parent_id_unique" ON "footer_columns_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_buttons" CASCADE;
  DROP TABLE "pages_blocks_hero_buttons_locales" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_hero_locales" CASCADE;
  DROP TABLE "pages_blocks_problem_showcase_items" CASCADE;
  DROP TABLE "pages_blocks_problem_showcase_items_locales" CASCADE;
  DROP TABLE "pages_blocks_problem_showcase" CASCADE;
  DROP TABLE "pages_blocks_problem_showcase_locales" CASCADE;
  DROP TABLE "pages_blocks_video_showcase" CASCADE;
  DROP TABLE "pages_blocks_video_showcase_locales" CASCADE;
  DROP TABLE "pages_blocks_solution_highlights_items" CASCADE;
  DROP TABLE "pages_blocks_solution_highlights_items_locales" CASCADE;
  DROP TABLE "pages_blocks_solution_highlights" CASCADE;
  DROP TABLE "pages_blocks_solution_highlights_locales" CASCADE;
  DROP TABLE "pages_blocks_expertise_stats" CASCADE;
  DROP TABLE "pages_blocks_expertise_stats_locales" CASCADE;
  DROP TABLE "pages_blocks_expertise_cards" CASCADE;
  DROP TABLE "pages_blocks_expertise_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_expertise" CASCADE;
  DROP TABLE "pages_blocks_expertise_locales" CASCADE;
  DROP TABLE "pages_blocks_feature_grid_items" CASCADE;
  DROP TABLE "pages_blocks_feature_grid_items_locales" CASCADE;
  DROP TABLE "pages_blocks_feature_grid" CASCADE;
  DROP TABLE "pages_blocks_feature_grid_locales" CASCADE;
  DROP TABLE "pages_blocks_leadership_leaders" CASCADE;
  DROP TABLE "pages_blocks_leadership_leaders_locales" CASCADE;
  DROP TABLE "pages_blocks_leadership" CASCADE;
  DROP TABLE "pages_blocks_leadership_locales" CASCADE;
  DROP TABLE "pages_blocks_team_stats_items" CASCADE;
  DROP TABLE "pages_blocks_team_stats_items_locales" CASCADE;
  DROP TABLE "pages_blocks_team_stats" CASCADE;
  DROP TABLE "pages_blocks_team_stats_locales" CASCADE;
  DROP TABLE "pages_blocks_partners" CASCADE;
  DROP TABLE "pages_blocks_partners_locales" CASCADE;
  DROP TABLE "pages_blocks_certifications" CASCADE;
  DROP TABLE "pages_blocks_certifications_locales" CASCADE;
  DROP TABLE "pages_blocks_solution_overview" CASCADE;
  DROP TABLE "pages_blocks_solution_overview_locales" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq_items_locales" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_faq_locales" CASCADE;
  DROP TABLE "pages_blocks_workflow_steps" CASCADE;
  DROP TABLE "pages_blocks_workflow_steps_locales" CASCADE;
  DROP TABLE "pages_blocks_workflow" CASCADE;
  DROP TABLE "pages_blocks_workflow_locales" CASCADE;
  DROP TABLE "pages_blocks_contact_form" CASCADE;
  DROP TABLE "pages_blocks_contact_form_locales" CASCADE;
  DROP TABLE "pages_blocks_office_map" CASCADE;
  DROP TABLE "pages_blocks_office_map_locales" CASCADE;
  DROP TABLE "pages_blocks_cta_buttons" CASCADE;
  DROP TABLE "pages_blocks_cta_buttons_locales" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_cta_locales" CASCADE;
  DROP TABLE "pages_blocks_badge" CASCADE;
  DROP TABLE "pages_blocks_badge_locales" CASCADE;
  DROP TABLE "pages_blocks_heading" CASCADE;
  DROP TABLE "pages_blocks_heading_locales" CASCADE;
  DROP TABLE "pages_blocks_paragraph" CASCADE;
  DROP TABLE "pages_blocks_paragraph_locales" CASCADE;
  DROP TABLE "pages_blocks_image" CASCADE;
  DROP TABLE "pages_blocks_image_locales" CASCADE;
  DROP TABLE "pages_blocks_button" CASCADE;
  DROP TABLE "pages_blocks_button_locales" CASCADE;
  DROP TABLE "pages_blocks_card" CASCADE;
  DROP TABLE "pages_blocks_card_locales" CASCADE;
  DROP TABLE "pages_blocks_spacer" CASCADE;
  DROP TABLE "pages_blocks_layout_section" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_texts" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_buttons_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_problem_showcase_items" CASCADE;
  DROP TABLE "_pages_v_blocks_problem_showcase_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_problem_showcase" CASCADE;
  DROP TABLE "_pages_v_blocks_problem_showcase_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_video_showcase" CASCADE;
  DROP TABLE "_pages_v_blocks_video_showcase_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_solution_highlights_items" CASCADE;
  DROP TABLE "_pages_v_blocks_solution_highlights_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_solution_highlights" CASCADE;
  DROP TABLE "_pages_v_blocks_solution_highlights_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_expertise_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_expertise_stats_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_expertise_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_expertise_cards_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_expertise" CASCADE;
  DROP TABLE "_pages_v_blocks_expertise_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid_items" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_leadership_leaders" CASCADE;
  DROP TABLE "_pages_v_blocks_leadership_leaders_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_leadership" CASCADE;
  DROP TABLE "_pages_v_blocks_leadership_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_team_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_team_stats_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_team_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_team_stats_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_partners" CASCADE;
  DROP TABLE "_pages_v_blocks_partners_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_certifications" CASCADE;
  DROP TABLE "_pages_v_blocks_certifications_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_solution_overview" CASCADE;
  DROP TABLE "_pages_v_blocks_solution_overview_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_workflow_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_workflow_steps_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_workflow" CASCADE;
  DROP TABLE "_pages_v_blocks_workflow_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_office_map" CASCADE;
  DROP TABLE "_pages_v_blocks_office_map_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_buttons_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_badge" CASCADE;
  DROP TABLE "_pages_v_blocks_badge_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_heading" CASCADE;
  DROP TABLE "_pages_v_blocks_heading_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_paragraph" CASCADE;
  DROP TABLE "_pages_v_blocks_paragraph_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_image" CASCADE;
  DROP TABLE "_pages_v_blocks_image_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_button" CASCADE;
  DROP TABLE "_pages_v_blocks_button_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_card" CASCADE;
  DROP TABLE "_pages_v_blocks_card_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_spacer" CASCADE;
  DROP TABLE "_pages_v_blocks_layout_section" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_texts" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "certifications" CASCADE;
  DROP TABLE "certifications_locales" CASCADE;
  DROP TABLE "solution_categories_challenges_items" CASCADE;
  DROP TABLE "solution_categories_challenges_items_locales" CASCADE;
  DROP TABLE "solution_categories_showcase_tabs" CASCADE;
  DROP TABLE "solution_categories_showcase_tabs_locales" CASCADE;
  DROP TABLE "solution_categories" CASCADE;
  DROP TABLE "solution_categories_locales" CASCADE;
  DROP TABLE "solution_categories_texts" CASCADE;
  DROP TABLE "_solution_categories_v_version_challenges_items" CASCADE;
  DROP TABLE "_solution_categories_v_version_challenges_items_locales" CASCADE;
  DROP TABLE "_solution_categories_v_version_showcase_tabs" CASCADE;
  DROP TABLE "_solution_categories_v_version_showcase_tabs_locales" CASCADE;
  DROP TABLE "_solution_categories_v" CASCADE;
  DROP TABLE "_solution_categories_v_locales" CASCADE;
  DROP TABLE "_solution_categories_v_texts" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "audit_logs" CASCADE;
  DROP TABLE "audit_logs_texts" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings_socials_locales" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "navigation_solution_links" CASCADE;
  DROP TABLE "navigation_solution_links_locales" CASCADE;
  DROP TABLE "navigation_cards" CASCADE;
  DROP TABLE "navigation_cards_locales" CASCADE;
  DROP TABLE "navigation_links" CASCADE;
  DROP TABLE "navigation_links_locales" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "navigation_locales" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns_links_locales" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_columns_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pages_blocks_hero_buttons_style";
  DROP TYPE "public"."enum_pages_blocks_hero_variant";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_variant";
  DROP TYPE "public"."enum_pages_blocks_certifications_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_buttons_style";
  DROP TYPE "public"."enum_pages_blocks_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_badge_align";
  DROP TYPE "public"."enum_pages_blocks_heading_level";
  DROP TYPE "public"."enum_pages_blocks_heading_size";
  DROP TYPE "public"."enum_pages_blocks_heading_color";
  DROP TYPE "public"."enum_pages_blocks_heading_align";
  DROP TYPE "public"."enum_pages_blocks_paragraph_size";
  DROP TYPE "public"."enum_pages_blocks_paragraph_tone";
  DROP TYPE "public"."enum_pages_blocks_paragraph_align";
  DROP TYPE "public"."enum_pages_blocks_image_aspect";
  DROP TYPE "public"."enum_pages_blocks_button_style";
  DROP TYPE "public"."enum_pages_blocks_button_align";
  DROP TYPE "public"."enum_pages_blocks_spacer_size";
  DROP TYPE "public"."enum_pages_blocks_layout_section_columns";
  DROP TYPE "public"."enum_pages_blocks_layout_section_vertical_align";
  DROP TYPE "public"."enum_pages_blocks_layout_section_gap";
  DROP TYPE "public"."enum_pages_blocks_layout_section_background";
  DROP TYPE "public"."enum_pages_blocks_layout_section_padding";
  DROP TYPE "public"."enum_pages_blocks_layout_section_width";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_buttons_style";
  DROP TYPE "public"."enum__pages_v_blocks_hero_variant";
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_variant";
  DROP TYPE "public"."enum__pages_v_blocks_certifications_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_buttons_style";
  DROP TYPE "public"."enum__pages_v_blocks_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_badge_align";
  DROP TYPE "public"."enum__pages_v_blocks_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_heading_size";
  DROP TYPE "public"."enum__pages_v_blocks_heading_color";
  DROP TYPE "public"."enum__pages_v_blocks_heading_align";
  DROP TYPE "public"."enum__pages_v_blocks_paragraph_size";
  DROP TYPE "public"."enum__pages_v_blocks_paragraph_tone";
  DROP TYPE "public"."enum__pages_v_blocks_paragraph_align";
  DROP TYPE "public"."enum__pages_v_blocks_image_aspect";
  DROP TYPE "public"."enum__pages_v_blocks_button_style";
  DROP TYPE "public"."enum__pages_v_blocks_button_align";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_size";
  DROP TYPE "public"."enum__pages_v_blocks_layout_section_columns";
  DROP TYPE "public"."enum__pages_v_blocks_layout_section_vertical_align";
  DROP TYPE "public"."enum__pages_v_blocks_layout_section_gap";
  DROP TYPE "public"."enum__pages_v_blocks_layout_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_layout_section_padding";
  DROP TYPE "public"."enum__pages_v_blocks_layout_section_width";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_certifications_icon_shape";
  DROP TYPE "public"."enum_certifications_certificate_focus";
  DROP TYPE "public"."enum_solution_categories_challenges_items_icon";
  DROP TYPE "public"."enum_solution_categories_status";
  DROP TYPE "public"."enum__solution_categories_v_version_challenges_items_icon";
  DROP TYPE "public"."enum__solution_categories_v_version_status";
  DROP TYPE "public"."enum__solution_categories_v_published_locale";
  DROP TYPE "public"."enum_contact_submissions_status";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_audit_logs_action";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_site_settings_socials_platform";`)
}
