"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import styles from "./UserProfile.module.css";
 

// Types for user profile data
interface UserProfileData {
  id: string;
  username: string;
  avatar: string;
  level: number;
  experience: {
    current: number;
    next: number;
  };
  memberSince: string;
  preferredFaction: string;
  badges: {
    id: string;
    name: string;
    icon: string;
  }[];
}

// Mock data fetcher - replace with actual API call
const fetchUserProfile = async (): Promise<UserProfileData> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    id: "user-789012",
    username: "CommanderAlpha",
    avatar: "https://via.placeholder.com/100",
    level: 42,
    experience: {
      current: 8750,
      next: 10000
    },
    memberSince: "2024-03-15T00:00:00Z",
    preferredFaction: "Wasteland Nomads",
    badges: [
      {
        id: "badge-001",
        name: "Early Adopter",
        icon: "🏆"
      },
      {
        id: "badge-002",
        name: "Tournament Finalist",
        icon: "🥈"
      },
      {
        id: "badge-003",
        name: "Master Strategist",
        icon: "🧠"
      }
    ]
  };
};

export default function UserProfile() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 animate-pulse">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded w-3/4 mb-6"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-center text-gray-500">User profile not available</p>
      </div>
    );
  }

  // Calculate experience percentage for progress bar
  const experiencePercentage = Math.round((profile.experience.current / profile.experience.next) * 100);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col items-center">
        <div className="relative">
          <Image
            src={profile.avatar}
            alt={profile.username}
            width={96}
            height={96}
            className="rounded-full border-4 border-blue-100"
          />
          <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {profile.level}
          </div>
        </div>
        
        <h3 className="mt-4 text-xl font-semibold">{profile.username}</h3>
        <p className="text-gray-500 text-sm">Member since {new Date(profile.memberSince).toLocaleDateString()}</p>
        
        <div className="mt-4 w-full">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>XP: {profile.experience.current.toLocaleString()}</span>
            <span>{profile.experience.next.toLocaleString()}</span>
          </div>
          <div
            className={`w-full bg-gray-200 rounded-full h-2.5 ${styles.xpTrack}`}
            ref={(el) => {
              if (el) {
                el.style.setProperty('--xp-pct', `${experiencePercentage}%`);
              }
            }}
          >
            <div className={`bg-blue-600 h-2.5 rounded-full ${styles.xpBar}`}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            {profile.experience.next - profile.experience.current} XP to level {profile.level + 1}
          </p>
        </div>
        
        <div className="mt-4 w-full">
          <p className="text-sm font-medium text-gray-700">Preferred Faction: <span className="font-semibold">{profile.preferredFaction}</span></p>
        </div>
        
        {profile.badges.length > 0 && (
          <div className="mt-4 w-full">
            <p className="text-sm font-medium text-gray-700 mb-2">Badges:</p>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map(badge => (
                <div 
                  key={badge.id}
                  className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                  title={badge.name}
                >
                  <span className="mr-1">{badge.icon}</span>
                  <span className="text-xs">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <Link 
          href="/profile" 
          className="mt-6 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
}