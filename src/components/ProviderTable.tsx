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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import LoanForm from "./ui/LoanForm"

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

export function ProviderTable() {
  return (
    <Table>
      <TableCaption>A list of All providers</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Loan Providers</TableHead>
          <TableHead>Maximum Loan Ticket</TableHead>
          <TableHead className="">Under Collaterized Interest</TableHead>
          <TableHead className="">Over Collaterized Interest</TableHead>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Apply For Loan</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Enter Your Loan Details</DialogTitle>
                    <DialogDescription>
                      This details will be used for apply to loan.
                    </DialogDescription>
                  </DialogHeader>
                  <LoanForm/>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
      </TableFooter>
    </Table>
  )
}
