/**
 * Conecta o cliente utilizando o token do ambiente.
 *
 * @returns {Promise<void>} Uma promessa que é resolvida quando o login é bem-sucedido ou rejeitada em caso de erro.
 *
 * @throws {Error} Lança um erro se o login falhar.
 */
import "dotenv/config";
import { client, logger } from ".";

export async function connect(): Promise<void> {
  // Verifica se o token está definido
  const token = process.env.TOKEN;
  if (!token) {
    const errorMessage = "Token not defined in environment variables.";
    logger.error(errorMessage, null, 5, __filename);
    throw new Error(errorMessage);
  }

  try {
    // Tenta fazer login no Discord
    await client.login(token)
    logger.info("Login successful");
  } catch (error) {
    // Loga o erro e lança uma exceção
    logger.error("failed to login", error, 5, __filename);
    throw error;
  }
}
