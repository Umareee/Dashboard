import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ProductProvider } from '@/context/ProductContext';
import { CustomerProvider } from '@/context/CustomerContext';
import { ToastProvider } from '@/context/ToastContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <ToastProvider>
            <ProductProvider>
              <CustomerProvider>
                <SidebarProvider>{children}</SidebarProvider>
              </CustomerProvider>
            </ProductProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
