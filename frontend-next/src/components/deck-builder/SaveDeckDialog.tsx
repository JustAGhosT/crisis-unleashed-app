"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextInput, TextArea } from '@/components/forms';

interface SaveDeckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, description: string) => void;
  initialName?: string;
  initialDescription?: string;
}

export default function SaveDeckDialog({
  open,
  onOpenChange,
  onSave,
  initialName = '',
  initialDescription = ''
}: SaveDeckDialogProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [nameError, setNameError] = useState('');
  
  // Update state when props change
  useEffect(() => {
    if (open) {
      setName(initialName);
      setDescription(initialDescription);
      setNameError('');
    }
  }, [open, initialName, initialDescription]);
  
  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value.trim()) {
      setNameError('');
    }
  };
  
  // Handle description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  
  // Handle save
  const handleSave = () => {
    if (!name.trim()) {
      setNameError('Please enter a deck name');
      return;
    }
    
    onSave(name, description);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Save Deck</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Give your deck a name and description to save it.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <TextInput
            id="deck-name"
            label="Deck Name"
            placeholder="Enter a name for your deck"
            value={name}
            onChange={handleNameChange}
            error={nameError}
            required
          />
          
          <TextArea
            id="deck-description"
            label="Description"
            placeholder="Describe your deck strategy and key cards..."
            value={description}
            onChange={handleDescriptionChange}
            rows={4}
            maxLength={500}
            showCharacterCount
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Deck
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}