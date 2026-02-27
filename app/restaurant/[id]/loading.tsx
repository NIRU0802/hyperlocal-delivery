'use client';

export default function RestaurantLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-64">
        <div className="absolute inset-0 bg-gray-300 animate-pulse" />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-4 mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="flex gap-4">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
        </div>
        <div className="space-y-8">
          {[1, 2, 3].map(category => (
            <div key={category}>
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map(item => (
                  <div key={item} className="bg-white rounded-2xl p-4 flex gap-4 animate-pulse">
                    <div className="flex-1">
                      <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </div>
                    <div className="w-28 h-28 bg-gray-200 rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
