import { pgTable, uuid, text, timestamp, primaryKey } from 'drizzle-orm/pg-core'

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  titleVi: text('title_vi').notNull(),
  titleEn: text('title_en'),
  contentVi: text('content_vi').notNull(),
  contentEn: text('content_en'),
  excerptVi: text('excerpt_vi'),
  excerptEn: text('excerpt_en'),
  coverImage: text('cover_image'),
  status: text('status').notNull().default('draft'), // 'draft' | 'published'
  authorId: uuid('author_id'), // references auth.users(id) — managed by Supabase
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  nameVi: text('name_vi').notNull(),
  nameEn: text('name_en'),
})

export const postCategories = pgTable(
  'post_categories',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.postId, t.categoryId] }),
  }),
)

export const affiliateLinks = pgTable('affiliate_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(), // tiktok_shop | shopee | lazada | amazon | other
  labelVi: text('label_vi').notNull(),
  labelEn: text('label_en'),
  url: text('url').notNull(), // destination — never exposed to client
  displayUrl: text('display_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const linkClicks = pgTable('link_clicks', {
  id: uuid('id').primaryKey().defaultRandom(),
  affiliateLinkId: uuid('affiliate_link_id')
    .notNull()
    .references(() => affiliateLinks.id, { onDelete: 'cascade' }),
  clickedAt: timestamp('clicked_at', { withTimezone: true }).defaultNow(),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  ipHash: text('ip_hash'), // SHA-256 of IP, never raw IP
})

export const postViews = pgTable('post_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  viewedAt: timestamp('viewed_at', { withTimezone: true }).defaultNow(),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
})

export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  cloudinaryPublicId: text('cloudinary_public_id').notNull(),
  url: text('url').notNull(),
  resourceType: text('resource_type').notNull(), // 'image' | 'video'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
