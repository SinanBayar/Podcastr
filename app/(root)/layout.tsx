export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <main>
        <p className="text-white-1">LEFT SIDE BAR</p>
        {children}
        <p className="text-white-1">RIGHT SIDE BAR</p>
      </main>
    </div>
  );
}
