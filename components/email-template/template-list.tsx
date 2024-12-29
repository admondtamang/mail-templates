"use client";

import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Pencil, Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import axios, { AxiosResponse } from 'axios'
import { TemplateSchemaType } from './schema';
import { useRouter } from 'next/navigation';

type TemplateSchemaDatabaseType = TemplateSchemaType &  { id:string; createdAt: string}

type TemplateResponse={
  data: TemplateSchemaDatabaseType[],
  total: number,
  pages: number,
}

export function TemplateList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const router=useRouter();
  const limit = 10;

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates', page, search],
    queryFn: async () => {
      const { data }: AxiosResponse<TemplateResponse> = await axios(
        `/api/templates?page=${page}&limit=${limit}&search=${search}`
      );

      return data
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates?.data?.map((template) => (
              <TableRow key={template?.id}>
                <TableCell>{template.name}</TableCell>
                <TableCell>{template.subject}</TableCell>
                <TableCell>{Array.isArray(template?.sendTo) && template.sendTo?.map((name)=> (
                  <span key={name}>{name}</span>
                ))}</TableCell>
                <TableCell>
                  {new Date(template?.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/templates/${template.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/templates/${template.id}`)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div>
          Showing {(page - 1) * limit + 1} to{' '}
          {Math.min(page * limit, templates?.total || 0)} of {templates?.total} results
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= (templates?.pages || 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}