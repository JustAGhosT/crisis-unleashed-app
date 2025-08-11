"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function GamePreferencesForm() {
  const [gameSounds, setGameSounds] = useState(true);
  const [gameMusic, setGameMusic] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to save preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Success handling would be done in the parent component
    } catch (error) {
      console.error("Failed to save preferences:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-white">Game Preferences</h3>
        <p className="text-gray-400">Configure your in-game preferences and settings</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Game Sounds</h4>
            <p className="text-sm text-gray-400">Enable or disable game sound effects</p>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={gameSounds}
                onChange={() => setGameSounds(!gameSounds)}
                aria-label="Toggle game sounds"
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Game Music</h4>
            <p className="text-sm text-gray-400">Enable or disable background music</p>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={gameMusic}
                onChange={() => setGameMusic(!gameMusic)}
                aria-label="Toggle game music"
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Animations</h4>
            <p className="text-sm text-gray-400">Enable or disable card animations</p>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={animations}
                onChange={() => setAnimations(!animations)}
                aria-label="Toggle animations"
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      <Button 
        type="submit"
        className="mt-4"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Preferences"}
      </Button>
    </form>
  );
}