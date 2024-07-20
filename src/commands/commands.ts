import * as cargo_entrada_add from './cargo_entrada/cargo_entrada_add'
import * as cargo_entrada_remove from './cargo_entrada/cargo_entrada_remove'
import * as help from './help/help'
import * as pedirset from './pedirset/pedirset'
import * as relatorio_venda from './relatorio_venda/relatorio_venda'
import * as remover_cargo_add from './remover_cargo/remover_cargo_add'
import * as remover_cargo_remove from './remover_cargo/remover_cargo_remove'
import * as status from './status/status'

export const commands = {
  status, 
  help,
  pedirset,

  cargo_entrada_add,
  cargo_entrada_remove,
  remover_cargo_add,
  remover_cargo_remove,

  relatorio_venda,
}