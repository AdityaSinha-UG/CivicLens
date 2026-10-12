import React, { useState } from 'react';
import { ExternalLink, Calendar, Building2, AlertTriangle, Car, Droplets, Construction, ShieldAlert, Users, Landmark, Newspaper } from 'lucide-react';
import { NewsArticle, CivicCategory } from '../../types/news';
import { Badge } from '../common/Badge';

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const [imageError, setImageError] = useState(false);

  const getCategoryIcon = (category: CivicCategory) => {
    switch (category) {
      case 'Traffic/Transport':
        return <Car size={24} className="text-[#FA541C]" />;
      case 'Utilities':
        return <Droplets size={24} className="text-[#0284C7]" />;
      case 'Infrastructure/Roads':
        return <Construction size={24} className="text-[#D97706]" />;
      case 'Politics/Government':
        return <Landmark size={24} className="text-[#4F46E5]" />;
      case 'Disasters/Emergencies':
        return <AlertTriangle size={24} className="text-[#DC2626]" />;
      case 'Public Safety':
        return <ShieldAlert size={24} className="text-[#7C3AED]" />;
      case 'Community/Other':
        return <Users size={24} className="text-[#059669]" />;
      default:
        return <Newspaper size={24} className="text-[#FA541C]" />;
    }
  };

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <article
      className="bg-white dark:bg-[#231A0F] rounded-3xl border-2 border-black dark:border-[#5A3A1A] p-4 sm:p-6 shadow-[0_8px_0_0_#121212] hover:translate-y-[-2px] transition-all flex flex-col justify-between group"
      aria-labelledby={`headline-${article.id}`}
    >
      <div>
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="category" category={article.category} className="text-[10px] sm:text-xs">
              {article.category}
            </Badge>
            {article.isDemoContent && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/10 dark:bg-white/10 text-black dark:text-[#F5EEE6] border border-black/20 dark:border-white/15">
                Demo
              </span>
            )}
          </div>

          {formattedDate && (
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-bold text-black/60 dark:text-[#F5EEE6]/50">
              <Calendar size={11} />
              <time dateTime={article.publishedAt}>{formattedDate}</time>
            </div>
          )}
        </div>

        {/* Content Layout with thumbnail */}
        <div className="flex gap-3 sm:gap-4 items-start">
          <div className="flex-1 min-w-0">
            <h3
              id={`headline-${article.id}`}
              className="font-['Syne'] text-sm sm:text-lg font-bold text-black dark:text-[#F5EEE6] group-hover:text-[#FA541C] dark:group-hover:text-[#FA541C] transition-colors leading-snug mb-1.5 line-clamp-3 sm:line-clamp-2"
            >
              {article.headline.replace(/^\[Demo\]\s*/i, '')}
            </h3>
            <p className="text-xs sm:text-sm text-black/75 dark:text-[#F5EEE6]/65 leading-relaxed line-clamp-2 sm:line-clamp-3 font-medium">
              {article.factualDescription}
            </p>
          </div>

          {/* Thumbnail / Graphic Container */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FFF2E8] dark:bg-[#3A2410] border-2 border-black dark:border-[#5A3A1A] shrink-0 overflow-hidden flex items-center justify-center">
            {article.thumbnailUrl && !imageError ? (
              <img
                src={article.thumbnailUrl}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-1.5 text-center">
                {getCategoryIcon(article.category)}
                <span className="text-[8px] sm:text-[9px] uppercase font-black text-black/60 dark:text-[#F5EEE6]/50 mt-1 truncate max-w-full">
                  {article.locality}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Publisher & Clear Original Article Link */}
      <div className="mt-4 sm:mt-5 pt-3 sm:pt-3.5 border-t-2 border-black/10 dark:border-[#5A3A1A]/50 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-black/80 dark:text-[#F5EEE6]/70 min-w-0">
          <Building2 size={13} className="text-[#FA541C] shrink-0" />
          <span className="font-bold text-black dark:text-[#F5EEE6] truncate max-w-[120px] sm:max-w-[170px] text-[11px] sm:text-xs">
            {article.source.name}
          </span>
          {article.source.isVerifiedNotice && (
            <span
              className="text-[9px] sm:text-[10px] text-black bg-[#D4FF00] px-1.5 py-0.2 rounded font-black border border-black shrink-0"
              title="Verified official notice or municipal publication"
            >
              VERIFIED
            </span>
          )}
        </div>

        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-black text-black dark:text-[#F5EEE6] hover:text-[#FA541C] dark:hover:text-[#FA541C] transition-colors shrink-0 underline decoration-2 underline-offset-2 hover:decoration-[#FA541C] cursor-pointer text-[11px] sm:text-xs"
          aria-label={`Read original notice for ${article.headline}`}
        >
          <span>Read Notice</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </article>
  );
};
