"use client";

import React from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdvancedFormData } from "../AdvancedFormExample";
import { format } from "date-fns";

interface ReviewStepProps {
  formData: AdvancedFormData;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function ReviewStep({
  formData,
  onSubmit,
  onBack,
  isSubmitting,
}: ReviewStepProps) {
  // Format date for display
  const formattedDate = formData.dateOfBirth
    ? format(formData.dateOfBirth, "MMMM d, yyyy")
    : "Not provided";

  // Get faction name from ID
  const getFactionName = (factionId: string): string => {
    const factionMap: Record<string, string> = {
      solaris: "Solaris Nexus",
      umbral: "Umbral Eclipse",
      aeonic: "Aeonic Dominion",
      primordial: "Primordial Genesis",
      infernal: "Infernal Core",
      neuralis: "Neuralis Conclave",
      synthetic: "Synthetic Directive",
    };
    return factionMap[factionId] || factionId;
  };

  // Get deck style name
  const getDeckStyleName = (styleId: string): string => {
    const styleMap: Record<string, string> = {
      aggressive: "Aggressive",
      control: "Control",
      midrange: "Midrange",
      combo: "Combo",
      tempo: "Tempo",
    };
    return styleMap[styleId] || styleId;
  };

  return (
    <>
      <CardContent className="pt-6 space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Review Your Information
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please review your information before submitting. You can go back to
            make changes if needed.
          </p>
        </div>

        {/* Personal Information Section */}
        <div>
          <h3 className="text-lg font-medium mb-3 border-b pb-2 dark:text-white dark:border-gray-700">
            Personal Information
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Name
              </dt>
              <dd className="mt-1 text-gray-900 dark:text-white">
                {formData.firstName} {formData.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </dt>
              <dd className="mt-1 text-gray-900 dark:text-white">
                {formData.email}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Date of Birth
              </dt>
              <dd className="mt-1 text-gray-900 dark:text-white">
                {formattedDate}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Experience Level
              </dt>
              <dd className="mt-1 text-gray-900 dark:text-white capitalize">
                {formData.experience}
              </dd>
            </div>
          </dl>
        </div>

        {/* Faction Selection Section */}
        <div>
          <h3 className="text-lg font-medium mb-3 border-b pb-2 dark:text-white dark:border-gray-700">
            Faction Selection
          </h3>
          <dl className="grid grid-cols-1 gap-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Selected Faction
              </dt>
              <dd className="mt-1 text-gray-900 dark:text-white">
                {getFactionName(formData.selectedFaction || "")}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Reason for Selection
              </dt>
              <dd className="mt-1 text-gray-900 dark:text-white whitespace-pre-wrap">
                {formData.factionReason}
              </dd>
            </div>
          </dl>
        </div>

        {/* Deck Configuration Section */}
        <div>
          <h3 className="text-lg font-medium mb-3 border-b pb-2 dark:text-white dark:border-gray-700">
            Deck Configuration
          </h3>
          <dl className="grid grid-cols-1 gap-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Deck Name
              </dt>
              <dd className="mt-1 text-gray-900 dark:text-white">
                {formData.deckName}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Deck Style
              </dt>
              <dd className="mt-1 text-gray-900 dark:text-white">
                {getDeckStyleName(formData.deckStyle)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Preferred Cards
              </dt>
              <dd className="mt-1">
                <div className="flex flex-wrap gap-2">
                  {formData.preferredCards.map((card, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                    >
                      {card}
                    </span>
                  ))}
                </div>
              </dd>
            </div>
            {formData.customRules && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Custom Rules
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-white whitespace-pre-wrap">
                  {formData.ruleDescription}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t p-6 dark:border-gray-700">
        <Button
          variant="outline"
          onClick={onBack}
          className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </CardFooter>
    </>
  );
}
