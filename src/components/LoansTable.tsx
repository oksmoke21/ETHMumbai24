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
      loanProvider: "0xd899266057433A096ea34...",
      ticker: "$500",
      uInterestRate: "7.5% , 90% collateral Ratio",
      oInterestRate: "4.5",
    },
  ]
  
  export function LoansTable() {
    return (
      <Table>
        <TableCaption>A list of all My loans applied</TableCaption>
        <TableHeader>  
          <TableRow>
          <TableHead className="">Date</TableHead>
            <TableHead className="">Lender</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="">Rate</TableHead>
            <TableHead className="">Collateral Ratio</TableHead>
            <TableHead className="">Status</TableHead>
            <TableHead className="">Actions</TableHead>
           
          </TableRow>
        </TableHeader>
        <TableBody>
          {loanProviders.map((loanProvider) => (
            <TableRow key={loanProvider.loanProvider}>
                            <TableCell className="font-medium">31-03-2024</TableCell>
              <TableCell className="font-medium">{loanProvider.loanProvider}</TableCell>
              <TableCell>{loanProvider.ticker}</TableCell>
              <TableCell>
                8%
              </TableCell>
              <TableCell>
                90%
              </TableCell>
              <TableCell>
                Ongoing
              </TableCell>
              <TableCell>
                <Button> Action</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
        </TableFooter>
      </Table>
    )
  }
  