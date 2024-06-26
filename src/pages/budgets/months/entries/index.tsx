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
} from '@chakra-ui/react'
import { SideBar } from '../../../../components/SideBar'
import { Header } from '../../../../components/Header'
import {
  RiAddLine,
  RiArrowDownSFill,
  RiArrowDropLeftFill,
  RiSearch2Line,
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
} from 'react-icons/ri'
import { SlOptionsVertical } from 'react-icons/sl'
import { Pagination } from '../../../../components/Pagination'
import Link from 'next/link'
import api from '../../../../services/api'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import AlertDelete from '../../../../components/AlertDelete'
import Summary from '../../../../components/Summary'
import { useRouter } from 'next/router'

interface Account {
  id: string
  name: string
  amount: Number
  type: string
  entry: Entry
  number_of_installments: Number
  created_at: Date
  updated_at: Date
}

interface Balance {
  id: string
  month: Number
}

interface Entry {
  id: string
  description: string
  amount: Number
  account: {
    id: string
    name: string
    amount: Number
    number_of_installments: Number
  }
  number_of_installments: Number
  created_at: Date
  updated_at: Date
}

export default function UserList() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const router = useRouter()
  const { id, budget } = router.query

  const balances = [
    {
      id: 1,
      month: 'Janeiro',
    },
    {
      id: 2,
      month: 'Fevereiro',
    },
    {
      id: 3,
      month: 'Março',
    },
    {
      id: 4,
      month: 'Abril',
    },
    {
      id: 5,
      month: 'Maio',
    },
    {
      id: 6,
      month: 'Junho',
    },
    {
      id: 7,
      month: 'Julho',
    },
    {
      id: 8,
      month: 'Agosto',
    },
    {
      id: 9,
      month: 'Setembro',
    },
    {
      id: 10,
      month: 'Outubro',
    },
    {
      id: 11,
      month: 'Novembro',
    },
    {
      id: 12,
      month: 'Dezembro',
    },
  ]

  const [balance, setBalance] = useState()
  const [account, setAccount] = useState(0)
  const [entriesAccout, setAccountEntries] = useState<Entry[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [entries, setEntries] = useState<Entry[]>([])
  const [accountsFilter, setAccountsFilter] = useState<Account[]>([])
  const [incomeAmount, setIncomeAmount] = useState(0)
  const [expenseAmount, seTExpenseAmount] = useState(0)
  const [status, setStatus] = useState()
  const [selectedSubAccountId, setSelectedSubAccountId] = useState(null)

  async function loadAccount() {
    await api
      .get(`entry/month/${id}`)
      .then((response) => setEntries(response.data))
    await api
      .get(`months/budget/balance/${id}`)
      .then((response) => setBalance(response.data))
  }

  useEffect(() => {
    loadAccount()
  }, [setEntries, setBalance, id])

  async function handleDelete(id: string) {
    await api.delete(`entry/${id}`)
    const entryIndex = entriesAccout.findIndex((b) => b.id === id)
    const entry = [...entriesAccout]

    entry.splice(entryIndex, 1)
    setEntries(entry)
    loadAccount()
  }

  const [modalRemoveTool, setModalRemoveTool] = useState(false)

  function openModalRemove(id: string) {
    setModalRemoveTool(true)
    //@ts-ignore
    setSelectedSubAccountId(id)
  }

  function toggleModalRemove(): void {
    setModalRemoveTool(!modalRemoveTool)
  }

  async function handlePay(id: string) {
    await api.post(`entry/${id}`)
    //@ts-ignore
    getAccount()
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />

        <Box flex="1">
          <Link href={`/budgets/months?id=${budget}`} passHref>
            <Button
              mb="4"
              _hover={{ bg: 'transparent', textColor: 'green.400' }}
              bg="transparent"
            >
              <RiArrowLeftLine fontSize="28" />
            </Button>
          </Link>

          <Summary
            id={1}
            //@ts-ignore
            income={balance?.incomeAmount}
            //@ts-ignore
            expense={balance?.expenseAmount}
            //@ts-ignore
            total={balance?.incomeAmount - balance?.expenseAmount} liquid_income={undefined}          />

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
                          bg={b.id === balance ? 'green.400' : 'white'}
                          textColor={b.id === balance ? 'white' : 'black'}
                          _hover={{ bg: 'gray.50' }}
                          key={b.id}
                          value={b.month}
                        >
                          {b.month}
                        </MenuItem>
                      ))}
                      <MenuItem
                        bg="gray.50"
                        onClick={() => {
                          //@ts-ignore
                          setBalance(0)
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
                  </Menu>
                )}
                <Link
                  href={`/budgets/months/entries/create?id=${budget}&budget_month=${id}`}
                  passHref
                >
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
                  <Th px={['4', '4', '6']} color="gray.300" width="8">
                    <Checkbox colorScheme="green"></Checkbox>
                  </Th>
                  <Th>Titulo</Th>
                  <Th>Mês</Th>
                  <Th>Conta</Th>
                  <Th>Valor</Th>
                  <Th>Parcela</Th>
                  <Th>Status</Th>
                  <Th>Items</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.isArray(entries) &&
                  entries.map((entry) => (
                    <Tr key={entry?.id} cursor="pointer">
                      <Td px={['4', '4', '6']}>
                        <Checkbox colorScheme="green"></Checkbox>
                      </Td>
                      <Td>
                        <Box>
                          <Text fontWeight="bold">{entry?.description}</Text>
                          
                          {
                            //@ts-ignore
                            entry?.account?.sub_account?.type === 'INCOME' ? (
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
                        <Text>{
                          //@ts-ignore
                          entry?.month}</Text>
                      </Td>
                      <Td>
                        <Text>{entry?.account.name}</Text>
                      </Td>
                      <Td>
                        <Text fontWeight="bold">
                          {' '}
                          {Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(
                            //@ts-ignore
                            entry?.amount)}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontWeight="bold">{
                          //@ts-ignore
                          entry?.installment}</Text>
                      </Td>

                      <Td>
                        {
                          //@ts-ignore
                          entry?.status === 'PENDING'
                            ? 'Pendente'
                            //@ts-ignore
                          : entry?.status === 'CLOSED'
                              ? 'Pago'
                              //@ts-ignore
                            : entry?.status === 'IN_PROGRESS'
                              ? 'Em andamento'
                              : ''}
                      </Td>

                      <Td>
                        <Link href={`/budgets/months/entries/items?id=${entry?.id}&month=${id}`}>
                          <Button
                            mr="2"
                            as="a"
                            size="sm"
                            fontSize="small"
                            colorScheme="gray.50"
                            textColor="white"
                            leftIcon={<Icon as={RiSearch2Line} fontSize="16" />}
                          />
                        </Link>
                      </Td>

                      <Td>
                        <Menu>
                          <MenuButton
                            bg="transparent"
                            _hover={{ bg: 'transparent' }}
                            as={Button}
                            textColor="white.300"
                          >
                            <SlOptionsVertical />
                          </MenuButton>
                          <MenuList textColor="black">
                            <MenuItem as="button" _hover={{ bg: 'gray.50' }}>
                              <Button
                                mr="2"
                                as="a"
                                size="sm"
                                fontSize="small"
                                colorScheme="gray.50"
                                textColor="black"
                                onClick={() => {
                                  handlePay(entry?.id)
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
                            <Link href={`/budgets/months/entries/edit?id=${entry?.id}`}>
                              <MenuItem as="button" _hover={{ bg: 'gray.50' }}>
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
                              onClick={() => openModalRemove(entry.id)}
                              as="button"
                              _hover={{ bg: 'gray.50' }}
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
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
              <AlertDelete
                isOpen={modalRemoveTool}
                setIsOpen={toggleModalRemove}
                //@ts-ignore
                handleRemove={() => handleDelete(selectedSubAccountId)}
              />
            </Table>
            <Pagination />
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}
