import { Flex, Fieldset, Stack, Field, Input, NativeSelect, For, Button, Box, FileUpload, Icon, InputGroup, Span, Textarea } from "@chakra-ui/react";
import AppLayout from "./AppLayout"
import { useClothContext } from "../hooks/useClothContext";
import { ClothingCategory, SeasonTag } from "../components/ClothContext"
import { LuUpload } from "react-icons/lu"
import { useState } from "react"

const MAX_CHARACTERS = 200;


export function AddItem() {
    const [value, setValue] = useState("")
    const defaultSeason: SeasonTag = "all";
    const categories: ClothingCategory[] = ["top", "bottom", "outerwear", "footwear", "accessory"];
    const seasons: SeasonTag[] = ["all", "spring", "summer", "fall", "winter"];
    return (
        <AppLayout>
            <Flex direction="column" minH="100vh" overflowY="auto">
                <Flex p={4} gap={4}>
                    <h1>Add Item Page - Under Construction</h1>
                </Flex>
                <form className="max-w-md mx-auto mt-8 p-4 border rounded">
                    <Flex direction="column" gap={6} p={10}>
                        <Fieldset.Root size="lg" maxW="md">
                            <Stack>
                                <Fieldset.Legend>Item details</Fieldset.Legend>
                                <Fieldset.HelperText>
                                    Please provide your item details below.
                                </Fieldset.HelperText>
                            </Stack>

                            <Fieldset.Content>
                                <Field.Root required>
                                    <Field.Label>Name <Field.RequiredIndicator /></Field.Label>
                                    <Input name="name" />
                                </Field.Root>
                                <Field.Root required>
                                    <Field.Label>Color <Field.RequiredIndicator /></Field.Label>
                                    <Input name="name" />
                                </Field.Root>
                                <Field.Root required>
                                    <Field.Label>Size <Field.RequiredIndicator /></Field.Label>
                                    <Input name="name" />
                                </Field.Root>
                                <Field.Root required>
                                    <Field.Label>Brand <Field.RequiredIndicator /></Field.Label>
                                    <Input name="name" />
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>Category <Field.RequiredIndicator /></Field.Label>
                                    <NativeSelect.Root>
                                        <NativeSelect.Field name="category" defaultValue={categories[0]}>
                                            <For each={categories}>
                                                {(item) => (
                                                    <option key={item} value={item}>
                                                        {item}
                                                    </option>
                                                )}
                                            </For>
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator />
                                    </NativeSelect.Root>
                                </Field.Root>
                                <Field.Root required>
                                    <Field.Label>Season <Field.RequiredIndicator /></Field.Label>
                                    <NativeSelect.Root>
                                        <NativeSelect.Field name="season" defaultValue={defaultSeason}>
                                            <For each={seasons}>
                                                {(item) => (
                                                    <option key={item} value={item}>
                                                        {item}
                                                    </option>
                                                )}
                                            </For>
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator />
                                    </NativeSelect.Root>
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>Description</Field.Label>
                                    <InputGroup
                                        endElement={
                                            <Span color="fg.muted" textStyle="xs">
                                                {value.length} / {MAX_CHARACTERS}
                                            </Span>
                                        }
                                    >
                                        <Textarea
                                            placeholder="Enter item description..."
                                            value={value}
                                            maxLength={MAX_CHARACTERS}
                                            onChange={(e) =>
                                                setValue(e.currentTarget.value.slice(0, MAX_CHARACTERS))
                                            }
                                            minH="120px"           // ✅ height control
                                            resize="vertical"      // ✅ allow user to resize (or use "none")
                                        />
                                    </InputGroup>
                                </Field.Root>
                                <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={10}>
                                    <FileUpload.HiddenInput />
                                    <FileUpload.Dropzone>
                                        <Icon size="md" color="fg.muted">
                                            <LuUpload />
                                        </Icon>
                                        <FileUpload.DropzoneContent>
                                            <Box>Drag and drop files here</Box>
                                            <Box color="fg.muted">.png, .jpg up to 5MB</Box>
                                        </FileUpload.DropzoneContent>
                                    </FileUpload.Dropzone>
                                    <FileUpload.List />
                                </FileUpload.Root>
                            </Fieldset.Content>

                            <Button type="submit" alignSelf="flex-start">
                                Submit
                            </Button>
                        </Fieldset.Root>
                    </Flex>
                </form>
            </Flex>
        </AppLayout >
    );
}

export default AddItem;