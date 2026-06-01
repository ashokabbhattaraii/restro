import Link from "next/link";
import { Camera, MessageCircle, ThumbsUp } from "lucide-react";
import { navLinks, restaurant } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="site-footer motif">
      <div className="container footer-grid">
        <div>
          <Link className="footer-logo flex items-center gap-3 mb-4" href="/">
            <img src="/logo.png" alt={`${restaurant.name} Logo`} className="h-12 w-auto rounded-full object-contain filter drop-shadow-[0_0_8px_rgba(230,195,98,0.25)]" />
            <span className="font-display tracking-tight text-xl">{restaurant.name}</span>
          </Link>
          <p>
            Himalayan hospitality, refined interiors, and a menu shaped by Nepal,
            India, and China.
          </p>
          <div className="social-row">
            <a href="https://www.instagram.com/" aria-label="Instagram" rel="noopener noreferrer" target="_blank">
              <Camera size={18} />
            </a>
            <a href="https://www.facebook.com/" aria-label="Facebook" rel="noopener noreferrer" target="_blank">
              <ThumbsUp size={18} />
            </a>
            <a href={`https://wa.me/964${restaurant.phoneOne.slice(1)}`} aria-label="WhatsApp" rel="noopener noreferrer" target="_blank">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Opening Hours</h3>
          <p>{restaurant.hours}</p>
          <p>Weekend reservations recommended.</p>
        </div>
        <div>
          <h3>Contact Info</h3>
          <p>{restaurant.location}</p>
          <p>
            {restaurant.phoneOne} / {restaurant.phoneTwo}
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        © 2026 {restaurant.name} · All Rights Reserved
      </div>
    </footer>
  );
}
