'use client';

import type React from 'react';

import { BarChart3, Shield, TrendingUp } from 'lucide-react';

export default function LoginHero() {
  return (
    <div className="hidden space-y-8 lg:block">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h1 className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-3xl font-bold text-transparent">
            Budget Tracker
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Take control of your finances with intelligent budgeting
        </p>
      </div>

      <div className="space-y-6">
        <FeatureItem
          icon={
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          }
          title="Smart Analytics"
          description="Get insights into your spending patterns and financial trends"
          bgColor="bg-blue-100 dark:bg-blue-900/30"
        />

        <FeatureItem
          icon={
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          }
          title="Goal Tracking"
          description="Set and monitor your savings goals with visual progress tracking"
          bgColor="bg-green-100 dark:bg-green-900/30"
        />

        <FeatureItem
          icon={
            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          }
          title="Secure & Private"
          description="Your financial data is protected with enterprise-grade security"
          bgColor="bg-purple-100 dark:bg-purple-900/30"
        />
      </div>
    </div>
  );
}

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

function FeatureItem({ icon, title, description, bgColor }: FeatureItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div
        className={`h-10 w-10 ${bgColor} flex items-center justify-center rounded-lg`}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}
