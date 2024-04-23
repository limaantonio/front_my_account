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
    Tfoot,
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
  import { useHistory } from "next/router";
  
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
    const { id, budget } = router.query;
  
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
    const [account, setAccount] = useState(0);
    const [entriesAccout, setAccountEntries] = useState<Entry[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [accountsFilter, setAccountsFilter] = useState<Account[]>([]);
    const [incomeAmount, setIncomeAmount] = useState(0);
    const [expenseAmount, seTExpenseAmount] = useState(0);
    const [status, setStatus] = useState();
  
  
    async function loadAccount() {
      await api.get('subaccount').then((response) => setEntries(response.data));
      await api.get(`subaccount/balance`).then((response) => setBalance(response.data));
    }
  
   
      useEffect(() => {
        loadAccount();
      }, [setEntries, setBalance, id]);
    
  
    console.log(entries)
  
    
    async function handleDelete(id: string) {
      await api.delete(`subaccount/${id}`);
      console.log(id)
  
      const entryIndex = entries.findIndex((b) => b.id === id);
      const entry = [...entries];
      console.log(entry)
  
      entry.splice(entryIndex, 1);
      setEntries(entry);
      loadAccount()
      
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
            <Link href={`months?id=${budget}`} passHref>
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
              income={balance?.income}
              expense={balance?.expense}
              total={balance?.liquid_income - balance?.expense}
              liquid_income={balance?.liquid_income}

            />
  
            <Box flex="1" borderRadius={8} bg="gray.800" p="8">
              <Flex mb="8" justify="space-between" align="center">
                <Heading size="lg" fontWeight="normal">
                  Classificação de contas
                </Heading>
                <Box>
                 <Link href="/subaccounts/create" passHref>
                <Button
                  as="a"
                  size="sm"
                  fontSize="small"
                  colorScheme="green"
                  leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                >
                  Criar Subcontas
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
                    <Th>Conta</Th>          
                    <Th>Percentual</Th>
                    <Th>Valor</Th>
                    <Th></Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {
                      
                   Array.isArray(entries) && entries.map((entry) => (
                      <Tr
                        key={entry?.id}
                        cursor="pointer"
                      >
                        <Td px={["4", "4", "6"]}>
                          <Checkbox colorScheme="green"></Checkbox>
                        </Td>
                        <Td>
                          <Box>
                            <Text fontWeight="bold">{entry?.name}</Text>
                            {entry?.type === "INCOME" ? (
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
                          <Text>{entry?.percentage}%</Text>
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
                          <Link href={`/items?id=${entry?.id}`}>
                            <Text color="green.300" fontWeight="">
                              Visualizar
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
                  }
                </Tbody>
                <Tfoot>
              <Tr>
                <Th>Total</Th>
                <Th></Th>
                <Th>{entries.reduce((acc, item) => Number(acc) + Number(item.percentage), 0)}%</Th>
                <Th></Th>
              </Tr>
            </Tfoot>
              </Table>
              <Pagination />
            </Box>
          </Box>
        </Flex>
      </Box>
    );
  }
  