export const metadata = {
  title: 'Medical MIS',
  description: 'Medical Information System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
