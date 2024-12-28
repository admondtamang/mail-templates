import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const template = await prisma.emailTemplate.findUnique({
    where: { id: params.id },
  });
  return NextResponse.json(template);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const template = await prisma.emailTemplate.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(template);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.emailTemplate.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ success: true });
}