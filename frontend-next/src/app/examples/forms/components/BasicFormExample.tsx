"use client";

import React, { useState } from 'react';
import { TextInput, TextArea, SelectInput, CheckboxInput } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

export default function BasicFormExample() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    agreeToTerms: false
  });
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToTerms: checked }));
  };
  
  // Handle select changes
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success message
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        agreeToTerms: false
      });
    }, 3000);
  };
  
  // Subject options for select input
  const subjectOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'other', label: 'Other' }
  ];
  
  return (
    <div>
      {isSubmitted ? (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-300">Success!</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            Your message has been sent successfully. We&apos;ll get back to you soon.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              id="name"
              name="name"
              label="Name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <TextInput
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <SelectInput
            id="subject"
            label="Subject"
            options={subjectOptions}
            value={formData.subject}
            onChange={handleSelectChange}
            placeholder="Select a subject"
            required
          />
          
          <TextArea
            id="message"
            name="message"
            label="Message"
            placeholder="Enter your message here..."
            value={formData.message}
            onChange={handleChange}
            rows={5}
            required
          />
          
          <CheckboxInput
            id="terms"
            label="I agree to the terms and conditions"
            checked={formData.agreeToTerms}
            onChange={handleCheckboxChange}
            required
          />
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}