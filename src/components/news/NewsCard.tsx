import React, { useState } from 'react';
import { ExternalLink, Calendar, Building2, AlertTriangle, Car, Droplets, Construction, ShieldAlert, Users, Landmark, Newspaper } from 'lucide-react';
import { NewsArticle, CivicCategory } from '../../types/news';
import { Badge } from '../common/Badge';

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const [imageError, setImageError] = useState(false);

  // Accessible Category Icon for fallbacks
  const getCategoryIcon = (category: CivicCategory) => {
    switch (category) {
      case 'Traffic/Transport':
        return <Car size={24} className="text-[#315B48]" />;
      case 'Utilities':
        return <Droplets size={24} className="text-[#2C526A]" />;
      case 'Infrastructure/Roads':
        return <Construction size={24} className="text-[#784D2B]" />;
      case 'Politics/Government':
        return <Landmark size={24} className="text-[#4A473D]" />;
      case 'Disasters/Emergencies':
        return <AlertTriangle size={24} className="text-[#9A2E22]" />;
      case 'Public Safety':
        return <ShieldAlert size={24} className="text-[#46387E]" />;
      case 'Community/Other':
        return <Users size={24} className="text-[#635547]" />;
      default:
        return <Newspaper size={24} className="text-[#315B48]" />;
    }
  };

  // Format date safely
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <article
      className="bg-[#FFF9F4] rounded-xl border border-[#E5D3C2] hover:border-[#C9B29F] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
      aria-labelledby={`headline-${article.id}`}
    >
      <div>
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="category" category={article.category}>
              {article.category}
            </Badge>
            {article.isDemoContent && (
              <Badge variant="demo">Demo Record</Badge>
            )}
          </div>

          {formattedDate && (
            <div className="flex items-center gap-1 text-[11px] text-[#615E52]">
              <Calendar size={12} className="text-[#827E70]" />
              <time dateTime={article.publishedAt}>{formattedDate}</time>
            </div>
          )}
        </div>

        {/* Content Layout with optional thumbnail / fallback */}
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <h3
              id={`headline-${article.id}`}
              className="font-serif text-base sm:text-lg font-bold text-[#292923] group-hover:text-[#315B48] transition-colors leading-snug mb-2"
            >
              {article.headline}
            </h3>
            <p className="text-xs sm:text-sm text-[#615E52] leading-relaxed line-clamp-3">
              {article.factualDescription}
            </p>
          </div>

          {/* Thumbnail / Graphic Fallback Container */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-[#F5EAE0] border border-[#E5D3C2] shrink-0 overflow-hidden flex items-center justify-center">
            {article.thumbnailUrl && !imageError ? (
              <img
                src={article.thumbnailUrl}
                alt=""
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-center opacity-85">
                {getCategoryIcon(article.category)}
                <span className="text-[9px] uppercase font-bold text-[#827E70] mt-1 tracking-tight">
                  {article.locality}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Publisher & Clear Original Article Link */}
      <div className="mt-4 pt-3.5 border-t border-[#E5D3C2]/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-[#615E52]">
          <Building2 size={13} className="text-[#315B48] shrink-0" />
          <span className="font-semibold text-[#292923] truncate max-w-[180px]">
            {article.source.name}
          </span>
          {article.source.isVerifiedNotice && (
            <span
              className="text-[10px] text-[#315B48] bg-[#E8F0EC] px-1.5 py-0.2 rounded font-medium shrink-0"
              title="Verified official notice or municipal publication"
            >
              Official
            </span>
          )}
        </div>

        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-[#315B48] hover:text-[#244637] hover:underline transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#315B48] rounded px-1 py-0.5"
          aria-label={`Read original notice for ${article.headline}`}
        >
          <span>Read Original Article</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </article>
  );
};
