import { NextResponse } from 'next/server';
import menus from '@/components/data/menus.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get('restaurantId');

  if (restaurantId) {
    const restaurantMenu = menus.filter(m => m.restaurantId === restaurantId);
    return NextResponse.json(restaurantMenu, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  }

  return NextResponse.json(menus, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  });
}
