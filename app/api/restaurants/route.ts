import { NextResponse } from 'next/server';
import restaurants from '@/components/data/restaurants.json';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(request: Request) {
  await delay(300);
  
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase();
  const cuisine = searchParams.get('cuisine');
  const sort = searchParams.get('sort');

  let filtered = [...restaurants];

  if (query) {
    filtered = filtered.filter(r => 
      r.name.toLowerCase().includes(query) ||
      r.cuisine.some(c => c.toLowerCase().includes(query))
    );
  }

  if (cuisine) {
    filtered = filtered.filter(r => 
      r.cuisine.some(c => c.toLowerCase() === cuisine.toLowerCase())
    );
  }

  if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'deliveryTime') {
    filtered.sort((a, b) => a.deliveryTime - b.deliveryTime);
  } else if (sort === 'distance') {
    filtered.sort((a, b) => a.distance - b.distance);
  }

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  filtered = filtered.map(r => {
    const [openH, openM] = r.openingTime.split(':').map(Number);
    const [closeH, closeM] = r.closingTime.split(':').map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;
    
    const isOpen = currentTime >= openMinutes && currentTime < closeMinutes;
    const isClosingSoon = currentTime >= closeMinutes - 30 && currentTime < closeMinutes;
    
    return {
      ...r,
      isOpen,
      status: !isOpen ? 'closed' : r.busyMode ? 'busy' : isClosingSoon ? 'closing_soon' : 'open'
    };
  });

  return NextResponse.json(filtered);
}
