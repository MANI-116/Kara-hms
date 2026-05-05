import { Box, Container, Flex, Text, TextField, Heading, Select, Button, Table } from "@radix-ui/themes"
import React, { useState, useRef } from "react"

type Test = {
    id:string,
    name:string,
    price:number
}

const tests:Test[] = [{
    id:"test001",
    name:"Xray",
    price:300
},{
    id:"test002",
    name:"ECG",
    price:100
},{
    id:"test003",
    name:"Scan",
    price:150
}]

type TestInfo = Test & { description:string}

export default function LabPage(){
    const [selectedTests, setSelectedTests] = useState<TestInfo[]>([]);
    const selectTestRef = useRef<{id:string}>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);

    function handleTestSelectChange(value:string){
        console.log("selected test changed",value);
        selectTestRef.current={id:value};
    }
    function handleFormSubmit(e:React.SubmitEvent){
        e.preventDefault();
        
        alert("for submitted")
    }

    function handleRemoveTest(id:string,description:string){
        
        let newSelectedTests = selectedTests.filter((test)=>!(test.id === id && test.description === description));
        setSelectedTests(newSelectedTests);

    }

    function handleAddTest(e:React.PointerEvent<HTMLButtonElement>){
        console.log("button clicked",e,typeof e);
        let selectedTest:TestInfo ;
        for(let i =0; i < tests.length ;i++){
            let test=tests[i];
            if(test.id === selectTestRef.current?.id){
                if(descriptionRef.current !== null){
                    selectedTest = {...test,description:descriptionRef.current.value};
                    setSelectedTests([...selectedTests,selectedTest]);
                    break;
                }
            }
        }
        
    }

    return <>
    <Box className="bg-red-400 "><Flex direction={"row"} justify={"center"}><Heading>JamalHopitals</Heading></Flex> </Box>
    <Box><Flex justify={"center"}> <Text> LabForm</Text> </Flex></Box>
    <Box>
        <Flex direction={"column"} align={"center"} >
        <Container className="radius-sm border-red-600 border-2 rounded-sm shadow-md shadow-red-950" minWidth={"340px"}>
            <Box className="m-2">
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
                    <Select.Root>
                        <Select.Trigger placeholder="select service type"></Select.Trigger>
                        <Select.Content position="popper" >
                        <Select.Group>
                            <Select.Label>From Hospital</Select.Label>
                            <Select.Separator></Select.Separator>
                            <Select.Item value="op">OP </Select.Item>
                            <Select.Item value="ip">IP </Select.Item>
                        </Select.Group>
                        </Select.Content>

                    </Select.Root>
                    <TextField.Root placeholder="Enter ID">

                    </TextField.Root>
                    <TextField.Root placeholder="Enter Patient Name"></TextField.Root>
                    <TextField.Root placeholder="Enter Doctor Name"></TextField.Root>
                    
                    <Select.Root onValueChange={handleTestSelectChange}>
                        <Select.Trigger placeholder="select test"></Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                <Select.Label> Tests Available</Select.Label>
                                {tests.map((test)=><Select.Item value={test.id}>{test.name}</Select.Item>)}
                            </Select.Group>

                        </Select.Content>
                    </Select.Root>
                    <TextField.Root placeholder="TestDescption" ref={descriptionRef}></TextField.Root>
                     
                    <Button color="red" type="button" onClick={handleAddTest}>Add Test</Button>

                    {selectedTests.length !== 0 &&<Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {selectedTests.map((test,index)=><Table.Row key={test.id+test.description}>
                                <Table.Cell>
                                    {test.name}
                                </Table.Cell>
                                <Table.Cell>
                                    {test.description}
                                </Table.Cell>
                                <Table.Cell>
                                    {test.price}
                                </Table.Cell>
                                <Table.Cell>
                                    <Button color="red" type="button" onClick={()=>{handleRemoveTest(test.id,test.description)}}>-</Button>
                                </Table.Cell>
                            </Table.Row>)}
                            
                        </Table.Body>
                    </Table.Root>}
                    <Select.Root>
                        <Select.Trigger placeholder="Payment mode" ></Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                <Select.Label>UPI</Select.Label>
                                <Select.Separator></Select.Separator>
                                <Select.Item value="phonepe">PHONEPE</Select.Item>
                                <Select.Item value="gpay">GOOGLE PAY</Select.Item>
                                <Select.Item value="paytm">PAYTM</Select.Item>
                                <Select.Item value="other">OTHERS...</Select.Item>                                
                            </Select.Group>
                            <Select.Group>
                                <Select.Label>Cash</Select.Label>
                                <Select.Separator></Select.Separator>
                                <Select.Item value="cash">Cash</Select.Item>
                            </Select.Group>
                        </Select.Content>
                     </Select.Root>
                     <Button type="submit">Generate Bill</Button>
                </form>
            </Box>
        </Container>
        </Flex>
    </Box>
    </>
}