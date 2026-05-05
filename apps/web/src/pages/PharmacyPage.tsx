import { Heading, Box, Container, Flex, Text, TextField, Button, Select, Table,  } from "@radix-ui/themes"
import { MagnifyingGlassIcon} from "@radix-ui/react-icons"
export default function PharmacyPage(){

    return <>
    <Box>
        <Flex direction={"row"} justify={"center"} className="bg-red-500">
            <Heading  className="">JamalHopitals Pharmacy</Heading>
        </Flex>
    </Box>

    <Box>
        <Flex direction={"column"} align={"center"} >
            <Container className="rounded-sm border-2 border-red-500 shadow-2xl m-2" minWidth={"340px"}>
                <Flex direction={"column"} align={"center"} justify={"center"}>
                    <Box justifySelf={"end"}>
                        <TextField.Root placeholder="Search Medicine . . ." variant="soft" className="mt-2">
                            <TextField.Slot side="right"><Button type="button" variant="ghost" size={"2"}><MagnifyingGlassIcon></MagnifyingGlassIcon></Button></TextField.Slot>
                        </TextField.Root>

                    </Box>
                    <Box className="m-2">
                        <form className="flex flex-col gap-2" >
                            <Flex direction={"row"} gap={"2"}>
                                <Box>
                                    <Select.Root required>
                                        <Select.Trigger placeholder="Select Visit Type"></Select.Trigger>
                                        <Select.Content  >
                                            <Select.Group>
                                                <Select.Label>Hospital Visit</Select.Label>
                                                <Select.Separator />
                                                <Select.Item value="op">OP</Select.Item>
                                                <Select.Item value="ip">IP</Select.Item>
                                            </Select.Group>
                                            <Select.Group>
                                                <Select.Label>General Visit</Select.Label>
                                                <Select.Item value="general">General</Select.Item>
                                            </Select.Group>
                                        </Select.Content>
                                    </Select.Root>
                                </Box>
                                <Box flexGrow={"1"}>
                                    <TextField.Root  placeholder="Enter OP/IP ID"></TextField.Root>
                                </Box>
                            </Flex>
                            <TextField.Root required placeholder="Enter Patient Name" ></TextField.Root>
                            <TextField.Root required placeholder="Enter Doctor Name"></TextField.Root>

                            <Table.Root>
                                <Table.Header>
                                    <Table.ColumnHeaderCell>S.no</Table.ColumnHeaderCell>
                                     <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                                      <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                                       <Table.ColumnHeaderCell>Qty</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>TotalAmount</Table.ColumnHeaderCell>
                                </Table.Header>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>1</Table.Cell>
                                        <Table.Cell><Text>Dolo 365</Text></Table.Cell>
                                        <Table.Cell>60</Table.Cell>
                                        <Table.Cell>1</Table.Cell>
                                        <Table.Cell>60</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table.Root>
                            <Select.Root>
                                <Select.Trigger placeholder="PaymentMode"></Select.Trigger>
                                <Select.Content>
                                    <Select.Group>
                                        <Select.Label>Online</Select.Label>
                                        <Select.Item value="upi">UPI</Select.Item>
                                        <Select.Item value="card">Card</Select.Item>
                                        <Select.Item value="phonePe">PhonePe</Select.Item>
                                        <Select.Item value="paytm">Paytm</Select.Item>
                                        <Select.Item value="others">Others..</Select.Item>
                                    </Select.Group>
                                    <Select.Group>
                                        <Select.Label>Offline</Select.Label>
                                        <Select.Item value="cash">Cash</Select.Item>
                                    </Select.Group>
                                </Select.Content>
                            </Select.Root>

                            <Button type="submit"> Generate Bill</Button>
                        </form>

                    </Box>
       
                </Flex>

            </Container>
        </Flex>
    </Box>
    </>
}