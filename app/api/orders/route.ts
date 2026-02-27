import { NextResponse } from 'next/server';
import orders from '@/components/data/orders.json';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(request: Request) {
  await delay(300);
  
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');

  let filtered = [...orders];

  if (userId) {
    filtered = filtered.filter(o => o.userId === userId);
  }

  if (status) {
    filtered = filtered.filter(o => o.status === status);
  }

  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  await delay(500);
  
  const body = await request.json();
  const newOrder = {
    ...body,
    id: `order_${Date.now()}`,
    orderNumber: `QB-${1000 + orders.length + 1}`,
    status: 'placed',
    paymentStatus: 'paid',
    placedAt: new Date().toISOString(),
    timeline: [
      { status: 'placed', timestamp: new Date().toISOString(), message: 'Order placed successfully' }
    ]
  };

  orders.push(newOrder);
  return NextResponse.json(newOrder);
}
