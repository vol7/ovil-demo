import { LookupForm } from "@/components/LookupForm"
import { PageHeader } from "@/components/PageHeader"
import { RecentLookupsTable } from "@/components/RecentLookupsTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Lookup() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vehicle lookup"
        description="Retrieve the registration record and run record checks before issuing a used vehicle information package."
      />
      <Card>
        <CardContent>
          <LookupForm size="lg" />
        </CardContent>
      </Card>
      <Card className="gap-0 py-0">
        <CardHeader className="border-b py-4">
          <CardTitle>Recent lookups</CardTitle>
          <CardDescription>Select a row to reopen the record.</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          <RecentLookupsTable />
        </CardContent>
      </Card>
    </div>
  )
}
