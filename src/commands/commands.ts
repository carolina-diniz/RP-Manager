import * as cargo_entrada_add from './entryrole/cargo_entrada_add'
import * as cargo_entrada_remove from './entryrole/cargo_entrada_remove'
import * as help from './help/help'
import * as pedirset from './pedirset/pedirset'
import * as remover_cargo_add from './removerole/remover_cargo_add'
import * as remover_cargo_remove from './removerole/remover_cargo_remove'
import * as status from './status/status'

export const commands = {
  status, 
  help,
  pedirset,
  cargo_entrada_add,
  cargo_entrada_remove,
  remover_cargo_add,
  remover_cargo_remove,
}