import { getDate } from "./getDate"

export const logger = {
    normal: (message: string) => {
        console.log(`${getDate().string} [normal]: ${message}\x1b[0m`)
    },
    info: (message: string) => {
        console.log(`\x1b[33m${getDate().string} [info]: ${message}\x1b[0m`)
    },
    updated: (message: string) => {
        console.log(`\x1b[92m${getDate().string} [updated]: ${message}\x1b[0m`)
    },
    warn: (message: string) => {
        console.log(`\x1b[31m${getDate().string} [Warn]: ${message}\x1b[0m`)
    },
    error: (message: string, error: any) => {
        console.log(`\x1b[91m${getDate().string} [Error]: ${message}\nError: ${error}\x1b[0m`)
    },
    database: {
        info: (message: string) => {
            console.log(`\x1b[35m${getDate().string} [Database] <Info>: ${message}\x1b[0m`)
        },
        create: (message: string) => {
            console.log(`\x1b[35m${getDate().string} [Database] <Create>: ${message}\x1b[0m`)
        },
        update: (message: string) => {
            console.log(`\x1b[35m${getDate().string} [Database] <Update>: ${message}\x1b[0m`)
        },
        delete: (message: string) => {
            console.log(`\x1b[35m${getDate().string} [Database] <Delete>: ${message}\x1b[0m`)
        },
        select: (message: string) => {
            console.log(`\x1b[35m${getDate().string} [Database] <Select>: ${message}\x1b[0m`)
        },
        error: (message: string, error: any) => {
            console.log(`\x1b[91m${getDate().string} [Database] <Error>: ${message}\nError: ${error}\x1b[0m`)
        },
    }
}