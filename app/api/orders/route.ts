import { NextResponse } from 'next/server';
import orders from '@/components/data/orders.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  let filtered = [...orders];

  if (userId) {
    filtered = filtered.filter(o => o.userId === userId);
  }

  if (status) {
    filtered = filtered.filter(o => o.status === status);
  }

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    data: paginated,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit)
    }
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  });
}

export async function POST(request: Request) {
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
