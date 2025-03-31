import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <div className="flex w-full max-w-lg mx-auto mb-8 gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <Skeleton className="h-40 w-40 rounded-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-8 w-full" />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-40 mb-2" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-4">
              <Skeleton className="h-12 w-20 mb-2" />
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-48" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-36 mb-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="health" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="health">
            <Skeleton className="h-4 w-32" />
          </TabsTrigger>
          <TabsTrigger value="emergency">
            <Skeleton className="h-4 w-32" />
          </TabsTrigger>
          <TabsTrigger value="tips">
            <Skeleton className="h-4 w-32" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="health" className="space-y-4 mt-6">
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-16 w-full mb-2" />
          <Skeleton className="h-16 w-full" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

