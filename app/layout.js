
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { CartProvider } from '@/app/context/CartContext';
import LayoutWrapper from '@/components/LayoutWrapper';
import AuthWrapper from '@/components/AuthWrapper'; 

export const metadata = {
  title: 'EStore',
  description: 'Awesome shopping experience',
};

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="text/javascript"
          src="https://upload.widget.cloudinary.com/global/all.js"
          async
        ></script>
      </head>
      <body>
        <ClerkProvider frontendApi={clerkFrontendApi}>
          <CartProvider>
            <LayoutWrapper>
              <AuthWrapper>{children}</AuthWrapper>
            </LayoutWrapper>
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
