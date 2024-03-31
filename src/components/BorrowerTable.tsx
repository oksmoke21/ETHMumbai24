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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"

const borrowerLists = [
  {
    borrowerList: "0xd17266057470A096ea34...",
    ticker: "$500",
    uInterestRate: "5.6%",
    oInterestRate: "4.5",
    date:"31-03-24",
    status:"Ongoing"

  },
  {
    borrowerList: "0xd899266057433A096ea...",
    ticker: "$2000",
    uInterestRate: "6.6%",
    oInterestRate: "4.5",
    date:"31-03-24",
    status:"Defaulted"

  },
  {
    borrowerList: "0xd8876592660574096ea...",
    ticker: "$300",
    uInterestRate: "4.6%",
    oInterestRate: "9.5",
    date:"31-03-24",
    status:"Ongoing"
  },
  {
    borrowerList: "0xk899266057433A096ea3...",
    ticker: "$1600",
    uInterestRate: "5.6%",
    oInterestRate: "9.5",
    date:"31-03-24",
    status:"Repayed"
  }
]

export function BorrowerTable() {
  return (
    <Table>
      <TableCaption>A list of All providers</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Borrower</TableHead>
          <TableHead>Loan Amount</TableHead>
          <TableHead className="">Interest</TableHead>
          <TableHead className="">Collateral</TableHead>
          <TableHead className="">Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {borrowerLists.map((borrowerList) => (
          <TableRow key={borrowerList.borrowerList}>
            <TableCell className="font-medium">{borrowerList.borrowerList}</TableCell>
            <TableCell>{borrowerList.ticker}</TableCell>
            <TableCell>
              {borrowerList.uInterestRate}
            </TableCell>
            <TableCell>
              {borrowerList.oInterestRate}%
            </TableCell>
            <TableCell>
              {borrowerList.date}
            </TableCell>
            <TableCell>
              {borrowerList.status}
            </TableCell>
            {/* <TableCell className="text-right">{borrowerList.uInterestRate}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {/* <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow> */}
      </TableFooter>
    </Table>
  )
}
