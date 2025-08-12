"use client";

import React, { useState } from 'react';
import { z } from 'zod';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextInput, TextArea, SelectInput, SwitchInput } from '@/components/forms';
import { AdvancedFormData } from '../AdvancedFormExample';
import { Plus, X } from 'lucide-react';

interface DeckConfigurationStepProps {
  formData: AdvancedFormData;
  updateFormData: (data: Partial<AdvancedFormData>) => void;
  onNext: (isValid: boolean) => void;
  onBack: () => void;
}

// Define validation schema for this step
const deckConfigurationSchema = z.object({
  deckName: z.string().min(3, "Deck name must be at least 3 characters"),
  deckStyle: z.string().min(1, "Please select a deck style"),
  preferredCards: z.array(z.string()).min(1, "Please select at least one preferred card"),
  customRules: z.boolean(),
  ruleDescription: z.string().optional()
}).refine(data => {
  // If custom rules is enabled, rule description is required
  if (data.customRules && (!data.ruleDescription || data.ruleDescription.length < 10)) {
    return false;
  }
  return true;
}, {
  message: "Please provide a description of your custom rules (at least 10 characters)",
  path: ["ruleDescription"]
});

export default function DeckConfigurationStep({
  formData,
  updateFormData,
  onNext,
  onBack
}: DeckConfigurationStepProps) {
  // Local validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newCard, setNewCard] = useState('');
  
  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle deck style selection
  const handleDeckStyleChange = (value: string) => {
    updateFormData({ deckStyle: value });
    
    // Clear error for this field
    if (errors.deckStyle) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.deckStyle;
        return newErrors;
      });
    }
  };
  
  // Handle custom rules toggle
  const handleCustomRulesChange = (checked: boolean) => {
    updateFormData({ customRules: checked });
    
    // If turning off custom rules, clear any errors
    if (!checked && errors.ruleDescription) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.ruleDescription;
        return newErrors;
      });
    }
  };
  
  // Add a preferred card
  const addPreferredCard = () => {
    if (newCard.trim() && !formData.preferredCards.includes(newCard.trim())) {
      const updatedCards = [...formData.preferredCards, newCard.trim()];
      updateFormData({ preferredCards: updatedCards });
      setNewCard('');
      
      // Clear error for this field
      if (errors.preferredCards) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.preferredCards;
          return newErrors;
        });
      }
    }
  };
  
  // Remove a preferred card
  const removePreferredCard = (card: string) => {
    const updatedCards = formData.preferredCards.filter(c => c !== card);
    updateFormData({ preferredCards: updatedCards });
  };
  
  // Handle Enter key in the new card input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPreferredCard();
    }
  };
  
  // Validate this step and proceed
  const validateAndProceed = () => {
    try {
      deckConfigurationSchema.parse(formData);
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
  
  // Deck style options
  const deckStyleOptions = [
    { value: 'aggressive', label: 'Aggressive' },
    { value: 'control', label: 'Control' },
    { value: 'midrange', label: 'Midrange' },
    { value: 'combo', label: 'Combo' },
    { value: 'tempo', label: 'Tempo' }
  ];
  
  return (
    <>
      <CardContent className="pt-6 space-y-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Deck Configuration</h2>
        
        <TextInput
          id="deckName"
          name="deckName"
          label="Deck Name"
          placeholder="Enter a name for your deck"
          value={formData.deckName}
          onChange={handleChange}
          error={errors.deckName}
          required
        />
        
        <SelectInput
          id="deckStyle"
          label="Deck Style"
          options={deckStyleOptions}
          value={formData.deckStyle}
          onChange={handleDeckStyleChange}
          placeholder="Select your preferred play style"
          error={errors.deckStyle}
          required
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Preferred Cards
            {errors.preferredCards && (
              <span className="text-sm text-red-500 dark:text-red-400 ml-2">
                {errors.preferredCards}
              </span>
            )}
          </label>
          
          <div className="flex space-x-2">
            <TextInput
              id="newCard"
              placeholder="Add a card you want in your deck"
              value={newCard}
              onChange={(e) => setNewCard(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={addPreferredCard}
              disabled={!newCard.trim()}
              size="icon"
              aria-label="Add preferred card"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {formData.preferredCards.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.preferredCards.map((card, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                >
                  {card}
                  <button
                    type="button"
                    onClick={() => removePreferredCard(card)}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    aria-label={`Remove ${card}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add cards you definitely want included in your deck
          </p>
        </div>
        
        <SwitchInput
          id="customRules"
          label="Enable Custom Rules"
          checked={formData.customRules}
          onChange={handleCustomRulesChange}
          description="Specify custom rules for your deck (optional)"
        />
        
        {formData.customRules && (
          <TextArea
            id="ruleDescription"
            name="ruleDescription"
            label="Custom Rules Description"
            placeholder="Describe your custom rules here..."
            value={formData.ruleDescription}
            onChange={handleChange}
            error={errors.ruleDescription}
            rows={3}
            maxLength={300}
            showCharacterCount
            required
          />
        )}
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