import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Table,
  HStack,
  Tbody,
  Td,
  Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react";
import { SideBar } from "../../components/SideBar";
import { Header } from "../../components/Header";
import {
  RiAddLine,
  RiArrowDownSFill,
  RiArrowDropLeftFill,
  RiArrowLeftLine,
  RiArrowRightCircleFill,
  RiDeleteBack2Line,
  RiDeleteBin6Line,
  RiMenu2Line,
  RiMenuFill,
  RiMenuFoldFill,
  RiMenuLine,
  RiMenuUnfoldFill,
  RiPencilLine,
  RiPlayCircleLine,
} from "react-icons/ri";
import { SlOptionsVertical } from "react-icons/sl";
import { Pagination } from "../../components/Pagination";
import Link from "next/link";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import AlertDelete from "../../components/AlertDelete";
import { useRouter } from "next/router";
import Summary from "../../components/Summary";

interface Account {
  id: string;
  name: string;
  amount: Number;
  type: string;
  entry: Entry;
  number_of_installments: Number;
  created_at: Date;
  updated_at: Date;
}

interface Balance {
  id: string;
  month: Number;
}

interface Entry {
  id: string;
  description: string;
  amount: Number;
  account: {
    id: string;
    name: string;
    amount: Number;
    number_of_installments: Number;
  };
  number_of_installments: Number;
  created_at: Date;
  updated_at: Date;
}

