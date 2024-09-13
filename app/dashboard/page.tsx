import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Book, FileText, BarChart2, Users } from "lucide-react"
import { ReactNode } from 'react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm">Logged in as: hr@gmail.com (hr)</p>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <h2 className="text-3xl font-bold mb-6">HR Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Document Upload"
            description="Upload and manage HR documents"
            icon={<Upload className="h-6 w-6" />}
          />
          <DashboardCard
            title="Query Labor Laws"
            description="Search and review labor laws"
            icon={<Book className="h-6 w-6" />}
          />
          <DashboardCard
            title="Generate HR Document"
            description="Create custom HR documents"
            icon={<FileText className="h-6 w-6" />}
          />
          <DashboardCard
            title="Performance Review Analysis"
            description="Analyze employee performance data"
            icon={<BarChart2 className="h-6 w-6" />}
          />
          <DashboardCard
            title="HR Information"
            description="Access HR policies and guidelines"
            icon={<Users className="h-6 w-6" />}
          />
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Welcome to the HR Dashboard</h3>
          <p className="text-muted-foreground">
            Here you can manage your HR tasks and access various tools.
          </p>
        </div>
      </main>
    </div>
  )
}

function DashboardCard({ title, description, icon }: {
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <div className="p-4">
        <Button className="w-full">Access</Button>
      </div>
    </Card>
  )
}