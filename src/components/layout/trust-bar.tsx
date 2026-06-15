const STATS = [
  { value: '2,400+', label: 'đánh giá thực tế' },
  { value: '100%', label: 'độc lập, không quảng cáo' },
  { value: '62+', label: 'sản phẩm đã thử nghiệm' },
  { value: 'Hàng tuần', label: 'cập nhật nội dung mới' },
]

export function TrustBar() {
  return (
    <section
      aria-label="Thông tin về ReviewHub"
      className="border-y border-editorial-border bg-surface-muted"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-editorial-border px-4 sm:grid-cols-4 sm:px-6">
        {STATS.map(({ value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-0.5 px-4 py-5 text-center"
          >
            <span className="font-serif text-2xl font-bold text-editorial-ink sm:text-3xl">
              {value}
            </span>
            <span className="text-xs font-medium leading-tight text-editorial-secondary sm:text-sm">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
