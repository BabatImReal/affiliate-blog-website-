import { CheckCircle2, XCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ProsConsBlockProps {
  pros: string[]
  cons: string[]
}

export function ProsConsBlock({ pros, cons }: ProsConsBlockProps) {
  const t = useTranslations('Blog')

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-editorial-border bg-editorial-border sm:grid-cols-2">
      {/* Pros */}
      <div className="bg-green-50/60 p-6">
        <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-editorial-ink">
          <CheckCircle2 className="h-5 w-5 text-green-600" aria-hidden="true" />
          {t('pros')}
        </h3>
        <ul className="space-y-3" aria-label={t('pros')}>
          {pros.map((pro, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-editorial-secondary"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div className="bg-red-50/40 p-6">
        <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-editorial-ink">
          <XCircle className="h-5 w-5 text-brand" aria-hidden="true" />
          {t('cons')}
        </h3>
        <ul className="space-y-3" aria-label={t('cons')}>
          {cons.map((con, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-editorial-secondary"
            >
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
