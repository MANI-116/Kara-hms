import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../packages/ui/src/components/ui/tabs';
import { PatientManagement } from '../../../packages/ui/src/components/PatientManagement';
import { AccountsManagement } from '../../../packages/ui/src/components/AccountsManagement';
import { Toaster } from '../../../packages/ui/src/components/ui/sonner';
import { Users, Calculator, Hospital } from 'lucide-react';
import { ApiClientProvider } from "../../../packages/ui/apiContext/ApiProvider"
import { WebApiClient } from './adapters/webAdapter';
export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Hospital className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Jamal Hospital</h1>
              <p className="text-sm text-muted-foreground">Management System</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="patients">
              <Users className="mr-2 h-4 w-4" />
              Patient Management
            </TabsTrigger>
            <TabsTrigger value="accounts">
              <Calculator className="mr-2 h-4 w-4" />
              Accounts Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patients">
            <PatientManagement />
          </TabsContent>

          <TabsContent value="accounts">
            <AccountsManagement />
          </TabsContent>
        </Tabs>
      </main>

      <Toaster />
    </div>
  );
}