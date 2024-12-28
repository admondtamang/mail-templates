"use client";

import { TemplateList } from '@/components/email-template/template-list';
// import { TemplateList } from '@/components/email-template/template-list';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function Home() {

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <Link href="/templates/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </Link>
      </div>

      <TemplateList />
    </div>
  );
}