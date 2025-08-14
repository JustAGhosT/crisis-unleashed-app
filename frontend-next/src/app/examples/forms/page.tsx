"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BasicFormExample from "./components/BasicFormExample";
import ValidationFormExample from "./components/ValidationFormExample";
import AdvancedFormExample from "./components/AdvancedFormExample";
import FormComponentsShowcase from "./components/FormComponentsShowcase";

export default function FormsExamplePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 dark:text-white">
        Form Components
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        A showcase of reusable form components for building complex forms with
        validation.
      </p>

      <Tabs defaultValue="showcase" className="w-full">
        <TabsList className="mb-6 dark:bg-gray-800">
          <TabsTrigger
            value="showcase"
            className="dark:data-[state=active]:bg-gray-700"
          >
            Components Showcase
          </TabsTrigger>
          <TabsTrigger
            value="basic"
            className="dark:data-[state=active]:bg-gray-700"
          >
            Basic Form
          </TabsTrigger>
          <TabsTrigger
            value="validation"
            className="dark:data-[state=active]:bg-gray-700"
          >
            Form with Validation
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="dark:data-[state=active]:bg-gray-700"
          >
            Advanced Form
          </TabsTrigger>
        </TabsList>

        <TabsContent value="showcase">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Form Components Showcase
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                Individual examples of each form component with their
                variations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormComponentsShowcase />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="basic">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Basic Form Example
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                A simple form with basic inputs and submission handling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BasicFormExample />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Form with Validation
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                A form with client-side validation using Zod schema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ValidationFormExample />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Advanced Form Example
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                A complex form with conditional fields, multi-step flow, and
                file uploads.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedFormExample />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
