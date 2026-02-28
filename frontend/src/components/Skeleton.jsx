
export function ProductCardSkeleton() {
    return (
        <div className="card animate-pulse">
            
            <div className="h-48 skeleton" />
            <div className="p-4 space-y-3">
                <div className="h-3 skeleton w-1/3" />
                <div className="h-5 skeleton w-3/4" />
                <div className="h-3 skeleton w-full" />
                <div className="h-3 skeleton w-2/3" />
                <div className="flex justify-between items-center mt-3">
                    <div className="h-6 skeleton w-20" />
                    <div className="h-9 skeleton w-24 rounded-lg" />
                </div>
            </div>
        </div>
    )
}

export function ProductGridSkeleton({ count = 6 }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    )
}

export function ProductDetailSkeleton() {
    return (
        <div className="max-w-4xl mx-auto p-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-96 skeleton rounded-xl" />
                <div className="space-y-4">
                    <div className="h-4 skeleton w-1/4" />
                    <div className="h-8 skeleton w-3/4" />
                    <div className="h-4 skeleton w-full" />
                    <div className="h-4 skeleton w-full" />
                    <div className="h-4 skeleton w-2/3" />
                    <div className="h-10 skeleton w-1/3 mt-4" />
                    <div className="h-12 skeleton w-full rounded-lg mt-6" />
                </div>
            </div>
        </div>
    )
}

export function LineSkeleton({ width = 'w-full', height = 'h-4' }) {
    return <div className={`${height} skeleton ${width}`} />
}
