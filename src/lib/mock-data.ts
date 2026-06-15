export type Verdict = 'best' | 'great' | 'budget'

export interface MockPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  verdict: Verdict
  coverImage: string
  score: number      // 0–10, one decimal
  rating: number     // 0–5, half-step (e.g. 4.5)
}

export interface MockAffiliateLink {
  id: string
  platform: string
  label: string
  displayUrl?: string
}

export const MOCK_POSTS: MockPost[] = [
  {
    id: '1',
    slug: 'iphone-15-pro-max',
    title: 'iPhone 15 Pro Max: Đáng mua nhất 2024?',
    excerpt:
      'Chip A17 Pro mạnh mẽ, camera 48MP xuất sắc, nhưng giá cao có xứng đáng không?',
    category: 'Công nghệ',
    verdict: 'best',
    score: 9.2,
    rating: 4.5,
    coverImage:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
  },
  {
    id: '2',
    slug: 'dyson-v15-detect',
    title: 'Dyson V15 Detect: Máy hút bụi không dây tốt nhất',
    excerpt:
      'Công nghệ laser phát hiện bụi, lực hút 230AW, pin 60 phút. Đáng đồng tiền bát gạo.',
    category: 'Gia dụng',
    verdict: 'best',
    score: 9.0,
    rating: 4.5,
    coverImage:
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80',
  },
  {
    id: '3',
    slug: 'sony-wh1000xm5',
    title: 'Sony WH-1000XM5: Vẫn là vua chống ồn',
    excerpt:
      'Chống ồn ANC tốt nhất thị trường, âm thanh Hi-Res, pin 30 giờ. Lựa chọn số 1 cho dân văn phòng.',
    category: 'Âm thanh',
    verdict: 'great',
    score: 8.7,
    rating: 4.0,
    coverImage:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
  },
  {
    id: '4',
    slug: 'samsung-galaxy-s24',
    title: 'Samsung Galaxy S24: Đối thủ xứng tầm iPhone',
    excerpt:
      'Galaxy AI, màn hình 120Hz AMOLED, camera zoom 50x. Android tốt nhất đầu 2024.',
    category: 'Công nghệ',
    verdict: 'great',
    score: 8.5,
    rating: 4.0,
    coverImage:
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
  },
  {
    id: '5',
    slug: 'xiaomi-robot-vacuum',
    title: 'Xiaomi Robot Vacuum S20: Dọn nhà tự động giá tốt',
    excerpt:
      'LDS Lidar, lực hút 4000Pa, tự làm sạch dock. Tiết kiệm chi phí mà vẫn hiệu quả.',
    category: 'Gia dụng',
    verdict: 'budget',
    score: 7.8,
    rating: 3.5,
    coverImage:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
  {
    id: '6',
    slug: 'airpods-pro-2',
    title: 'AirPods Pro 2: Tốt nhất cho hệ sinh thái Apple',
    excerpt:
      'ANC cải tiến, Lossless Audio qua Lightning, case MagSafe. Nếu bạn dùng iPhone, đây là lựa chọn hiển nhiên.',
    category: 'Âm thanh',
    verdict: 'best',
    score: 9.1,
    rating: 4.5,
    coverImage:
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80',
  },
]

export function getPostBySlug(slug: string): MockPost | undefined {
  return MOCK_POSTS.find((post) => post.slug === slug)
}

export const VERDICT_LABELS: Record<Verdict, string> = {
  best: 'Lựa chọn tốt nhất',
  great: 'Cũng rất tốt',
  budget: 'Giá hợp lý',
}

export const CATEGORIES: string[] = [
  'Công nghệ',
  'Gia dụng',
  'Âm thanh',
  'Làm đẹp',
]

export const CATEGORY_META: Record<string, { icon: string; count: number }> = {
  'Công nghệ': { icon: '📱', count: 24 },
  'Gia dụng': { icon: '🏠', count: 18 },
  'Âm thanh': { icon: '🎧', count: 11 },
  'Làm đẹp': { icon: '💄', count: 9 },
}
