import { getDate } from "./getDate"

export const logger = {
    normal: (message: string) => {
        console.log(`${getDate().string} [info]: ${message}\x1b[0m`)
    },
    info: (message: string) => {
        console.log(`\x1b[33m${getDate().string} [info]: ${message}\x1b[0m`)
    },
    complete: (message: string) => {
        console.log(`\x1b[92m${getDate().string} [info]: ${message}\x1b[0m`)
    },
    warn: (message: string) => {
        console.log(`\x1b[31m${getDate().string} [info]: ${message}\x1b[0m`)
    },
    error: (message: string, error: any) => {
        console.log(`\x1b[91m${getDate().string} [info]: ${message}\nERROR: ${error}\x1b[0m`)
    },
}