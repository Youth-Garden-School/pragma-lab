'use client'
import React from 'react';
import { SettingsForm } from '@/feature/user/components/SettingsForm';
import Footer from '@/components/Common/Layout/Footer';
import Header from '@/components/Common/Layout/Header';

const SettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="mt-[200px]">
        <Header />
      </div>
      <div className="mb-[120px]">
        <SettingsForm />
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage;
