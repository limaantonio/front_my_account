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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { SideBar } from "../../components/SideBar";
import { Header } from "../../components/Header";
import { RiAddLine, RiDeleteBin6Line, RiPencilLine } from "react-icons/ri";
import { Pagination } from "../../components/Pagination";
import Link from "next/link";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import AlertDelete from "../../components/AlertDelete";
import { useRouter } from "next/router";
import { SlOptionsVertical } from "react-icons/sl";

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

interface Item {
  id: string;
  name: string;
  qtde: Number;
  amount: Number;
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

  const [items, setItems] = useState<Item[]>([]);
  const [entry, setEntry] = useState<Entry>();

  useEffect(() => {
    getAccount();
  }, [id]);

  async function getAccount() {
    await api.get(`entry/${id}`).then((response) => setEntry(response.data));
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
              Items
            </Heading>
          </Flex>
          <Table colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th px={["4", "4", "6"]} color="gray.300" width="8">
                  <Checkbox colorScheme="green"></Checkbox>
                </Th>
                <Th>Nome</Th>
                <Th>Lan??amento</Th>
                <Th>Valor</Th>

                <Th width="8"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {entry?.items?.map((item) => (
                // eslint-disable-next-line react/jsx-key
                <Tr>
                  <Td px={["4", "4", "6"]}>
                    <Checkbox colorScheme="green"></Checkbox>
                  </Td>
                  <Td>{entry.description}</Td>
                  <Td>{item.name}</Td>
                  <Td>
                    <Text fontWeight="bold">
                      {" "}
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.amount)}
                    </Text>
                  </Td>

                  {/* {isWideVersion && (
                    <Td>
                      {entry.updated_at ? (
                        format(new Date(entry.updated_at), "yyyy-MM-dd")
                      ) : (
                        <>-</>
                      )}
                    </Td>
                  )} */}

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
                        <Link href={`/entries/edit?id=${entry.id}`}>
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
                            textColor="black"
                            leftIcon={
                              <Icon as={RiDeleteBin6Line} fontSize="16" />
                            }
                          >
                            Excluir
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
              ))}
            </Tbody>
          </Table>
          <Pagination />
        </Box>
      </Flex>
    </Box>
  );
}
