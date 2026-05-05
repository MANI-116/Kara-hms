import { Spinner, Theme } from "@radix-ui/themes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { PatientManagement } from './components/PatientManagement';
import { AccountsManagement } from './components/AccountsManagement';
import { Toaster } from './components/ui/sonner';
import { Users, Calculator, Hospital } from 'lucide-react';
import LoginPage from './components/LoginPage';
import { useState, useEffect, createContext, useContext } from 'react';
import { OPCreation } from './components/OPCreattion';
import { useApiClient } from '../apiContext/ApiProvider';

const UserContext = createContext({user:null,isLoading:true})


const UserProvider = ({children}:{children:React.ReactNode})=>{
  const [isLoading,setIsLoading] = useState<boolean>(true);
  const [user,setUser]= useState(null);
const api = useApiClient()

useEffect(()=>{
  const restoreSession = async()=>{
       const response = await api.getMe();
       console.log("response from the get me",response)
       if(!response.ok) {
        //try login 
        console.log("login ,no cookie found")
        
       }else{
          const user = response.data;
          console.log("/me true,",user);
           setUser(user);
       }
        setIsLoading(false);
  }

  restoreSession();
},[])

return <UserContext.Provider value={{user,isLoading}}>
  {children}
</UserContext.Provider>
  
}
export  function App() {
  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  const {user,isLoading}= useContext(UserContext);

  //loading true -> user not found
  if(isLoading) return <p>loading...</p>
  //loading false -> user null
  if(user && !isLoggedin){
    setIsLoggedin(true)
  } 

  
  return (
       <div className="min-h-screen bg-background">

      <Header />    
       {!isLoggedin && <LoginPage onSuccessLogin={()=>setIsLoggedin(true)}  />}
      
      {isLoggedin && <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="patients">
              <Users className="mr-2 h-4 w-4" />
              Patient Management
            </TabsTrigger>
            {user && user.permissions.includes("view-accounts") && <TabsTrigger value="accounts">
              <Calculator className="mr-2 h-4 w-4" />
              Accounts Management
            </TabsTrigger>}
            
          </TabsList>

          <TabsContent value="patients">
            {/* <PatientManagement /> */}
            <OPCreation />
          </TabsContent>

          <TabsContent value="accounts">
            <AccountsManagement />
          </TabsContent>
        </Tabs>
      </main>}

      <Toaster />
    </div>
     );
}

export default function AppWrapper(){
  return <UserProvider>
    <Theme>
    <App />
    <Spinner/>
    </Theme>
  </UserProvider>
}

function Header(){

  return   <header className="border-b bg-card">
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
}