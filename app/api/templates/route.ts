import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';

  const skip = (page - 1) * limit;

  const templates = await prisma.emailTemplate.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ],
    },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.emailTemplate.count({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ],
    },
  });

  return NextResponse.json({
    templates,
    total,
    pages: Math.ceil(total / limit),
  });
}

export async function POST(req: Request) {
  const data = await req.json();
  const template = await prisma.emailTemplate.create({
    data,
  });
  return NextResponse.json(template);
}