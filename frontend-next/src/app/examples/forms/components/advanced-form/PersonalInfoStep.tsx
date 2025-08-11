"use client";

import React, { useState } from 'react';
import { z } from 'zod';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextInput, DatePicker, RadioGroup } from '@/components/forms';
import { AdvancedFormData } from '../AdvancedFormExample';

interface PersonalInfoStepProps {
  formData: AdvancedFormData;
  updateFormData: (data: Partial<AdvancedFormData>) => void;
  onNext: (isValid: boolean) => void;
  hasValidationError: boolean;
}

// Define validation schema for this step
const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.date().optional(),
  experience: z.string().min(1, "Please select your experience level")
});

export default function PersonalInfoStep({
  formData,
  updateFormData,
  onNext,
  hasValidationError
}: PersonalInfoStepProps) {
  // Local validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  
  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    updateFormData({ dateOfBirth: date });
    
    // Clear error for this field
    if (errors.dateOfBirth) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dateOfBirth;
        return newErrors;
      });
    }
  };
  
  // Handle radio group change
  const handleExperienceChange = (value: string) => {
    updateFormData({ experience: value });
    
    // Clear error for this field
    if (errors.experience) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.experience;
        return newErrors;
      });
    }
  };
  
  // Validate this step and proceed
  const validateAndProceed = () => {
    try {
      personalInfoSchema.parse(formData);
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
  
  // Experience level options
  const experienceOptions = [
    { value: 'beginner', label: 'Beginner', description: 'New to card games' },
    { value: 'intermediate', label: 'Intermediate', description: 'Played similar games before' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced player' },
    { value: 'expert', label: 'Expert', description: 'Competitive player' }
  ];
  
  return (
    <>
      <CardContent className="pt-6 space-y-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            id="firstName"
            name="firstName"
            label="First Name"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />
          
          <TextInput
            id="lastName"
            name="lastName"
            label="Last Name"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
        </div>
        
        <TextInput
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        
        <DatePicker
          id="dateOfBirth"
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChange={handleDateChange}
          maxDate={new Date()} // Can't select future dates
          description="Optional: Used to verify age requirements for tournaments"
          error={errors.dateOfBirth}
        />
        
        <RadioGroup
          id="experience"
          label="Experience Level"
          options={experienceOptions}
          value={formData.experience}
          onChange={handleExperienceChange}
          error={errors.experience}
          required
        />
      </CardContent>
      
      <CardFooter className="flex justify-end border-t p-6 dark:border-gray-700">
        <Button onClick={validateAndProceed}>
          Continue
        </Button>
      </CardFooter>
    </>
  );
}