export default function UserList() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const router = useRouter();
  const { id } = router.query;

  const balances = [
    {
      id: 1,
      month: "Janeiro",
    },
    {
      id: 2,
      month: "Fevereiro",
    },
    {
      id: 3,
      month: "Março",
    },
    {
      id: 4,
      month: "Abril",
    },
    {
      id: 5,
      month: "Maio",
    },
    {
      id: 6,
      month: "Junho",
    },
    {
      id: 7,
      month: "Julho",
    },
    {
      id: 8,
      month: "Agosto",
    },
    {
      id: 9,
      month: "Setembro",
    },
    {
      id: 10,
      month: "Outubro",
    },
    {
      id: 11,
      month: "Novembro",
    },
    {
      id: 12,
      month: "Dezembro",
    },
  ];

  const [balance, setBalance] = useState();
  const [account, setAccount] = useState();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsFilter, setAccountsFilter] = useState<Account[]>([]);
  const [incomeAmount, setIncomeAmount] = useState(0);
  const [expenseAmount, seTExpenseAmount] = useState(0);
  const [status, setStatus] = useState();

  useEffect(() => {
    getAccount();
  }, [account, balance]);

  async function getAccount() {
    if (id) {
      setAccount(id);
    }

    console.log(account);
    if (balance && account) {
      await api
        .get(`entry?month=${balance}&account=${account}`)
        .then((response) => setAccounts(response.data));
    } else if (balance) {
      await api
        .get(`entry?month=${balance}`)
        .then((response) => setAccounts(response.data));
    } else if (account) {
      await api
        .get(`entry?account=${account}`)
        .then((response) => setAccounts(response.data));
    }
    await api.get(`entry`).then((response) => setAccounts(response.data));

    await api
      .get("account")
      .then((response) => setAccountsFilter(response.data));
  }
  async function handleDelete(id: string) {
    await api.delete(`entry/${id}`);

    const entryIndex = entries.findIndex((b) => b.id === id);
    const entry = [...entries];

    entry.splice(entryIndex, 1);
    setEntries(entry);
  }

  const [modalRemoveTool, setModalRemoveTool] = useState(false);

  function openModalRemove() {
    setModalRemoveTool(true);
  }

  function toggleModalRemove(): void {
    setModalRemoveTool(!modalRemoveTool);
  }

  async function handlePay(id: string) {
    await api.post(`entry/${id}`);
    getAccount();
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />

        <Box flex="1">
          <Link href="/accounts" passHref>
            <Button
              mb="4"
              _hover={{ bg: "transparent", textColor: "green.400" }}
              bg="transparent"
            >
              <RiArrowLeftLine fontSize="28" />
            </Button>
          </Link>

          <Summary
            id={1}
            income={accounts?.income}
            expense={accounts?.expense}
            total={accounts?.income - accounts?.expense}
          />

          <Box flex="1" borderRadius={8} bg="gray.800" p="8">
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Lançamentos
              </Heading>
              <Box>
                <Menu>
                  <MenuButton
                    bg="gray.700"
                    as={Button}
                    mr="4"
                    rightIcon={<RiArrowDownSFill />}
                  >
                    Mês
                  </MenuButton>
                  <MenuList textColor="black">
                    <MenuGroup title="Balanço">
                      {balances.map((b) => (
                        <MenuItem
                          as="button"
                          bg={b.id === balance ? "green.400" : "white"}
                          textColor={b.id === balance ? "white" : "black"}
                          _hover={{ bg: "gray.50" }}
                          key={b.id}
                          value={b.month}
                        >
                          {b.month}
                        </MenuItem>
                      ))}
                      <MenuItem
                        bg="gray.50"
                        onClick={() => {
                          setBalance(0);
                        }}
                        as="button"
                      >
                        Limpar filtro
                      </MenuItem>
                    </MenuGroup>
                  </MenuList>
                </Menu>
                {!id && (
                  <Menu>
                    <MenuButton
                      bg="gray.700"
                      as={Button}
                      mr="4"
                      rightIcon={<RiArrowDownSFill />}
                    >
                      Conta
                    </MenuButton>
                    <MenuList textColor="black">
                      <MenuGroup title="Balanço">
                        {accountsFilter?.account?.map((b) => (
                          <MenuItem
                            as="button"
                            bg={
                              b.account.id === account ? "green.400" : "white"
                            }
                            textColor={
                              b.account.id === account ? "white" : "black"
                            }
                            _hover={{ bg: "gray.50" }}
                            onClick={() => {
                              setAccount(b.account.id);
                            }}
                            key={b.account.id}
                            value={b.account.name}
                          >
                            {b.account.name}
                          </MenuItem>
                        ))}
                        <MenuItem
                          bg="gray.50"
                          onClick={() => {
                            setAccount(0);
                          }}
                          as="button"
                        >
                          Limpar filtro
                        </MenuItem>
                      </MenuGroup>
                    </MenuList>
                  </Menu>
                )}
                <Link href="/entries/create" passHref>
                  <Button
                    as="a"
                    size="md"
                    fontSize="small"
                    colorScheme="green"
                    leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                  >
                    Criar novo
                  </Button>
                </Link>
              </Box>
            </Flex>
            <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th px={["4", "4", "6"]} color="gray.300" width="8">
                    <Checkbox colorScheme="green"></Checkbox>
                  </Th>
                  <Th>Titulo</Th>
                  <Th>Mês</Th>
                  <Th>Conta</Th>
                  <Th>Valor</Th>
                  <Th>Parcela</Th>
                  <Th>Status</Th>
                  <Th>Items</Th>
                </Tr>
              </Thead>
              <Tbody>
                {accounts?.entrys?.map((account) =>
                  account?.account_entries?.entry?.map((entry) => (
                    <Tr
                      key={account?.account_entries?.entry?.id}
                      cursor="pointer"
                    >
                      <Td px={["4", "4", "6"]}>
                        <Checkbox colorScheme="green"></Checkbox>
                      </Td>
                      <Td>
                        <Box>
                          <Text fontWeight="bold">{entry?.description}</Text>
                          {account?.account_entries?.type === "INCOME" ? (
                            <Text fontSize="sm" color="blue.300">
                              Receita
                            </Text>
                          ) : (
                            <Text fontSize="sm" color="red.300">
                              Despesa
                            </Text>
                          )}
                        </Box>
                      </Td>
                      <Td>
                        <Text>{entry?.month}</Text>
                      </Td>
                      <Td>
                        <Text>{account?.account_entries?.name}</Text>
                      </Td>
                      <Td>
                        <Text fontWeight="bold">
                          {" "}
                          {Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(entry?.amount)}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontWeight="bold">{entry?.installment}</Text>
                      </Td>

                      <Td>
                        {entry?.status === "PENDING"
                          ? "Pendente"
                          : entry?.status === "CLOSED"
                          ? "Fechado"
                          : entry?.status === "IN_PROGRESS"
                          ? "Em andamento"
                          : ""}
                      </Td>

                      <Td>
                        <Link href={`/items?id=${entry?.id}`}>
                          <Text color="green.300" fontWeight="">
                            Vizualizar
                          </Text>
                        </Link>
                      </Td>

                      <Td>
                        <Menu>
                          <MenuButton
                            bg="transparent"
                            _hover={{ bg: "transparent" }}
                            as={Button}
                          >
                            <SlOptionsVertical />
                          </MenuButton>
                          <MenuList textColor="black">
                            <MenuItem as="button" _hover={{ bg: "gray.50" }}>
                              <Button
                                mr="2"
                                as="a"
                                size="sm"
                                fontSize="small"
                                colorScheme="gray.50"
                                textColor="black"
                                onClick={() => {
                                  handlePay(entry?.id);
                                }}
                                leftIcon={
                                  <Icon
                                    as={RiArrowRightCircleFill}
                                    fontSize="16"
                                  />
                                }
                              >
                                Pagar
                              </Button>
                            </MenuItem>
                            <Link href={`/entries/edit?id=${entry?.id}`}>
                              <MenuItem as="button" _hover={{ bg: "gray.50" }}>
                                <Button
                                  mr="2"
                                  as="a"
                                  size="sm"
                                  fontSize="small"
                                  colorScheme="gray.50"
                                  textColor="black"
                                  leftIcon={
                                    <Icon as={RiPencilLine} fontSize="16" />
                                  }
                                >
                                  Editar
                                </Button>
                              </MenuItem>
                            </Link>
                            <MenuItem
                              onClick={() => openModalRemove()}
                              as="button"
                              _hover={{ bg: "gray.50" }}
                            >
                              <Button
                                mr="2"
                                as="a"
                                size="sm"
                                fontSize="small"
                                colorScheme="gray.50"
                                textColor="red.400"
                                leftIcon={
                                  <Icon as={RiDeleteBin6Line} fontSize="16" />
                                }
                              >
                                <Text textColor="red.400">Excluir</Text>
                              </Button>
                            </MenuItem>
                          </MenuList>
                        </Menu>
                        <AlertDelete
                          isOpen={modalRemoveTool}
                          setIsOpen={toggleModalRemove}
                          handleRemove={() => handleDelete(entry.id)}
                        />
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
            <Pagination />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
