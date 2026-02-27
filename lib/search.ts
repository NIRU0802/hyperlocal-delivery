export interface SearchableItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  subcategory?: string;
}

export function searchItems<T extends SearchableItem>(
  query: string,
  dataset: T[],
  options: {
    searchFields?: (keyof T)[];
    caseSensitive?: boolean;
  } = {}
): T[] {
  const { searchFields = ['name', 'description'], caseSensitive = false } = options;
  
  if (!query.trim()) {
    return dataset;
  }

  const normalizedQuery = caseSensitive ? query : query.toLowerCase();
  
  return dataset.filter(item => {
    return searchFields.some(field => {
      const value = item[field];
      if (typeof value !== 'string') return false;
      const normalizedValue = caseSensitive ? value : value.toLowerCase();
      return normalizedValue.includes(normalizedQuery);
    });
  });
}

export function searchDishes(query: string, menuItems: SearchableItem[]): SearchableItem[] {
  return searchItems(query, menuItems, {
    searchFields: ['name', 'description', 'category'],
  });
}

export function searchProducts(query: string, products: SearchableItem[]): SearchableItem[] {
  return searchItems(query, products, {
    searchFields: ['name', 'description', 'category', 'subcategory'],
  });
}

export function searchRestaurants(query: string, restaurants: SearchableItem[]): SearchableItem[] {
  return searchItems(query, restaurants, {
    searchFields: ['name', 'description', 'category'],
  });
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
