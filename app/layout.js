import "./globals.css";
import { COLLEAGUE_NAME, COMPANY_NAME } from "@/config";

export const metadata = {
  title: `Farewell, ${COLLEAGUE_NAME} — ${COMPANY_NAME}`,
  description: `A farewell card for ${COLLEAGUE_NAME} from the ${COMPANY_NAME} team.`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
