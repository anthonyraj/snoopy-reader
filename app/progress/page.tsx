"use client";

import { useState, useCallback } from "react";
import { TOTAL_CHAPTERS } from "@/lib/bible-books";
import { getOverallStats } from "@/lib/progress";
import {
  getAllBookStats,
  getTopBooks,
  getMostReadBook,
  getTestamentStats,
  getCompletedBooks,
  getCategoryProgress,
} from "@/lib/progress-queries";
import { BackLink } from "@/app/components/back-link";
import { TopBooks } from "@/app/components/top-books";
import { ReadingHighlights } from "@/app/components/reading-highlights";
import { CategoryProgress } from "@/app/components/category-progress";
import { ProgressHero } from "@/app/components/progress-hero";
import { TabBar } from "@/app/components/tab-bar";
import { CategoryBookGrid } from "@/app/components/category-book-grid";
import { SmartRecommendations } from "@/app/components/smart-recommendations";
import { SeasonReadingPrompt } from "@/app/components/season-reading-prompt";
import { getEarnedBadges } from "@/lib/badges";
import { getRecommendations } from "@/lib/recommendations";
import { generateSeasonPrompt, saveCurrentPrompt } from "@/lib/season-prompts";
import { getProfile } from "@/lib/user-profile";
import {
  getReadingStreak,
  getActivityByDay,
  getWeeklyPace,
  getMilestones,
  getReadingDiversity,
  getRecentActivity,
} from "@/lib/journey-queries";
import { JourneyStreaks } from "@/app/components/journey-streaks";
import { JourneyHeatmap } from "@/app/components/journey-heatmap";
import { JourneyPace } from "@/app/components/journey-pace";
import { JourneyMilestones } from "@/app/components/journey-milestones";
import { JourneyDiversity } from "@/app/components/journey-diversity";
import { JourneyTimeline } from "@/app/components/journey-timeline";

type Tab = "season" | "activity" | "books" | "insights" | "journey";

const TABS: { id: Tab; label: string }[] = [
  { id: "activity", label: "Activity" },
  { id: "insights", label: "Insights" },
  { id: "books", label: "Books" },
  { id: "season", label: "Season" },
  { id: "journey", label: "Journey" },
];

function loadPageData() {
  if (typeof window === "undefined") {
    return {
      stats: {} as Record<string, { read: number; total: number }>,
      overall: { read: 0, total: TOTAL_CHAPTERS },
      topBooks: [],
      mostRead: null,
      ot: { read: 0, total: 0, percentage: 0 },
      nt: { read: 0, total: 0, percentage: 0 },
      completedBooks: [],
      categoryProgress: [],
      badges: [],
      recommendations: [],
      seasonPrompt: null,
      profile: null,
      streak: { current: 0, longest: 0 },
      activityDays: [],
      weeklyPace: [],
      milestones: [],
      diversity: [],
      recentActivity: [],
    };
  }
  return {
    stats: getAllBookStats(),
    overall: getOverallStats(),
    topBooks: getTopBooks(5),
    mostRead: getMostReadBook(),
    ot: getTestamentStats("OT"),
    nt: getTestamentStats("NT"),
    completedBooks: getCompletedBooks(),
    categoryProgress: getCategoryProgress(),
    badges: getEarnedBadges(),
    recommendations: getRecommendations(),
    seasonPrompt: generateSeasonPrompt(),
    profile: getProfile(),
    streak: getReadingStreak(),
    activityDays: getActivityByDay(12),
    weeklyPace: getWeeklyPace(8),
    milestones: getMilestones(),
    diversity: getReadingDiversity(),
    recentActivity: getRecentActivity(10),
  };
}

export default function ProgressPage() {
  const [data, setData] = useState(loadPageData);
  const [activeTab, setActiveTab] = useState<Tab>("activity");

  const handleSavePrompt = useCallback(() => {
    saveCurrentPrompt();
    setData(loadPageData());
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <BackLink />

      <ProgressHero
        overall={data.overall}
        completedCount={data.completedBooks.length}
        ot={data.ot}
        nt={data.nt}
        badges={data.badges}
      />

      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="flex flex-col gap-6">
        {activeTab === "season" && data.seasonPrompt && data.profile && (
          <SeasonReadingPrompt
            prompt={data.seasonPrompt}
            goal={data.profile.readingGoal}
            savedPrompts={data.profile.savedPrompts}
            onSavePrompt={handleSavePrompt}
          />
        )}

        {activeTab === "activity" && (
          <SmartRecommendations items={data.recommendations} />
        )}

        {activeTab === "books" && <CategoryBookGrid stats={data.stats} />}

        {activeTab === "journey" && (
          <>
            <JourneyStreaks streak={data.streak} />
            <JourneyHeatmap days={data.activityDays} />
            <JourneyPace weeks={data.weeklyPace} />
            <JourneyMilestones milestones={data.milestones} />
            <JourneyDiversity stats={data.diversity} />
            <JourneyTimeline events={data.recentActivity} />
          </>
        )}

        {activeTab === "insights" && (
          <>
            <ReadingHighlights mostRead={data.mostRead} />
            <TopBooks books={data.topBooks} />
            <CategoryProgress categories={data.categoryProgress} />
          </>
        )}
      </div>
    </div>
  );
}
