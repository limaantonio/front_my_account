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
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react";
import { SideBar } from "../../components/SideBar";
import { Header } from "../../components/Header";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { Pagination } from "../../components/Pagination";
import Link from "next/link";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import AlertDelete from "../../components/AlertDelete";
import { useRouter } from "next/router";

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
  incomes: Number;
  entries: Entry;
  expense: Number;
  result: Number;
  created_at: Date;
  updated_at: Date;
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

  const [entries, setEntries] = useState<Entry[]>([]);
  const [accounts, setAccounts] = useState<Account>();

  useEffect(() => {
    getAccount();
  }, [id]);

  async function getAccount() {
    await api
      .get(`account/${id}`)
      .then((response) => setAccounts(response.data));
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

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Lançamentos
            </Heading>
            <Link href="/entries/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="small"
                colorScheme="green"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Criar novo
              </Button>
            </Link>
          </Flex>
          <Table colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th px={["4", "4", "6"]} color="gray.300" width="8">
                  <Checkbox colorScheme="green"></Checkbox>
                </Th>
                <Th>Conta</Th>
                <Th>Valor</Th>
                <Th>Parcela</Th>
                <Th>Data de atualização</Th>
                <Th>Status</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {accounts?.entry.map((entry) => (
                // eslint-disable-next-line react/jsx-key
                <Tr>
                  <Td px={["4", "4", "6"]}>
                    <Checkbox colorScheme="green"></Checkbox>
                  </Td>
                  <Td>
                    <Box>
                      <Text fontWeight="bold">{entry.description}</Text>
                      {accounts?.type === "INCOME" ? (
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
                    <Text fontWeight="bold">
                      {" "}
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(entry.amount)}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontWeight="bold">{entry.installment}</Text>
                  </Td>
                  {isWideVersion && (
                    <Td>
                      {entry.updated_at ? (
                        format(new Date(entry.updated_at), "yyyy-MM-dd")
                      ) : (
                        <>-</>
                      )}
                    </Td>
                  )}
                  <Td>Pago</Td>
                  <Td>
                    <HStack>
                      <Box ml="auto">
                        <Link href={`/entries/edit?id=${entry.id}`}>
                          <Button
                            mr="2"
                            as="a"
                            size="sm"
                            fontSize="small"
                            colorScheme="purple"
                            leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                          >
                            Editar
                          </Button>
                        </Link>
                        <Button
                          onClick={() => openModalRemove()}
                          as="a"
                          size="sm"
                          fontSize="small"
                          colorScheme="red"
                          leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                        >
                          Excluir
                        </Button>
                        <AlertDelete
                          isOpen={modalRemoveTool}
                          setIsOpen={toggleModalRemove}
                          handleRemove={() => handleDelete(entry.id)}
                        />
                      </Box>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Pagination />
        </Box>
      </Flex>
    </Box>
  );
}
