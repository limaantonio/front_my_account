import { Stack } from "@chakra-ui/react";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";
import {
  RiDashboardLine,
  RiContactsLine,
  RiMoneyDollarBoxFill,
  RiCurrencyLine,
  RiInputMethodLine,
  RiCalendar2Line,
  RiAddFill,
  RiGitMergeLine,
} from "react-icons/ri";

export function SideBarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink icon={RiDashboardLine} href="/dashboard">
          Dashboard
        </NavLink>
        <NavLink icon={RiMoneyDollarBoxFill} href="/budgets">
          Orçamentos
        </NavLink>
        <NavLink icon={RiCurrencyLine} href="/accounts">
          Contas
        </NavLink>
        <NavLink icon={RiCalendar2Line} href="/balances">
          Balanços
        </NavLink>
        <NavLink icon={RiAddFill} href="/entries">
          Lançamentos
        </NavLink>
      </NavSection>
      <NavSection title="INVESTIMENTO">
        <NavLink icon={RiInputMethodLine} href="/forms">
          Formulários
        </NavLink>
        <NavLink icon={RiGitMergeLine} href="/automation">
          Automação
        </NavLink>
      </NavSection>
    </Stack>
  );
}
