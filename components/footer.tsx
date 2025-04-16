import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-6 md:py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-lg md:text-xl font-bold">HXD</div>
          <div className="flex gap-4">
            <Link href="https://web.facebook.com/vaillantrukabura54" className="hover:text-primary">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="https://www.x.com/haxdev54" className="hover:text-primary">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="https://www.instagram.com/vaillant_rukabura54/" className="hover:text-primary">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
          <div className="text-xs md:text-sm text-muted-foreground text-center md:text-right">
            &copy; {new Date().getFullYear()} Movie Mood. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
