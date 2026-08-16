import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';


interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface ExpenseIncomeProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  transactions: Transaction[];
}

export function ExpenseIncome({ onAddTransaction, transactions }: ExpenseIncomeProps) {
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    category: '',
    description: '',
    date: ''
  });

  const [incomeForm, setIncomeForm] = useState({
    amount: '',
    category: '',
    description: '',
    date:  ''
  });

  const expenseCategories = [
    'Medical Equipment',
    'Utilities',
    'Supplies',
    'Staff Salaries',
    'Maintenance',
    'Insurance',
    'Rent',
    'Marketing',
    'Administration',
    'JamalOP',
    'JimsOP',
    'Other'
  ];

  const incomeCategories = [
    'Patient Bills',
    'Insurance',
    'Government Grants',
    'Donations',
    'Investment Income',
    'Consultation Fees',
    'Laboratory Services',
    'Pharmacy Sales',
    'Equipment Rental',
    'Other'
  ];

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expenseForm.amount || !expenseForm.category || !expenseForm.description) {
      toast.error('Please fill all required fields');
      return;
    }

    const amount = parseFloat(expenseForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    console.log("date:",expenseForm.date);
    onAddTransaction({
      type: 'expense',
      amount,
      category: expenseForm.category,
      description: expenseForm.description,
      date: expenseForm.date
    });

    setExpenseForm({
      amount: '',
      category: '',
      description: '',
      date: ''
    });

    toast.success('Expense added successfully');
  };

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!incomeForm.amount || !incomeForm.category || !incomeForm.description) {
      toast.error('Please fill all required fields');
      return;
    }

    const amount = parseFloat(incomeForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    onAddTransaction({
      type: 'income',
      amount,
      category: incomeForm.category,
      description: incomeForm.description,
      date: incomeForm.date
    });

    setIncomeForm({
      amount: '',
      category: '',
      description: '',
      date: ''
    });

    toast.success('Income added successfully');
  };

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Add Transactions */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="expense" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense">
              <TrendingDown className="mr-2 h-4 w-4" />
              Add Expense
            </TabsTrigger>
            <TabsTrigger value="income">
              <TrendingUp className="mr-2 h-4 w-4" />
              Add Income
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expense">
            <Card>
              <CardHeader>
                <CardTitle>Add Expense</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleExpenseSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expense-amount">Amount ($) *</Label>
                      <Input
                        id="expense-amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="expense-category">Category *</Label>
                      <Select 
                        value={expenseForm.category} 
                        onValueChange={(value:any) => setExpenseForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="expense-date">Date *</Label>
                      <Input
                        id="expense-date"
                        type="date"
                        value={expenseForm.date}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="expense-description">Description *</Label>
                    <Textarea
                      id="expense-description"
                      placeholder="Enter expense description"
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle>Add Income</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleIncomeSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="income-amount">Amount ($) *</Label>
                      <Input
                        id="income-amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={incomeForm.amount}
                        onChange={(e) => setIncomeForm(prev => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="income-category">Category *</Label>
                      <Select 
                        value={incomeForm.category} 
                        onValueChange={(value:any) => setIncomeForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {incomeCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="income-date">Date *</Label>
                      <Input
                        id="income-date"
                        type="date"
                        value={incomeForm.date}
                        onChange={(e) => setIncomeForm(prev => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="income-description">Description *</Label>
                    <Textarea
                      id="income-description"
                      placeholder="Enter income description"
                      value={incomeForm.description}
                      onChange={(e) => setIncomeForm(prev => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Income
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Recent Transactions */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No transactions yet
                </p>
              ) : (
                recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={transaction.type === 'income' ? 'default' : 'destructive'}>
                          {transaction.type === 'income' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        </Badge>
                        <span className="text-sm font-medium">{transaction.category}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`text-right ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      <p className="font-medium">
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}