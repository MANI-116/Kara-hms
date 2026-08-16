import { useState,useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ExpenseIncome } from './ExpenseIncome';
import { FinancialCharts } from './FinancialCharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { useApiClient } from '../../apiContext/ApiProvider';
interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export function AccountsManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const api = useApiClient();
  useEffect( ()=>{
    (async()=>{
      try {
      let incomes = await api.getIncomes();
      let expenses = await api.getExpenses();
      incomes = incomes.data.map((r:Omit<Transaction,"amount">& {amount:string})=>{return {...r,amount:parseFloat(r.amount)}})
      expenses = expenses.data.map((r:Omit<Transaction,"amount">& {amount:string})=>{return {...r,amount:parseFloat(r.amount)}})
      let transactions = [...incomes,...expenses];
      setTransactions(transactions)
      console.log(incomes);
      console.log(expenses);
        
      } catch (error) {
        console.log(error)
        
      }
    
    })();
    

  },[])

  const addTransaction = async(transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    //invoking ipc to add to the sheets
    try {
      console.log("adding ",transaction.type," to the backend");
      if(transaction.type ==="expense"){
        const res = await api.addExpense(transaction);
        console.log("response from api",res);
        
      }
      
     if(transaction.type === "income"){
      console.log("add income request:");
        const res = await api.addIncome(transaction);
      console.log("response from backend income",res);
     }
    
    } catch (error) {
      
    }
    setTransactions([newTransaction, ...transactions]);
  };

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Accounts Management</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +1.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {netProfit >= 0 ? '+' : '-'}{Math.abs((netProfit / totalIncome) * 100).toFixed(1)}% margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactions.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total recorded
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Add Transactions</TabsTrigger>
          <TabsTrigger value="charts">Financial Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <ExpenseIncome onAddTransaction={addTransaction} transactions={transactions} />
        </TabsContent>

        <TabsContent value="charts">
          <FinancialCharts transactions={transactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const transactions=[
    {
      id: '1',
      type: 'expense',
      amount: 5000,
      category: 'Medical Equipment',
      description: 'X-ray machine maintenance',
      date: '2024-09-17'
    },
    {
      id: '2',
      type: 'income',
      amount: 15000,
      category: 'Patient Bills',
      description: 'Patient payments',
      date: '2024-09-17'
    },
    {
      id: '3',
      type: 'expense',
      amount: 3000,
      category: 'Utilities',
      description: 'Electricity bill',
      date: '2024-09-16'
    },
    {
      id: '4',
      type: 'income',
      amount: 8000,
      category: 'Insurance',
      description: 'Insurance reimbursements',
      date: '2024-09-16'
    },
    {
      id: '5',
      type: 'expense',
      amount: 2500,
      category: 'Supplies',
      description: 'Medical supplies',
      date: '2024-09-15'
    }
  ]