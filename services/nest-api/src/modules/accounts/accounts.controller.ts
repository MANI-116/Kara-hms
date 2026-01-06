import { Controller,Get, Post, Body,Injectable,Inject} from "@nestjs/common"
import { AccountsService } from "./accounts.service"
import { InputValidationPipe } from "./incomeValidation.pipe";
import { IncomeDto} from "./dto/income.dto"

@Controller("accounts")
@Injectable()
export class AccountsController {
    constructor(@Inject(AccountsService)private accountsService:AccountsService){

    }
@Get("getIncomes")
getIncomes(){
    console.log("getINcomes controller invoked",this.accountsService)
    return this.accountsService.getIncomes();

}

@Get("getExpenses")
getExpenses(){
    return this.accountsService.getExpenses();
}
@Post("addExpense")
addExpense(@Body(new InputValidationPipe()) expense:any){
    return this.accountsService.addExpense(expense);
    
}

@Post("addIncome")
addIncome(@Body(new InputValidationPipe()) income:IncomeDto){
    return this.accountsService.addIncome(income);

    
}
}