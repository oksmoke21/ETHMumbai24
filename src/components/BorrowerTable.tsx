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
    borrowerList: "Aave",
    ticker: "$500",
    uInterestRate: "5.6%",
    oInterestRate: "4.5",
  },
  {
    borrowerList: "Compound",
    ticker: "$500",
    uInterestRate: "5.6%",
    oInterestRate: "4.5",
  },
  {
    borrowerList: "P2P Pool",
    ticker: "$500",
    uInterestRate: "5.6%",
    oInterestRate: "4.5",
  },
  {
    borrowerList: "P2P Peer",
    ticker: "$500",
    uInterestRate: "5.6%",
    oInterestRate: "4.5",
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
          <TableHead className="">Loan Detail</TableHead>
          <TableHead className="">Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="">Action</TableHead>
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
              {borrowerList.uInterestRate}
            </TableCell>
            <TableCell>
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Change Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
