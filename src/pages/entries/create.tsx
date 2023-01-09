import {
  Box,
  Divider,
  Flex,
  Heading,
  VStack,
  SimpleGrid,
  HStack,
  Button,
  
  FormLabel,
} from "@chakra-ui/react";
import { SideBar } from "../../components/SideBar";
import { Header } from "../../components/Header";
import { Input } from "../../components/Form/Input";
import { Select } from "../../components/Form/Select";
import { useForm } from "react-hook-form";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler } from "react-hook-form/dist/types";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import router from "next/router";

type CreateEntryFormData = {
  description: string;
  amount: Number;
  number_of_installments: Number;
  created_at: Date;
  updated_at: Date;
};


interface Account {
  id: string;
  name: string;
  amount: Number;
  number_of_installments: Number;
  created_at: Date;
  updated_at: Date;
}

const createFormSchema = yup.object().shape({
  amount: yup.string().required("Valor obrigatório"),
});

export default function CreateBudget() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createFormSchema),
  });

  const errors = formState.errors;

  const hangleCreateEntry: SubmitHandler<CreateEntryFormData> = async (
    values
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await api.post("entry", values);
    router.push("/entries");
  };


  const [accounts, setAccounts] = useState<Balance[]>([]);

  useEffect(() => {
    api.get("account").then((response) => setAccounts(response.data));
  }, []);
  

 function transformDataAccountToOptions() {
  let selectAccount = []

  accounts.map(
    (account) =>
      (selectAccount.push({
        id: account.id,
        value: account.id,
        label: account.name
      }),
  ));
  return selectAccount
}

const toast = useToast();

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />
        <Box
          as="form"
          onSubmit={handleSubmit(hangleCreateEntry)}
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
        >
          <Heading size="lg" fontWeight="normal">
            Criar Lançamento
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8" paddingY="6">
            <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
              <Select {...register("account_id")} placeholder="Selecione" label="Conta" options={transformDataAccountToOptions()}/>
            </SimpleGrid>
          </VStack>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
              <Input
                label="Descrição"
                type="text"
                {...register("description")}
                error={errors.description}
              />
              <Input
                label="Valor"
                type="number"
                {...register("amount")}
                error={errors.amount}
              />
              <Input
                label="Número de parcelas"
                type="number"
                {...register("number_of_installments")}
                error={errors.number_of_installments}
              />
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/entries" passHref>
                <Button as="a" colorScheme="whiteAlpha">
                  Cancelar
                </Button>
              </Link>
              <Button
                colorScheme="green"
                type="submit"
                isLoading={formState.isSubmitting}
                onClick={() =>
                  toast({
                    title: "Lançamento criado.",
                    description: "O lançamento foi criado com sucesso.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                  })
                }
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
