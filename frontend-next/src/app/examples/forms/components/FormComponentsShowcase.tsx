"use client";

import React, { useState } from 'react';
import {
  TextInput,
  TextArea,
  SelectInput,
  CheckboxInput,
  RadioGroup,
  FileInput,
  SwitchInput,
  DatePicker,
  SliderInput
} from '@/components/forms';
import { Separator } from '@/components/ui/separator';

export default function FormComponentsShowcase() {
  // State for each component
  const [textValue, setTextValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('');
  const [switchValue, setSwitchValue] = useState(false);
  const [dateValue, setDateValue] = useState<Date>();
  const [sliderValue, setSliderValue] = useState([50]);

  // Options for select and radio
  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const radioOptions = [
    { value: 'radio1', label: 'Radio Option 1', description: 'Description for option 1' },
    { value: 'radio2', label: 'Radio Option 2', description: 'Description for option 2' },
    { value: 'radio3', label: 'Radio Option 3', description: 'Description for option 3' },
  ];

  return (
    <div className="space-y-10">
      {/* Text Inputs */}
      <div>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Text Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            id="text-input-example"
            label="Text Input"
            placeholder="Enter some text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            description="A standard text input field"
          />

          <TextInput
            id="email-input-example"
            label="Email Input"
            type="email"
            placeholder="Enter your email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            leftIcon={
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />

          <TextInput
            id="password-input-example"
            label="Password Input"
            type="password"
            placeholder="Enter your password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            required
          />

          <TextInput
            id="error-input-example"
            label="Input with Error"
            placeholder="This input has an error"
            value=""
            error="This field is required"
          />
        </div>
      </div>

      <Separator className="my-6 dark:bg-gray-700" />

      {/* TextArea */}
      <div>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Text Area</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextArea
            id="textarea-example"
            label="Text Area"
            placeholder="Enter longer text here..."
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            rows={4}
          />

          <TextArea
            id="textarea-counter-example"
            label="Text Area with Character Count"
            placeholder="Limited to 100 characters..."
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            maxLength={100}
            showCharacterCount
            description="Use this for longer descriptions"
          />
        </div>
      </div>

      <Separator className="my-6 dark:bg-gray-700" />

      {/* Select Input */}
      <div>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Select Input</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            id="select-example"
            label="Select Input"
            options={selectOptions}
            value={selectValue}
            onChange={setSelectValue}
            placeholder="Choose an option"
          />

          <SelectInput
            id="select-error-example"
            label="Select with Error"
            options={selectOptions}
            value=""
            error="Please select an option"
            required
          />
        </div>
      </div>

      <Separator className="my-6 dark:bg-gray-700" />

      {/* Checkbox and Radio */}
      <div>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Checkbox and Radio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <CheckboxInput
              id="checkbox-example"
              label="Checkbox Input"
              checked={checkboxValue}
              onChange={setCheckboxValue}
              description="A simple checkbox with description"
            />

            <div className="mt-4">
              <CheckboxInput
                id="checkbox-error-example"
                label="Checkbox with Error"
                checked={false}
                error="This checkbox is required"
              />
            </div>
          </div>

          <RadioGroup
            id="radio-example"
            label="Radio Group"
            options={radioOptions}
            value={radioValue}
            onChange={setRadioValue}
            description="Select one of the options"
          />
        </div>
      </div>

      <Separator className="my-6 dark:bg-gray-700" />

      {/* Switch Input */}
      <div>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Switch Input</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SwitchInput
            id="switch-example"
            label="Switch Input"
            checked={switchValue}
            onChange={setSwitchValue}
            description="Toggle this switch to enable the feature"
          />

          <SwitchInput
            id="switch-disabled-example"
            label="Disabled Switch"
            checked={true}
            disabled
            description="This switch is disabled and cannot be changed"
          />
        </div>
      </div>

      <Separator className="my-6 dark:bg-gray-700" />

      {/* Date Picker */}
      <div>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Date Picker</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DatePicker
            id="date-example"
            label="Date Picker"
            value={dateValue}
            onChange={setDateValue}
            description="Select a date from the calendar"
          />

          <DatePicker
            id="date-range-example"
            label="Date Picker with Range Limits"
            value={dateValue}
            onChange={setDateValue}
            minDate={new Date(2023, 0, 1)}
            maxDate={new Date(2023, 11, 31)}
            description="Limited to dates in 2023"
          />
        </div>
      </div>

      <Separator className="my-6 dark:bg-gray-700" />

      {/* Slider Input */}
      <div>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Slider Input</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            id="slider-example"
            label="Slider Input"
            value={sliderValue}
            onChange={setSliderValue}
            min={0}
            max={100}
            step={1}
            description="Drag the slider to select a value"
          />

          <SliderInput
            id="slider-prefix-example"
            label="Slider with Prefix and Suffix"
            value={sliderValue}
            onChange={setSliderValue}
            min={0}
            max={100}
            step={5}
            valuePrefix="$"
            valueSuffix=".00"
            description="Price slider with currency formatting"
          />
        </div>
      </div>

      <Separator className="my-6 dark:bg-gray-700" />

      {/* File Input */}
      <div>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">File Input</h2>
        <div className="grid grid-cols-1 gap-6">
          <FileInput
            id="file-example"
            label="File Input"
            accept="image/*"
            onChange={() => {}}
            description="Upload an image file (JPG, PNG, etc.)"
          />
        </div>
      </div>
    </div>
  );
}