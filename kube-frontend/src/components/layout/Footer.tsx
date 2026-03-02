import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-kube-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="text-xl font-bold mb-3">KUBE</div>
          <p className="text-gray-400 text-sm">
            Buy verified used goods with confidence. Every item tested before delivery.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3 text-sm">Shop</div>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/products" className="hover:text-white">All Products</Link></li>
            <li><Link href="/products?category=phones" className="hover:text-white">Phones</Link></li>
            <li><Link href="/products?category=laptops" className="hover:text-white">Laptops</Link></li>
            <li><Link href="/products?category=appliances" className="hover:text-white">Appliances</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3 text-sm">Sell on Kube</div>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/auth/seller-apply" className="hover:text-white">Apply to Sell</Link></li>
            <li><Link href="/seller" className="hover:text-white">Seller Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3 text-sm">Support</div>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="mailto:support@kube.ng" className="hover:text-white">Contact Us</a></li>
            <li><Link href="#" className="hover:text-white">Return Policy</Link></li>
            <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center text-gray-500 text-xs py-4">
        &copy; {new Date().getFullYear()} Kube. All rights reserved.
      </div>
    </footer>
  )
}
