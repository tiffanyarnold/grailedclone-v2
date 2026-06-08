"use client";

import Link from "next/link";
import { Instagram, Facebook, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#D4D4D4] mt-16">
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <FooterLink href="#">ABOUT</FooterLink>
            <FooterLink href="#">YOUR PRIVACY CHOICES</FooterLink>
            <FooterLink href="#">HELP & FAQ</FooterLink>
            <FooterLink href="#">TERMS</FooterLink>
            <FooterLink href="#">PRIVACY</FooterLink>
            <FooterLink href="#">TRUST</FooterLink>
            <FooterLink href="#">ACCESSIBILITY</FooterLink>
            <FooterLink href="#">CONTACT</FooterLink>
            <FooterLink href="#">JOBS</FooterLink>
            <FooterLink href="#">IOS APP</FooterLink>
          </div>
          <div className="flex items-center gap-4">
            <Instagram className="w-4 h-4 text-[#1A1A1A] cursor-pointer hover:opacity-70" />
            <Facebook className="w-4 h-4 text-[#1A1A1A] cursor-pointer hover:opacity-70" />
            <Youtube className="w-4 h-4 text-[#1A1A1A] cursor-pointer hover:opacity-70" />
            <Linkedin className="w-4 h-4 text-[#1A1A1A] cursor-pointer hover:opacity-70" />
            <span className="text-xs text-[#1A1A1A] ml-2">Grailed © 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-[11px] font-semibold tracking-[0.05em] text-[#1A1A1A] hover:opacity-70 transition-opacity"
    >
      {children}
    </Link>
  );
}
