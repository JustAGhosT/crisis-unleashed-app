"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import StepIndicator from './advanced-form/StepIndicator';
import PersonalInfoStep from './advanced-form/PersonalInfoStep';
import DeckConfigurationStep from './advanced-form/DeckConfigurationStep';
import FactionSelectionStep from './advanced-form/FactionSelectionStep';
import ReviewStep from './advanced-form/ReviewStep';

// Define the form data structure
export interface AdvancedFormData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: Date;
  experience: string;
  
  // Faction Selection
  selectedFaction?: string;
  factionReason: string;
  
  // Deck Configuration
  deckName: string;
  deckStyle: string;
  preferredCards: string[];
  customRules: boolean;
  ruleDescription: string;
}

// Define the steps in our multi-step form
type FormStep = 'personalInfo' | 'factionSelection' | 'deckConfiguration' | 'review';

export default function AdvancedFormExample() {
  // Form state
  const [formData, setFormData] = useState<AdvancedFormData>({
    firstName: '',
    lastName: '',
    email: '',
    experience: '',
    selectedFaction: '',
    factionReason: '',
    deckName: '',
    deckStyle: '',
    preferredCards: [],
    customRules: false,
    ruleDescription: ''
  });
  
  // Current step state
  const [currentStep, setCurrentStep] = useState<FormStep>('personalInfo');
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Step validation state
  const [stepValidationErrors, setStepValidationErrors] = useState<Record<string, boolean>>({
    personalInfo: false,
    factionSelection: false,
    deckConfiguration: false,
    review: false
  });
  
  // Update form data
  const updateFormData = (newData: Partial<AdvancedFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };
  
  // Navigate to next step
  const goToNextStep = (currentValidationResult: boolean = true) => {
    // Update validation state for current step
    setStepValidationErrors(prev => ({
      ...prev,
      [currentStep]: !currentValidationResult
    }));
    
    // Only proceed if validation passed
    if (!currentValidationResult) return;
    
    // Navigate to next step based on current step
    switch (currentStep) {
      case 'personalInfo':
        setCurrentStep('factionSelection');
        break;
      case 'factionSelection':
        setCurrentStep('deckConfiguration');
        break;
      case 'deckConfiguration':
        setCurrentStep('review');
        break;
      case 'review':
        handleSubmit();
        break;
    }
  };
  
  // Navigate to previous step
  const goToPreviousStep = () => {
    switch (currentStep) {
      case 'factionSelection':
        setCurrentStep('personalInfo');
        break;
      case 'deckConfiguration':
        setCurrentStep('factionSelection');
        break;
      case 'review':
        setCurrentStep('deckConfiguration');
        break;
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };
  
  // Render the appropriate step component
  const renderStepContent = () => {
    switch (currentStep) {
      case 'personalInfo':
        return (
          <PersonalInfoStep 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={goToNextStep}
            hasValidationError={stepValidationErrors.personalInfo}
          />
        );
      case 'factionSelection':
        return (
          <FactionSelectionStep 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 'deckConfiguration':
        return (
          <DeckConfigurationStep 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 'review':
        return (
          <ReviewStep 
            formData={formData} 
            onSubmit={goToNextStep}
            onBack={goToPreviousStep}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };
  
  // If form is submitted, show success message
  if (isSubmitted) {
    return (
      <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-800 dark:text-green-300">Registration Complete!</AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-400">
          Your player profile has been created successfully. Your deck &quot;{formData.deckName}&quot; with the {formData.selectedFaction} faction is ready for battle!
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <StepIndicator 
        steps={[
          { id: 'personalInfo', label: 'Personal Info' },
          { id: 'factionSelection', label: 'Faction Selection' },
          { id: 'deckConfiguration', label: 'Deck Configuration' },
          { id: 'review', label: 'Review' }
        ]}
        currentStep={currentStep}
        errors={stepValidationErrors}
      />
      
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        {renderStepContent()}
      </Card>
    </div>
  );
}