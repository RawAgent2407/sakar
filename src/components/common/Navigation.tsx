'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import { navigationData } from '@/data/navigation';
import { useRouter } from 'next/navigation';

/**
 * A responsive navigation bar component that includes a logo, navigation links, and search functionality.
 * Features a transparent background that becomes opaque when the user scrolls down the page.
 * 
 * @component
 * @returns {JSX.Element} The rendered NavigationBar component
 * 
 * @example
 * ```tsx
 * <NavigationBar />
 * ```
 * 
 * @description
 * This component provides:
 * - Responsive navigation that works on mobile and desktop
 * - Transparent background that becomes opaque on scroll
 * - Logo display
 * - Navigation links
 * - Search functionality
 * - Mobile menu toggle (hamburger menu on small screens)
 */
const NavigationBar = () => {
  const { logo, search } = navigationData;
  const [categories, setCategories] = useState<{ name: string }[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [propertiesMenuOpen, setPropertiesMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProperties(data.properties);
      });
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFiltered([]);
      setShowDropdown(false);
      return;
    }
    const f = properties.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tagline && p.tagline.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFiltered(f);
    setShowDropdown(f.length > 0);
  }, [searchTerm, properties]);

  useEffect(() => {
    fetch('/api/property-categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.categories);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeOpaque = window.scrollY > 10;
      if (shouldBeOpaque !== isScrolled) {
        setIsScrolled(shouldBeOpaque);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'auto';
    };
  }, [isScrolled, isMenuOpen]);

  /**
   * Determines the background class based on scroll position
   * @type {string}
   */
  const navBackgroundClass = isScrolled 
    ? 'bg-black/30 backdrop-blur-xl border border-white/20 shadow-2xl'
    : 'bg-transparent';

  const mobileMenuBackgroundClass = isMenuOpen ? 'bg-black shadow-lg' : navBackgroundClass;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isMenuOpen ? mobileMenuBackgroundClass : navBackgroundClass}`}>
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 w-full max-w-screen-xl mx-auto">
        {/* Left Section - Logo */}
        <Link href="/" className="w-[142.86px] h-[48px] relative block">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="object-contain"
            priority
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            <li className="relative">
              <div
                onMouseEnter={() => setPropertiesMenuOpen(true)}
                onMouseLeave={() => setPropertiesMenuOpen(false)}
                className="inline-block relative"
              >
                <button
                  className="text-white text-base font-medium leading-6 hover:opacity-80 transition-opacity whitespace-nowrap focus:outline-none"
                  onClick={e => e.preventDefault()}
                >
                  Properties
                </button>
                {/* Mega Menu */}
                {propertiesMenuOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-[340px] sm:w-[480px] bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 p-6 flex flex-col gap-2" style={{minWidth: 240}}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {categories.map(cat => (
                        <Link
                          key={cat.name}
                          href={`/category/${encodeURIComponent(cat.name)}`}
                          className="text-white text-base font-medium py-2 px-3 rounded-lg hover:bg-white/10 transition-colors"
                          onClick={() => setPropertiesMenuOpen(false)}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </li>
            <li>
              <Link href="/articles" className="text-white text-base font-medium leading-6 hover:opacity-80 transition-opacity whitespace-nowrap">Articles</Link>
            </li>
            <li>
              <Link href="/contact" className="text-white text-base font-medium leading-6 hover:opacity-80 transition-opacity whitespace-nowrap">Contact Us</Link>
            </li>
            <li>
              <Link href="/about-us" className="text-white text-base font-medium leading-6 hover:opacity-80 transition-opacity whitespace-nowrap">About Us</Link>
            </li> 
          </ul>
        </div>

        {/* Right Section - Search and Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="hidden sm:block relative w-48 md:w-56">
            <input
              type="text"
              placeholder={search.placeholder}
              className="w-full h-10 pl-10 pr-4 py-2 bg-[#333333] text-[#ECECEC] rounded-full font-['Bricolage_Grotesque'] text-sm leading-6 placeholder-[#ECECEC] focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setShowDropdown(filtered.length > 0)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#ECECEC] w-4 h-4" />
            {showDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-[#222] border border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {filtered.map((p) => (
                  <div
                    key={p._id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-white"
                    onMouseDown={() => {
                      setSearchTerm('');
                      setShowDropdown(false);
                      router.push(`/projects/${p._id}`);
                    }}
                  >
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.location} &middot; {p.propertyType}</div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="px-4 py-2 text-gray-400">No results found.</div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-md shadow-lg pt-4 pb-8">
          <ul className="flex flex-col items-center gap-6">
            <li className="relative group w-full">
              <button
                className="text-white text-lg font-medium leading-6 hover:opacity-80 transition-opacity whitespace-nowrap focus:outline-none w-full text-left"
                onClick={e => e.preventDefault()}
              >
                Properties
              </button>
              {/* Mega Menu for mobile */}
              <div className="w-full bg-[#10131a] border border-gray-800 rounded-xl shadow-2xl z-50 mt-2 p-4 flex flex-col gap-2">
                <div className="grid grid-cols-1 gap-2">
                  {categories.map(cat => (
                    <Link
                      key={cat.name}
                      href={`/category/${encodeURIComponent(cat.name)}`}
                      className="text-white text-base font-medium py-2 px-3 rounded hover:bg-gray-800 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
            <li>
              <Link href="/articles" className="text-white text-lg font-medium leading-6 hover:opacity-80 transition-opacity" onClick={() => setIsMenuOpen(false)}>Articles</Link>
            </li>
            <li>
              <Link href="/contact" className="text-white text-lg font-medium leading-6 hover:opacity-80 transition-opacity" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
            </li>
          </ul>
          {/* Search Bar in Mobile Menu */}
          <div className="mt-6 mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={search.placeholder}
                className="w-full h-12 pl-12 pr-4 py-2 bg-[#333333] text-[#ECECEC] rounded-full font-['Bricolage_Grotesque'] text-base leading-6 placeholder-[#ECECEC] focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#ECECEC] w-5 h-5" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
