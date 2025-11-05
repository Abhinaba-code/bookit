import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
     <div className="border rounded-lg p-4 flex gap-4">
            <Skeleton className="w-48 h-32" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="w-1/4 space-y-2">
                 <Skeleton className="h-8 w-3/4  ml-auto" />
                 <Skeleton className="h-4 w-1/2 ml-auto" />
            </div>
        </div>
  );
}
