import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Heading,
  Icon,
  Stack,
  Table,
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
import { RiAddLine, RiPencilLine, RiDeleteBack2Line } from "react-icons/ri";
import { Pagination } from "../../components/Pagination";
import Link from "next/link";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Budget {
  id: string;
  year: Number;
  created_at: Date;
  updated_at: Date;
}

export default function UserList() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    api.get("budget").then((response) => setBudgets(response.data));
  }, [setBudgets]);

  async function handleDelete(id: string) {
    try {
      await api.delete(`budget/${id}`);

      const budgetIndex = budgets.findIndex((budget) => budget.id === id);
      const newBudget = [...budgets];

      newBudget.splice(budgetIndex, 1);
      setBudgets(newBudget);
    } catch (err) {
      alert("Ocorreu um erro ao deletar essa ferramenta, tente novamente.");
    }
    console.log(id);
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Orçamentos
            </Heading>
            <Link href="/budgets/create" passHref>
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
                <Th>Ano</Th>
                <Th>Data de atualização</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {budgets.map((budget) => (
                // eslint-disable-next-line react/jsx-key
                <Tr>
                  <Td px={["4", "4", "6"]}>
                    <Checkbox colorScheme="green"></Checkbox>
                  </Td>
                  <Td>
                    <Box>
                      <Text fontWeight="bold">{budget.year}</Text>
                      <Text fontSize="sm" color="gray.300">
                        {format(new Date(budget.created_at), "yyyy-MM-dd")}
                      </Text>
                    </Box>
                  </Td>

                  <Td>
                    {budget.updated_at ? (
                      format(new Date(budget.updated_at), "yyyy-MM-dd")
                    ) : (
                      <>-</>
                    )}
                  </Td>

                  <Td>
                    <HStack>
                      <Box ml="auto">
                        <Link href={`/budgets/edit?id=${budget.id}`}>
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
                          onClick={() => handleDelete(budget.id)}
                          as="a"
                          size="sm"
                          fontSize="small"
                          colorScheme="red"
                          leftIcon={
                            <Icon as={RiDeleteBack2Line} fontSize="16" />
                          }
                        >
                          Excluir
                        </Button>
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
