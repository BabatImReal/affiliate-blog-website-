'use client'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'

export function LocaleSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="flex items-center gap-0.5 text-sm" role="group" aria-label="Chọn ngôn ngữ">
      {routing.locales.map((l, index) => (
        <span key={l} className="flex items-center gap-0.5">
          {index > 0 && (
            <span className="select-none text-editorial-muted" aria-hidden="true">
              |
            </span>
          )}
          <button
            type="button"
            aria-label={`Chuyển sang ${l === 'vi' ? 'Tiếng Việt' : 'English'}`}
            aria-pressed={l === locale}
            onClick={() => router.replace(pathname, { locale: l })}
            className={cn(
              'min-h-[36px] min-w-[36px] cursor-pointer rounded px-2 transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
              l === locale
                ? 'font-bold text-editorial-ink underline decoration-brand decoration-2 underline-offset-4'
                : 'text-editorial-secondary hover:text-editorial-ink'
            )}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  )
}
