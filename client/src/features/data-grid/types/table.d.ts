import "@tanstack/react-table";
import type { Row } from "./index";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: keyof Row, value: unknown, rowId: number) => void;
  }
}
