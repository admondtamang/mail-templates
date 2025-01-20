import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }

) {
  const id = (await params).id;
  const template = await prisma.emailTemplate.findUnique({
    where: { id },
  });


  return NextResponse.json(template);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }

) {
  const id = (await params).id;
  const data = await req.json();

  console.log(data,id);
  const template = await prisma.emailTemplate.update({
    where: { id},
    data,
  });
  return NextResponse.json(template);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  await prisma.emailTemplate.delete({
    where: { id},
  });
  return NextResponse.json({ success: true });
}