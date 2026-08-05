'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  List,
  PackageCheck,
  Shield,
  Star,
  MessageSquare,
  ThumbsUp,
  CheckCircle,
  Download,
  Filter,
  Search,
  ChevronDown,
} from 'lucide-react';
import { ProductDetailItem } from '@/lib/products-data';

interface ProductTabsSectionProps {
  product: ProductDetailItem;
}

export function ProductTabsSection({ product }: ProductTabsSectionProps) {
  const [activeTab, setActiveTab] = useState<
    'description' | 'specs' | 'box' | 'warranty' | 'reviews' | 'qna' | 'downloads'
  >('description');

  const [reviewFilterRating, setReviewFilterRating] = useState<number | null>(null);
  const [qnaSearch, setQnaSearch] = useState('');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);

  const filteredReviews = reviewFilterRating
    ? product.reviewsList?.filter((r) => r.rating === reviewFilterRating)
    : product.reviewsList;

  const filteredQuestions = qnaSearch
    ? product.questionsList?.filter(
        (q) =>
          q.question.toLowerCase().includes(qnaSearch.toLowerCase()) ||
          q.answer?.toLowerCase().includes(qnaSearch.toLowerCase())
      )
    : product.questionsList;

  return (
    <div id="product-tabs" className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Sticky Tab Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('description')}
          className={`py-4 text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'description'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Description</span>
        </button>

        <button
          onClick={() => setActiveTab('specs')}
          className={`py-4 text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'specs'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <List className="w-4 h-4" />
          <span>Specifications</span>
        </button>

        <button
          onClick={() => setActiveTab('box')}
          className={`py-4 text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'box'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>In the Box</span>
        </button>

        <button
          onClick={() => setActiveTab('warranty')}
          className={`py-4 text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'warranty'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Warranty</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-4 text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'reviews'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>Reviews ({product.reviewCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('qna')}
          className={`py-4 text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'qna'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Q&A ({product.qnaCount || 24})</span>
        </button>

        <button
          onClick={() => setActiveTab('downloads')}
          className={`py-4 text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'downloads'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Downloads</span>
        </button>
      </div>

      {/* Tab Content Panel */}
      <div className="p-6 sm:p-10">
        <AnimatePresence mode="wait">
          {/* Overview Description */}
          {activeTab === 'description' && (
            <motion.div
              key="desc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-sm text-slate-700 leading-relaxed font-normal"
            >
              <div className="prose prose-slate max-w-none space-y-4">
                <p className="text-base text-slate-800 font-medium">{product.description}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Product Features Overview</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                      <span className="text-xs font-bold text-slate-800">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Grouped Specifications Table */}
          {activeTab === 'specs' && (
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {product.specifications && product.specifications.length > 0 ? (
                product.specifications.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-3">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                      {group.category}
                    </h4>

                    <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                      {group.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className={`grid grid-cols-1 sm:grid-cols-12 p-3.5 text-xs ${
                            iIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                          }`}
                        >
                          <span className="sm:col-span-4 font-bold text-slate-800">{item.label}</span>
                          <span className="sm:col-span-8 text-slate-600 font-medium mt-1 sm:mt-0">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                  <div className="grid grid-cols-12 p-4 bg-white"><span className="col-span-4 font-bold">Brand</span><span className="col-span-8">{product.brand}</span></div>
                  <div className="grid grid-cols-12 p-4 bg-slate-50"><span className="col-span-4 font-bold">SKU</span><span className="col-span-8">{product.sku}</span></div>
                  <div className="grid grid-cols-12 p-4 bg-white"><span className="col-span-4 font-bold">Warranty</span><span className="col-span-8">{product.warranty}</span></div>
                </div>
              )}
            </motion.div>
          )}

          {/* In the Box */}
          {activeTab === 'box' && (
            <motion.div
              key="box"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Package Contents Included</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {product.boxContents?.map((item, bIdx) => (
                  <div key={bIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-lightest text-brand-primary flex items-center justify-center font-bold text-xs">
                        {bIdx + 1}
                      </div>
                      <span className="text-xs font-extrabold text-slate-900">{item.title}</span>
                    </div>
                    <span className="text-xs font-bold text-brand-primary bg-brand-lightest px-2.5 py-1 rounded-full">{item.quantity}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Warranty & Guarantee */}
          {activeTab === 'warranty' && (
            <motion.div
              key="warranty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-brand-lightest/50 border border-brand-light/40 flex items-start gap-4">
                <Shield className="w-8 h-8 text-brand-primary shrink-0 mt-1" />
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-brand-dark">{product.warranty}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    All products purchased on SELLORA come with official brand manufacturer warranty support. In case of any technical or hardware defect during the warranty period, bring or send your item to any SELLORA Express Hub across Bangladesh for instant diagnostics and unit replacement.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Reviews & Ratings */}
          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Summary Header */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-200/80 items-center">
                <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-6">
                  <span className="text-5xl font-black text-slate-900">{product.rating}</span>
                  <div className="flex items-center gap-1 text-amber-400 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-bold">Based on {product.reviewCount} verified reviews</span>
                </div>

                <div className="md:col-span-8 space-y-1.5 text-xs font-bold text-slate-600">
                  <div className="flex items-center gap-3">
                    <span>5 Stars</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden"><div className="w-[85%] h-full bg-amber-400" /></div>
                    <span>85%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>4 Stars</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden"><div className="w-[10%] h-full bg-amber-400" /></div>
                    <span>10%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>3 Stars</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden"><div className="w-[3%] h-full bg-amber-400" /></div>
                    <span>3%</span>
                  </div>
                </div>
              </div>

              {/* Review Filter */}
              <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-800">Filter Ratings:</span>
                  <button
                    onClick={() => setReviewFilterRating(null)}
                    className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                      reviewFilterRating === null ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All ({product.reviewCount})
                  </button>
                  <button
                    onClick={() => setReviewFilterRating(5)}
                    className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                      reviewFilterRating === 5 ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    5 Stars
                  </button>
                </div>
              </div>

              {/* Review Cards List */}
              <div className="space-y-4">
                {filteredReviews?.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-900">{rev.author}</span>
                            {rev.verified && (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Verified Buyer
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <div className="flex items-center text-amber-400">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400" />
                              ))}
                            </div>
                            <span>•</span>
                            <span>{rev.date}</span>
                          </div>
                        </div>
                      </div>

                      <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-primary font-bold cursor-pointer">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful ({rev.likes})</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-700 font-normal leading-relaxed">{rev.comment}</p>

                    {rev.photos && rev.photos.length > 0 && (
                      <div className="flex gap-2 pt-1">
                        {rev.photos.map((p, idx) => (
                          <img key={idx} src={p} alt="Review Photo" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Q&A Section */}
          {activeTab === 'qna' && (
            <motion.div
              key="qna"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={qnaSearch}
                    onChange={(e) => setQnaSearch(e.target.value)}
                    placeholder="Search questions about this product..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <button
                  onClick={() => setIsAskModalOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-brand-primary text-white font-extrabold text-xs shadow-sm hover:bg-brand-primary-hover transition-all cursor-pointer shrink-0"
                >
                  Ask a Question
                </button>
              </div>

              <div className="space-y-4">
                {filteredQuestions?.map((q) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-brand-dark text-white font-black text-xs flex items-center justify-center shrink-0">Q</span>
                      <div>
                        <h5 className="text-xs font-black text-slate-900">{q.question}</h5>
                        <span className="text-[10px] text-slate-400 font-medium">Asked by {q.author} • {q.date}</span>
                      </div>
                    </div>

                    {q.answer && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 ml-8 flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-brand-primary text-white font-black text-xs flex items-center justify-center shrink-0">A</span>
                        <div>
                          <p className="text-xs text-slate-700 font-normal leading-relaxed">{q.answer}</p>
                          <div className="text-[10px] text-brand-primary font-bold mt-1">Answered by {q.answeredBy} • {q.answerDate}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Downloads */}
          {activeTab === 'downloads' && (
            <motion.div
              key="downloads"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Official Downloads & User Guides</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900">User Manual & Pairing Guide (PDF)</h5>
                    <span className="text-[11px] text-slate-500">2.4 MB • Official English/Bengali</span>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-brand-dark text-white font-bold text-xs flex items-center gap-1 cursor-pointer">
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ask Question Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-slate-900">Ask Question to Seller</h3>
            <textarea
              rows={4}
              placeholder="Type your question about compatibility, warranty, or delivery..."
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-primary"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-brand-primary text-white font-bold text-xs cursor-pointer"
              >
                Submit Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
