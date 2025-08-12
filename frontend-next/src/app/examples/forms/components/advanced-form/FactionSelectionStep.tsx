"use client";

import React, { useState } from 'react';
import { z } from 'zod';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextArea, SelectInput } from '@/components/forms';
import { AdvancedFormData } from '../AdvancedFormExample';

interface FactionSelectionStepProps {
  formData: AdvancedFormData;
  updateFormData: (data: Partial<AdvancedFormData>) => void;
  onNext: (isValid: boolean) => void;
  onBack: () => void;
}

// Define validation schema for this step
const factionSelectionSchema = z.object({
  selectedFaction: z.string().min(1, "Please select a faction"),
  factionReason: z.string().min(10, "Please provide a more detailed explanation (at least 10 characters)")
});

export default function FactionSelectionStep({
  formData,
  updateFormData,
  onNext,
  onBack
}: FactionSelectionStepProps) {
  // Local validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle faction selection
  const handleFactionChange = (value: string) => {
    updateFormData({ selectedFaction: value });
    
    // Clear error for this field
    if (errors.selectedFaction) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.selectedFaction;
        return newErrors;
      });
    }
  };
  
  // Handle reason text change
  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ factionReason: e.target.value });
    
    // Clear error for this field
    if (errors.factionReason) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.factionReason;
        return newErrors;
      });
    }
  };
  
  // Validate this step and proceed
  const validateAndProceed = () => {
    try {
      factionSelectionSchema.parse(formData);
      setErrors({});
      onNext(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
        onNext(false);
      }
    }
  };
  
  // Faction options
  const factionOptions = [
    { value: 'solaris', label: 'Solaris Nexus' },
    { value: 'umbral', label: 'Umbral Eclipse' },
    { value: 'aeonic', label: 'Aeonic Dominion' },
    { value: 'primordial', label: 'Primordial Genesis' },
    { value: 'infernal', label: 'Infernal Core' },
    { value: 'neuralis', label: 'Neuralis Conclave' },
    { value: 'synthetic', label: 'Synthetic Directive' }
  ];
  
  return (
    <>
      <CardContent className="pt-6 space-y-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Faction Selection</h2>
        
        <SelectInput
          id="selectedFaction"
          label="Choose Your Faction"
          options={factionOptions}
          value={formData.selectedFaction}
          onChange={handleFactionChange}
          placeholder="Select a faction"
          error={errors.selectedFaction}
          description="Each faction has unique abilities and playstyles"
          required
        />
        
        {formData.selectedFaction && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-md">
            <h3 className="font-medium mb-2 dark:text-white">
              {factionOptions.find(f => f.value === formData.selectedFaction)?.label} Overview
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {getFactionDescription(formData.selectedFaction)}
            </p>
          </div>
        )}
        
        <TextArea
          id="factionReason"
          label="Why did you choose this faction?"
          placeholder="Explain why this faction appeals to you..."
          value={formData.factionReason}
          onChange={handleReasonChange}
          error={errors.factionReason}
          rows={4}
          maxLength={500}
          showCharacterCount
          required
        />
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-6 dark:border-gray-700">
        <Button variant="outline" onClick={onBack} className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
          Back
        </Button>
        <Button onClick={validateAndProceed}>
          Continue
        </Button>
      </CardFooter>
    </>
  );
}

// Helper function to get faction descriptions
function getFactionDescription(factionId: string): string {
  switch (factionId) {
    case 'solaris':
      return 'The Solaris Nexus harnesses the power of solar energy and advanced technology. They excel at energy manipulation and resource generation.';
    case 'umbral':
      return 'The Umbral Eclipse masters the shadows and stealth operations. They specialize in covert tactics and surprise attacks.';
    case 'aeonic':
      return 'The Aeonic Dominion controls the flow of time itself. They can manipulate turn order and accelerate or delay effects.';
    case 'primordial':
      return 'The Primordial Genesis represents raw natural power and adaptation. They grow stronger as the battle progresses.';
    case 'infernal':
      return 'The Infernal Core draws power from sacrifice and risk. They convert their own resources into devastating attacks.';
    case 'neuralis':
      return 'The Neuralis Conclave uses psychic abilities and mind control. They can manipulate opponent decisions and card effects.';
    case 'synthetic':
      return 'The Synthetic Directive employs artificial intelligence and robotics. They build and upgrade their units throughout the game.';
    default:
      return 'Select a faction to see its description.';
  }
}