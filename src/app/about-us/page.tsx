"use client";
import React from "react";
import Navigation from "@/components/common/Navigation";
import Footer from "@/components/common/Footer";

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <div className="pt-24 bg-[#0A0A0A] min-h-[80vh] text-white">
        <section className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-semibold mb-6">About Us</h1>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            At <strong>Xaneur Realty</strong>, we are committed to redefining the urban living experience. With over a decade of industry experience, our team of professionals brings a unique blend of technology, design, and innovation to every real estate project.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            Headquartered in Ahmedabad, we specialize in luxury residential developments, commercial spaces, and smart townships. Our portfolio includes iconic projects in Dholera, Gandhinagar, and across Gujarat that combine aesthetics, sustainability, and future-ready infrastructure.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            Our mission is to provide more than just spaces — we create communities where people thrive. From land acquisition to project delivery, we handle every aspect with transparency, efficiency, and customer-centric focus.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            Whether you're an investor, homebuyer, or partner — welcome to a smarter way to build your future.
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
}
