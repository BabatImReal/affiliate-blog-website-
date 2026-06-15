import Image from 'next/image'
import { notFound } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { VerdictCallout } from '@/components/blog/verdict-callout'
import { ProsConsBlock } from '@/components/blog/pros-cons-block'
import { AffiliateButton } from '@/components/blog/affiliate-button'
import { MobileBuyBar } from '@/components/blog/mobile-buy-bar'
import { getPostBySlug, type MockAffiliateLink } from '@/lib/mock-data'

const AFFILIATE_LINKS: MockAffiliateLink[] = [
  {
    id: 'link-1',
    platform: 'tiktok_shop',
    label: 'Mua trên TikTok Shop',
    displayUrl: 'tiktok.com/shop',
  },
  {
    id: 'link-2',
    platform: 'shopee',
    label: 'Mua trên Shopee',
    displayUrl: 'shopee.vn',
  },
]

const PROS = [
  'Chip A17 Pro hiệu năng đỉnh cao, chơi game AAA mượt mà',
  'Camera 48MP với zoom quang học 5x cho ảnh sắc nét',
  'Khung titan nhẹ và bền hơn thép không gỉ',
  'Cổng USB-C tiện lợi, tốc độ truyền dữ liệu nhanh',
]

const CONS = [
  'Giá bán cao so với mặt bằng chung',
  'Sạc vẫn giới hạn ở mức ~27W',
  'Không kèm củ sạc trong hộp',
]

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  return <ReviewContent post={post} />
}

function ReviewContent({
  post,
}: {
  post: NonNullable<ReturnType<typeof getPostBySlug>>
}) {
  const t = useTranslations('Blog')
  const tNav = useTranslations('Nav')

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-editorial-muted">
        <Link href="/" className="hover:text-brand">
          {tNav('home')}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/blog" className="hover:text-brand">
          {post.category}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-editorial-secondary">{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        {/* Article */}
        <article>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded bg-brand-light px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
              {post.category}
            </span>
            {post.verdict === 'best' && (
              <span className="rounded bg-brand px-2.5 py-1 text-xs font-semibold text-white">
                {t('ourPick')}
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl font-bold leading-tight text-editorial-ink sm:text-4xl md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 text-sm text-editorial-muted">
            {t('author')} · 15 tháng 6, 2024 · 8 {t('readTime')}
          </p>

          <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-lg bg-surface-muted">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
          </div>

          <p className="mt-3 text-xs italic text-editorial-muted">
            {t('affiliateDisclaimer')}
          </p>

          {/* Verdict callout — sentinel for MobileBuyBar visibility */}
          <div id="verdict-sentinel" className="mt-8">
            <VerdictCallout
              verdict={post.verdict}
              productName={post.title}
              why="Sau hơn hai tuần sử dụng thực tế, đây là sản phẩm chúng tôi tự tin giới thiệu cho phần lớn người dùng nhờ sự cân bằng giữa hiệu năng, chất lượng và trải nghiệm."
              affiliateLinks={AFFILIATE_LINKS}
              score={post.score}
              rating={post.rating}
            />
          </div>

          {/* Pros / Cons */}
          <div className="mt-8">
            <ProsConsBlock pros={PROS} cons={CONS} />
          </div>

          {/* Rich content */}
          <div className="mt-10 space-y-8">
            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-editorial-ink">
                Thiết kế
              </h2>
              <p className="text-base leading-relaxed text-editorial-secondary">
                Khung titan nguyên khối mang lại cảm giác cao cấp và chắc chắn,
                trong khi trọng lượng được giảm đáng kể so với thế hệ trước. Các
                cạnh được bo cong tinh tế giúp cầm nắm thoải mái ngay cả khi sử
                dụng kéo dài. Mặt lưng kính mờ chống bám vân tay tốt và hạn chế
                trầy xước trong quá trình sử dụng hằng ngày.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-editorial-ink">
                Hiệu năng
              </h2>
              <p className="text-base leading-relaxed text-editorial-secondary">
                Con chip mới nhất xử lý mọi tác vụ một cách nhẹ nhàng, từ chỉnh
                sửa video 4K đến chơi các tựa game đồ họa nặng ở thiết lập cao
                nhất. Khả năng tản nhiệt được cải thiện giúp thiết bị duy trì
                hiệu năng ổn định trong thời gian dài mà không bị bóp xung đáng
                kể. Đây thực sự là một trong những thiết bị mạnh nhất bạn có thể
                mua ở thời điểm hiện tại.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-editorial-ink">
                Camera
              </h2>
              <p className="text-base leading-relaxed text-editorial-secondary">
                Hệ thống camera cho ra những bức ảnh giàu chi tiết với dải tương
                phản rộng và màu sắc trung thực. Chế độ chụp đêm xử lý nhiễu tốt,
                còn khả năng zoom quang học mở rộng đáng kể phạm vi sáng tạo.
                Quay video vẫn là điểm mạnh với độ ổn định cao và âm thanh thu
                rõ ràng.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-editorial-ink">
                Kết luận
              </h2>
              <p className="text-base leading-relaxed text-editorial-secondary">
                Nếu bạn đang tìm một sản phẩm cao cấp không thỏa hiệp về hiệu
                năng và chất lượng hoàn thiện, đây là lựa chọn rất đáng cân nhắc.
                Mức giá cao là rào cản duy nhất, nhưng với những gì nhận lại,
                chúng tôi cho rằng đó là một khoản đầu tư xứng đáng.
              </p>
            </section>
          </div>
        </article>

        {/* Sticky sidebar (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-lg border border-editorial-border bg-surface p-6 shadow-sm">
            <span className="mb-3 inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand">
              {t('ourPick')}
            </span>
            <h3 className="mb-4 font-serif text-lg font-bold leading-snug text-editorial-ink">
              {post.title}
            </h3>
            <div className="space-y-3">
              {AFFILIATE_LINKS.map((link) => (
                <AffiliateButton
                  key={link.id}
                  linkId={link.id}
                  platform={link.platform}
                  label={link.label}
                  displayUrl={link.displayUrl}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Fixed mobile buy bar — appears after scrolling past verdict */}
      <MobileBuyBar
        productName={post.title}
        affiliateLinks={AFFILIATE_LINKS}
        sentinelId="verdict-sentinel"
      />
    </main>
  )
}
