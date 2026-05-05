import { Controller,Get, Post, Body,Injectable,Inject, UseGuards} from "@nestjs/common"
import { AccountsService } from "./accounts.service"
import { InputValidationPipe } from "./incomeValidation.pipe";
import { IncomeDto} from "./dto/income.dto"
import { AuthorizationGuard } from "../auth/guards/authorization.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Permissions } from "../auth/decorators/permissions.decorator";
@UseGuards(JwtAuthGuard,AuthorizationGuard)
@Controller("accounts")
@Injectable()
export class AccountsController {
    constructor(@Inject(AccountsService)private accountsService:AccountsService){

    }
@Permissions("view-accounts")
@Get("getIncomes")
getIncomes(){
    console.log("getINcomes controller invoked",this.accountsService)
    return this.accountsService.getIncomes();

}
@Permissions("view-accounts")
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