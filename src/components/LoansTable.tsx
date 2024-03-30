import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from "./ui/button"
  
  const loanProviders = [
    {
      loanProvider: "Aave",
      ticker: "$500",
      uInterestRate: "5.6%",
      oInterestRate: "4.5",
    },
    {
      loanProvider: "Compound",
      ticker: "$500",
      uInterestRate: "5.6%",
      oInterestRate: "4.5",
    },
    {
      loanProvider: "P2P Pool",
      ticker: "$500",
      uInterestRate: "5.6%",
      oInterestRate: "4.5",
    },
    {
      loanProvider: "P2P Peer",
      ticker: "$500",
      uInterestRate: "5.6%",
      oInterestRate: "4.5",
    }
  ]
  
  export function LoansTable() {
    return (
      <Table>
        <TableCaption>A list of all My loans applied</TableCaption>
        <TableHeader>  
          <TableRow>
            <TableHead className="">Lender</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="">Rate</TableHead>
            <TableHead className="">Loan Details</TableHead>
            <TableHead className="">Status</TableHead>
            <TableHead className="">Actions</TableHead>
           
          </TableRow>
        </TableHeader>
        <TableBody>
          {loanProviders.map((loanProvider) => (
            <TableRow key={loanProvider.loanProvider}>
              <TableCell className="font-medium">{loanProvider.loanProvider}</TableCell>
              <TableCell>{loanProvider.ticker}</TableCell>
              <TableCell>
                {loanProvider.uInterestRate}
              </TableCell>
              <TableCell>
                {loanProvider.oInterestRate}%
              </TableCell>
              <TableCell>
                {loanProvider.uInterestRate}
              </TableCell>
              <TableCell>
                <Button> action</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
        </TableFooter>
      </Table>
    )
  }
  