// Root passthrough layout. The real <html>/<body> shell lives in
// src/app/[locale]/layout.tsx so next-intl can set lang per locale.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
