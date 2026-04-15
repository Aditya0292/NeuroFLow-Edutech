import "./globals.css"

export const metadata = {
  title: "vibeathon-teamalpha",
  description: "Backend and logic only scaffold"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

