import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { JamalOP } from './JamalOP';
import { IPPDFPreview} from "./JimsOP"

export function OPCreation() {
  return (
    <div className="space-y-6">
      {/* Search Existing Patients */}
      <Tabs>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jamal-op">
            Jamal OP
          </TabsTrigger>
          <TabsTrigger value="jims-op">
            Jims OP
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jamal-op">
             <JamalOP/>
        </TabsContent>
        <TabsContent value="jims-op">
          <IPPDFPreview />
        </TabsContent>
      </Tabs>
         </div>
  );
}

