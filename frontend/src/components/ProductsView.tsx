'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  Bot, 
  ExternalLink, 
  ChevronRight,
  Info,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface ProductsViewProps {
  products: any[];
  userConcern?: string;
  onAskAI: (prompt: string) => void;
  selectedProductInitial?: any;
}

export default function ProductsView({
  products,
  userConcern,
  onAskAI,
  selectedProductInitial,
}: ProductsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedConcern, setSelectedConcern] = useState('All');
  const [activeModalProduct, setActiveModalProduct] = useState<any>(selectedProductInitial || null);

  const categories = ['All', 'Hair', 'Face', 'Body', 'Nutrition'];
  const concerns = [
    'All',
    'Hair fall',
    'Dandruff',
    'Hair growth',
    'Acne',
    'Pigmentation',
    'Dry skin',
    'Body acne',
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.key_actives && p.key_actives.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesConcern =
      selectedConcern === 'All' ||
      p.intended_concern.toLowerCase().includes(selectedConcern.toLowerCase());

    return matchesSearch && matchesCategory && matchesConcern;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="wellness-card p-6 md:p-8 border-[#ebdff3] bg-gradient-to-br from-[#faf7fc] to-white">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-[#f1f8f3] text-[#529b68] text-xs font-bold border border-[#529b68]/20 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Be Bodywise Information</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#351a42]">
            Discover Be Bodywise Formulations
          </h1>
          <p className="text-sm text-[#766585] mt-1 leading-relaxed">
            Science-backed formulations curated for clinical personal care. Explore verified active ingredients, usage protocols, and safety warnings.
          </p>
        </div>

        {/* Search Bar & Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#766585] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name, active ingredient (e.g. Salicylic Acid, Redensyl, Niacinamide)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#ebdff3] text-xs md:text-sm text-[#351a42] placeholder-[#766585] focus:outline-none focus:border-[#7c469b] transition-all"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#766585] mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#7c469b] text-white shadow-soft'
                  : 'bg-white text-[#553267] border border-[#ebdff3] hover:bg-[#faf7fc]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Concern Pills */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#766585] mr-1">Concern:</span>
          {concerns.map((con) => (
            <button
              key={con}
              onClick={() => setSelectedConcern(con)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                selectedConcern === con
                  ? 'bg-[#dec7ea] text-[#553267] font-semibold'
                  : 'bg-white text-[#766585] border border-[#ebdff3] hover:text-[#351a42]'
              }`}
            >
              {con}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="wellness-card p-5 border-[#ebdff3] flex flex-col justify-between hover:shadow-card group"
          >
            <div>
              {/* Top Tag & Price */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f3eef8] text-[#7c469b] border border-[#dec7ea]">
                  {product.category}
                </span>
                <span className="text-sm font-bold text-[#351a42]">₹{product.price}</span>
              </div>

              {/* Title & Concern */}
              <h3 className="text-base font-bold text-[#351a42] group-hover:text-[#7c469b] transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="text-[11px] font-semibold text-[#945bb7] mt-0.5">
                Target: {product.intended_concern}
              </p>

              {/* Description */}
              <p className="text-xs text-[#766585] mt-2 line-clamp-3 leading-relaxed">
                {product.description}
              </p>

              {/* Key Actives Pill */}
              {product.key_actives && (
                <div className="mt-3 p-2 rounded-xl bg-[#faf7fc] border border-[#ebdff3]">
                  <p className="text-[10px] font-bold uppercase text-[#766585] tracking-wider">
                    Key Actives
                  </p>
                  <p className="text-xs font-semibold text-[#553267] mt-0.5 line-clamp-1">
                    {product.key_actives}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-[#ebdff3] flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveModalProduct(product)}
                className="px-3 py-2 rounded-xl bg-white hover:bg-[#faf7fc] text-[#553267] text-xs font-semibold border border-[#ebdff3] flex-1 text-center transition-all"
              >
                Full Details
              </button>

              <button
                onClick={() => onAskAI(`Explain how ${product.name} works and how to apply it in my routine.`)}
                className="px-3 py-2 rounded-xl bg-[#7c469b] hover:bg-[#673a7f] text-white text-xs font-semibold flex items-center justify-center space-x-1.5 flex-1 transition-all shadow-soft"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 wellness-card p-6 border-[#ebdff3]">
          <ShoppingBag className="w-10 h-10 text-[#dec7ea] mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[#351a42]">No products matched your search</h3>
          <p className="text-xs text-[#766585] mt-1">
            Try adjusting your search query or selecting &quot;All&quot; categories.
          </p>
        </div>
      )}

      {/* Product Detail Modal */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="wellness-card max-w-2xl w-full p-6 md:p-8 bg-white border-[#ebdff3] shadow-elevated my-8 max-h-[90vh] overflow-y-auto animate-scaleIn">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#ebdff3]">
              <div>
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f3eef8] text-[#7c469b]">
                    {activeModalProduct.category}
                  </span>
                  <span className="text-xs font-semibold text-[#529b68] flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{activeModalProduct.verification_status}</span>
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-[#351a42]">
                  {activeModalProduct.name}
                </h2>
                <p className="text-xs font-bold text-[#7c469b] mt-0.5">
                  Target Concern: {activeModalProduct.intended_concern} • ₹{activeModalProduct.price}
                </p>
              </div>

              <button
                onClick={() => setActiveModalProduct(null)}
                className="text-sm font-bold text-[#766585] hover:text-[#351a42] p-1.5 rounded-lg hover:bg-[#faf7fc]"
              >
                ✕
              </button>
            </div>

            {/* Content Sections */}
            <div className="py-5 space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase text-[#766585] tracking-wider mb-1">
                  Product Overview
                </h4>
                <p className="text-sm text-[#351a42] leading-relaxed">
                  {activeModalProduct.description}
                </p>
              </div>

              {activeModalProduct.key_actives && (
                <div className="p-3.5 rounded-xl bg-[#faf7fc] border border-[#ebdff3]">
                  <h4 className="text-xs font-bold text-[#7c469b] flex items-center space-x-1.5 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Key Active Ingredients</span>
                  </h4>
                  <p className="text-xs text-[#351a42] font-semibold leading-relaxed">
                    {activeModalProduct.key_actives}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase text-[#766585] tracking-wider mb-1">
                  Usage Instructions
                </h4>
                <p className="text-xs text-[#351a42] bg-[#fbf9fe] p-3 rounded-xl border border-[#ebdff3] leading-relaxed">
                  {activeModalProduct.usage_instructions}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-[#766585] tracking-wider mb-1">
                  Complete Ingredients List
                </h4>
                <p className="text-[11px] font-mono text-[#766585] bg-[#faf7fc] p-3 rounded-xl border border-[#ebdff3] leading-relaxed">
                  {activeModalProduct.ingredients}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#fdf2f4] border border-[#e07a89]/30">
                <h4 className="text-xs font-bold text-[#e07a89] flex items-center space-x-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Safety Warnings &amp; Precautions</span>
                </h4>
                <p className="text-xs text-[#553267] leading-relaxed">
                  {activeModalProduct.warnings}
                </p>
              </div>

              {activeModalProduct.faq_json && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-[#766585] tracking-wider mb-1">
                    Frequently Asked Questions
                  </h4>
                  {(() => {
                    try {
                      const faqs = JSON.parse(activeModalProduct.faq_json);
                      return (
                        <div className="space-y-2">
                          {faqs.map((faq: any, fIdx: number) => (
                            <div key={fIdx} className="p-3 rounded-xl bg-[#faf7fc] border border-[#ebdff3]">
                              <p className="text-xs font-bold text-[#351a42]">Q: {faq.q}</p>
                              <p className="text-xs text-[#553267] mt-1 leading-relaxed">A: {faq.a}</p>
                            </div>
                          ))}
                        </div>
                      );
                    } catch {
                      return null;
                    }
                  })()}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-[#ebdff3] flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                href={activeModalProduct.source_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#766585] hover:text-[#351a42] flex items-center space-x-1 font-medium"
              >
                <span>View on bebodywise.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                <button
                  onClick={() => setActiveModalProduct(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#ebdff3] text-xs font-semibold text-[#553267] hover:bg-[#faf7fc] flex-1 sm:flex-none"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const query = `Explain the science behind ${activeModalProduct.name} and how it addresses ${activeModalProduct.intended_concern}`;
                    setActiveModalProduct(null);
                    onAskAI(query);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#7c469b] hover:bg-[#673a7f] text-white text-xs font-semibold flex items-center justify-center space-x-1.5 flex-1 sm:flex-none shadow-soft"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask AI About This</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

