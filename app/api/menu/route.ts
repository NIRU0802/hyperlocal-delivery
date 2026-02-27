import { NextResponse } from 'next/server';
import menus from '@/components/data/menus.json';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(request: Request) {
  await delay(200);
  
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get('restaurantId');

  if (restaurantId) {
    const restaurantMenu = menus.filter(m => m.restaurantId === restaurantId);
    return NextResponse.json(restaurantMenu);
  }

  return NextResponse.json(menus);
}
