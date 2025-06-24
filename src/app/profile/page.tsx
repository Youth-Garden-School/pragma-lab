'use client'
import React from 'react';
import { ProfileForm } from '@/feature/user/components/ProfileForm';
import Footer from '@/components/Common/Layout/Footer';
import Header from '@/components/Common/Layout/Header';

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="mt-[200px]">
        <Header />
      </div>
      <div className="mb-[120px]">
        <ProfileForm />
      </div>  
      <Footer />
    </div>
  );
};

export default ProfilePage;
