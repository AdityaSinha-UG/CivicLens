import React, { useState, useEffect, useCallback } from 'react';
import { NavTab, Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { Header } from './components/common/Header';
import { MainNewsView } from './views/MainNewsView';
import { FlashcardsView } from './views/FlashcardsView';
import { ProfileView } from './components/profile/ProfileView';
import { OnboardingModal } from './components/profile/OnboardingModal';
import { LocalityModal } from './components/profile/LocalityModal';
import { newsService } from './services/newsService';
import { storageService } from './services/storageService';
import { generateFlashcardsFromArticleList } from './services/flashcardService';
import { NewsArticle, CivicCategory } from './types/news';
import { UserProfile } from './types/profile';
import { CivicFlashcard } from './types/flashcard';

export const App: React.FC = () => {
  // Navigation & Profile
  const [currentTab, setCurrentTab] = useState<NavTab>('main');
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [isLocalityModalOpen, setIsLocalityModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // News State
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [flashcards, setFlashcards] = useState<CivicFlashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CivicCategory | 'All'>('All');
  const [lastUpdated, setLastUpdated] = useState('');

  // Check onboarding on initial render
  useEffect(() => {
    if (!profile.hasCompletedOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, [profile.hasCompletedOnboarding]);

  // Load news reports
  const fetchNews = useCallback(async (loc: string, queryText: string, cat: CivicCategory | 'All') => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await newsService.searchArticles({
        locality: loc,
        query: queryText,
        category: cat,
      });
      setArticles(result.articles);
      setLastUpdated(result.lastUpdated);
      // Deterministically generate flashcards from the retrieved articles
      const generatedCards = generateFlashcardsFromArticleList(result.articles);
      setFlashcards(generatedCards);
    } catch (err) {
      console.error('Error fetching civic reports:', err);
      setError('Unable to load civic notices. Please check connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch when locality, query, or category changes
  useEffect(() => {
    fetchNews(profile.locality, searchQuery, selectedCategory);
  }, [profile.locality, searchQuery, selectedCategory, fetchNews]);

  // Handlers
  const handleSelectLocality = (newLocality: string) => {
    const updated = { ...profile, locality: newLocality };
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    storageService.saveProfile(newProfile);
  };

  const handleResetProfile = () => {
    storageService.resetProfile();
    const defaults = storageService.getProfile();
    setProfile(defaults);
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const handleCompleteOnboarding = (partial: Partial<UserProfile>) => {
    const updated = { ...profile, ...partial, hasCompletedOnboarding: true };
    setProfile(updated);
    storageService.saveProfile(updated);
    setIsOnboardingOpen(false);
  };

  const handleCreateFlashcards = () => {
    // Generate flashcards deterministically and switch to Flashcards tab
    const generated = generateFlashcardsFromArticleList(articles);
    setFlashcards(generated);
    setCurrentTab('flashcards');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div className="min-h-screen bg-[#FA541C] text-black flex flex-col md:flex-row font-sans selection:bg-black selection:text-[#D4FF00]">
      {/* Desktop Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        locality={profile.locality}
        onOpenLocalityModal={() => setIsLocalityModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Top Header */}
        <Header
          locality={profile.locality}
          lastUpdated={lastUpdated}
          onOpenLocalityModal={() => setIsLocalityModalOpen(true)}
          onCreateFlashcards={handleCreateFlashcards}
          showFlashcardAction={currentTab === 'main'}
        />

        {/* View Content */}
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 max-w-6xl w-full mx-auto">
          {currentTab === 'main' && (
            <MainNewsView
              locality={profile.locality}
              articles={articles}
              isLoading={isLoading}
              error={error}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onSearch={setSearchQuery}
              onSelectCategory={setSelectedCategory}
              onRefresh={() => fetchNews(profile.locality, searchQuery, selectedCategory)}
              onCreateFlashcards={handleCreateFlashcards}
              onResetFilters={handleResetFilters}
            />
          )}

          {currentTab === 'flashcards' && (
            <FlashcardsView
              cards={flashcards}
              locality={profile.locality}
              onReturnToFeed={() => setCurrentTab('main')}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              profile={profile}
              onSaveProfile={handleSaveProfile}
              onResetProfile={handleResetProfile}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />

      {/* Onboarding Dialog */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleCompleteOnboarding}
        onDismiss={() => setIsOnboardingOpen(false)}
      />

      {/* Locality Switch Modal */}
      <LocalityModal
        isOpen={isLocalityModalOpen}
        currentLocality={profile.locality}
        onClose={() => setIsLocalityModalOpen(false)}
        onSelectLocality={handleSelectLocality}
      />
    </div>
  );
};

export default App;
