import { Github, Twitter, Instagram } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                PH
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                PriceHunter
              </span>
            </Link>
            <p className="text-gray-600 text-sm">
              Find the best deals across multiple e-commerce platforms with
              PriceHunter's smart price comparison.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Github size={20} />
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              © {new Date().getFullYear()} PriceHunter. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
