import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Notes',
    description: 'Тестовое задание в Ивашин',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en' className='dark text-foreground bg-background'>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
