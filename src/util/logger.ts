import { getDate } from "./getDate"

export const logger = {
    command: {
        executing: (guildName: string, userName: string, message: string) => {
            console.log(`${getDate().string} [${guildName}][command][executing] <${userName}>: ${message}`)
        },
        success: (guildName: string, userName: string, message: string) => {
            console.log(`${getDate().string} [${guildName}][command][success] <${userName}>: ${message}`)
        },
        warn: (guildName: string, userName: string, message: string) => {
            console.log(`${getDate().string} [${guildName}][command][warn] <${userName}>: ${message}`)
        },
        error: (guildName: string, userName: string, message: string, path: string, error: any) => {
            console.log('_______________________ERROR_______________________')
            console.log(`${getDate().string} [${guildName}][command][error] <${userName}>: ${message}`)
            console.log(`Error Path: ${path}`)
            console.log(error)
            console.log('_____________________________________________________')
        },
    }
    ,
    normal: (message: string) => {
        console.log(`${getDate().string} [normal]: ${message}\x1b[0m`)
    },
    info: (message: string) => {
        console.log(`\x1b[92m${getDate().string} [info]: ${message}\x1b[0m`)
    },
    updated: (message: string) => {
        console.log(`\x1b[33m${getDate().string} [updated]: ${message}\x1b[0m`)
    },
    warn: (message: string) => {
        console.log(`\x1b[31m${getDate().string} [Warn]: ${message}\x1b[0m`)
    },
    error: (path: string, error: any) => {
        console.log(`\x1b[91m${getDate().string} [Error]: ${path}\n${error}\x1b[0m`)
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
            console.log(`\x1b[91m${getDate().string} [Database] <Error>: ${message}\x1b[0m`)
            console.log(error)
        },
    }
}