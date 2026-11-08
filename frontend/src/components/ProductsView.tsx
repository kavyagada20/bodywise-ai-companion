'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ShieldCheck, 
  Bot, 
  ExternalLink, 
  ChevronRight,
  Info,
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles
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
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-[#E3E8E1] p-6 md:p-8 shadow-card">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-[#EDF3ED] text-[#2F855A] text-xs font-bold border border-[#D0DDD0] flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Be Bodywise Formulations</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#173F35]">
            Formulation &amp; Active Ingredient Library
          </h1>
          <p className="text-sm text-[#727B74] mt-1.5 leading-relaxed">
            Grounded in clinical personal care standards. Explore verified active concentrations, dermatological usage protocols, and safety contraindications.
          </p>
        </div>

        {/* Search Input */}
        <div className="mt-6">
          <div className="relative">
            <Search className="w-4 h-4 text-[#727B74] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name or active ingredients (e.g. Salicylic Acid, Redensyl, Niacinamide, Retinol)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#E3E8E1] text-xs md:text-sm text-[#252D29] placeholder-[#727B74] focus:outline-none focus:border-[#173F35] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#727B74] mr-1">Category:</span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#173F35] text-white shadow-sm'
                    : 'bg-[#FAF9F5] text-[#727B74] hover:bg-[#EDF3ED] border border-[#E3E8E1]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Concern Filter Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#727B74] mr-1">Target Concern:</span>
          {concerns.map((con) => {
            const isSelected = selectedConcern === con;
            return (
              <button
                key={con}
                onClick={() => setSelectedConcern(con)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'bg-[#477C68] text-white font-semibold'
                    : 'bg-white text-[#727B74] hover:text-[#173F35] border border-[#E3E8E1]'
                }`}
              >
                {con}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-xl border border-[#E3E8E1] hover:border-[#A8BDA9] shadow-card hover:shadow-card-hover p-5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EDF3ED] text-[#173F35] border border-[#D0DDD0]">
                  {prod.category}
                </span>
                <span className="text-xs font-bold text-[#173F35]">₹{prod.price}</span>
              </div>

              <h3 className="text-base font-bold text-[#252D29] line-clamp-1">{prod.name}</h3>
              <p className="text-xs text-[#727B74] mt-1.5 line-clamp-2 leading-relaxed">{prod.description}</p>

              {prod.key_actives && (
                <div className="mt-3 text-xs bg-[#FAF9F5] p-2.5 rounded-lg border border-[#E3E8E1]">
                  <p className="text-[11px] font-bold text-[#173F35] uppercase tracking-wide">Key Actives:</p>
                  <p className="text-xs text-[#252D29] mt-0.5 font-medium">{prod.key_actives}</p>
                </div>
              )}

              <div className="mt-2.5 flex items-center space-x-1 text-[11px] text-[#727B74]">
                <span className="font-semibold text-[#173F35]">Target:</span>
                <span>{prod.intended_concern}</span>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-[#E3E8E1] flex items-center justify-between">
              <button
                onClick={() => onAskAI(`Explain how ${prod.name} works and how to apply it safely`)}
                className="text-xs font-semibold text-[#173F35] hover:text-[#477C68] flex items-center space-x-1"
              >
                <Bot className="w-3.5 h-3.5 text-[#477C68]" />
                <span>Ask AI Expert</span>
              </button>

              <button
                onClick={() => setActiveModalProduct(prod)}
                className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#FAF9F5] hover:bg-[#EDF3ED] text-[#252D29] border border-[#E3E8E1]"
              >
                Clinical Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-[#D0DDD0] p-12 text-center">
          <ShoppingBag className="w-8 h-8 text-[#A8BDA9] mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[#173F35]">No formulations match your search</h3>
          <p className="text-xs text-[#727B74] mt-1 max-w-sm mx-auto">
            Try adjusting your category filter, clearing your search term, or asking the AI Companion.
          </p>
        </div>
      )}

      {/* Clinical Details Modal */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E3E8E1] shadow-card max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 animate-fadeIn">
            <div className="flex items-start justify-between pb-3 mb-4 border-b border-[#E3E8E1]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EDF3ED] text-[#173F35]">
                  {activeModalProduct.category}
                </span>
                <h3 className="text-lg font-bold text-[#173F35] mt-1">{activeModalProduct.name}</h3>
                <p className="text-xs text-[#727B74]">Targeting: {activeModalProduct.intended_concern}</p>
              </div>
              <button
                onClick={() => setActiveModalProduct(null)}
                className="text-[#727B74] hover:text-[#173F35]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#252D29]">
              <div>
                <h4 className="font-bold text-[#173F35] uppercase tracking-wider text-[11px] mb-1">Clinical Overview</h4>
                <p className="text-[#727B74] leading-relaxed">{activeModalProduct.description}</p>
              </div>

              {activeModalProduct.key_actives && (
                <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E3E8E1]">
                  <h4 className="font-bold text-[#173F35] uppercase tracking-wider text-[11px] mb-1">Key Active Ingredients</h4>
                  <p className="font-medium">{activeModalProduct.key_actives}</p>
                </div>
              )}

              {activeModalProduct.usage_instructions && (
                <div>
                  <h4 className="font-bold text-[#173F35] uppercase tracking-wider text-[11px] mb-1">Usage Protocol</h4>
                  <p className="text-[#727B74] leading-relaxed">{activeModalProduct.usage_instructions}</p>
                </div>
              )}

              {activeModalProduct.warnings && (
                <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#B7791F]/30 flex items-start space-x-2.5">
                  <AlertTriangle className="w-4 h-4 text-[#B7791F] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#B7791F] uppercase tracking-wider text-[10px]">Precautions &amp; Patch Test</h4>
                    <p className="text-[11px] text-[#727B74] mt-0.5">{activeModalProduct.warnings}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-[#727B74] pt-2">
                <span>Verification: <strong>{activeModalProduct.verification_status}</strong></span>
                {activeModalProduct.source_url && (
                  <a
                    href={activeModalProduct.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#173F35] hover:underline flex items-center space-x-1"
                  >
                    <span>Official Product Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E3E8E1] flex items-center justify-between">
              <button
                onClick={() => {
                  const prod = activeModalProduct;
                  setActiveModalProduct(null);
                  onAskAI(`Can you explain the science behind ${prod.name} and how it compares to alternatives?`);
                }}
                className="px-3.5 py-2 rounded-lg bg-[#EDF3ED] text-[#173F35] text-xs font-semibold hover:bg-[#D0DDD0] flex items-center space-x-1.5"
              >
                <Bot className="w-4 h-4 text-[#477C68]" />
                <span>Discuss with AI Companion</span>
              </button>

              <button
                onClick={() => setActiveModalProduct(null)}
                className="px-4 py-2 rounded-lg bg-[#173F35] text-white text-xs font-semibold hover:bg-[#1F4F43]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
