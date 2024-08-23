import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { logger } from "../..";
import { verifyPermission } from "../../utils/verifyPermission";
import { verifyPremiumAccess } from "../../utils/verifyPremiumAccess";

export const data = new SlashCommandBuilder()
  .setName("hierarquia")
  .setDescription("hierarquia");

export async function execute(interaction: CommandInteraction) {
  try {
    if (
      interaction.guildId !== "607043030360391730" &&
      interaction.guildId !== "1248992843629068298"
    )
    {
      await interaction.reply({
        content: "Este comando ainda não está disponível para todos os servidores.\n Novidades em breve!",
        ephemeral: true,
      })
      return;
    }  
    ;
    await interaction.deferReply();
    if (!await verifyPremiumAccess(interaction) || !await verifyPermission(interaction, 'Administrator')) return;

    let deusa: string[] = []; // "1260637364276166716" || "1273224645818056714"
    let lider01: string[] = []; // "1169271949768278087" || "1273224677787041803"
    let lider02: string[] = []; // "1169271950783295649" || "1273224728131276810"
    let gerenteGG: string[] = []; // "1169271951546650664" || "1273224749727744081"
    let gerenteGE: string[] = []; // "1237407381944664136" || "1273224783735291915"
    let gerenteGA: string[] = []; // "1169271953463447582" || "1273224808737542238"
    let gerenteGR: string[] = []; // "1187633230514491392" || "1273224831784980551"
    let developer: string[] = []; // "1273225589121089536" || "1273224857999638631"
    let elite: string[] = []; // "1188271745854091274" || "1273224882334728192"
    let vendedor: string[] = []; // "1187930106728022026" || "1273224903373357076"
    let recrutador: string[] = []; // "1169271954063237125" || "1273224927365042238"
    let novato: string[] = []; // "1169271957372534885" || "1273225007371391000"

    const members = await interaction.guild!.members.fetch();

    await members.each(async (member) => {
      if (member.user.bot) return;
      const highestId = member.roles.highest.id;

      if (highestId === "1260637364276166716" || highestId === "1273224645818056714") {
        deusa.push(member.id);
      } else if (
        highestId === "1169271949768278087" ||
        highestId === "1273224677787041803"
      ) {
        lider01.push(member.id);
      } else if (
        highestId === "1169271950783295649" ||
        highestId === "1273224728131276810"
      ) {
        lider02.push(member.id);
      } else if (
        highestId === "1169271951546650664" ||
        highestId === "1273224749727744081"
      ) {
        gerenteGG.push(member.id);
      } else if (
        highestId === "1237407381944664136" ||
        highestId === "1273224783735291915"
      ) {
        gerenteGE.push(member.id);
      } else if (
        highestId === "1169271953463447582" ||
        highestId === "1273224808737542238"
      ) {
        gerenteGA.push(member.id);
      } else if (
        highestId === "1187633230514491392" ||
        highestId === "1273224831784980551"
      ) {
        gerenteGR.push(member.id);
      } else if (
        highestId === "1273225589121089536" ||
        highestId === "1273224857999638631"
      ) {
        developer.push(member.id);
      } else if (
        highestId === "1188271745854091274" ||
        highestId === "1273224882334728192"
      ) {
        elite.push(member.id);
      } else if (
        highestId === "1187930106728022026" ||
        highestId === "1273224903373357076"
      ) {
        vendedor.push(member.id);
      } else if (
        highestId === "1169271954063237125" ||
        highestId === "1273224927365042238"
      ) {
        recrutador.push(member.id);
      } else if (
        highestId === "1169271957372534885" ||
        highestId === "1273225007371391000"
      ) {
        novato.push(member.id);
      }
      console.log(member.roles.highest.name);
    });

    if (lider01.length != 0) {
      let message = "# HIERARQUIA\n\n\n## **♛ LÍDERES  ♛**\n";
      lider01.forEach((id) => (message += `╰┈➤<@${id}> \`[01]\`\n`));
      setTimeout(async () => {
        await interaction.channel?.send({ content: message });
      }, 3000);
    }

    if (lider02.length != 0) {
      let message = "\n\n## **⚜ SUB - LIDERES ⚜ **\n";
      lider02.forEach((id) => (message += `╰┈➤<@${id}> \`[02]\`\n`));
      setTimeout(async () => {
        await interaction.channel?.send({ content: message });
      }, 3000);
    }

    if (gerenteGG.length + gerenteGE.length + gerenteGA.length + gerenteGR.length != 0) {
      let message = "\n\n## **✮  GERENTES ✮ **\n";
      gerenteGG.forEach((id) => (message += `╰┈➤<@${id}> \`[Gerente Geral]\`\n`));
      gerenteGE.forEach((id) => (message += `╰┈➤<@${id}> \`[Gerente Elite]\`\n`));
      gerenteGA.forEach((id) => (message += `╰┈➤<@${id}> \`[Gerente Ação]\`\n`));
      gerenteGR.forEach((id) => (message += `╰┈➤<@${id}> \`[Gerente Recrutamento]\`\n`));
      setTimeout(async () => {
        await interaction.channel?.send({ content: message });
      }, 3000);
    }

    if (elite.length != 0) {
      let message = "\n\n## **☘ ELITES ☘  **\n";
      elite.forEach((id) => (message += `╰┈➤<@${id}> \n`));
      setTimeout(async () => {
        await interaction.channel?.send({ content: message });
      }, 3000);
    }
    
    if (vendedor.length != 0) {
      let message = "\n\n## **☘ VENDEDORES ☘  **\n";
      vendedor.forEach((id) => (message += `╰┈➤<@${id}> \n`));
      setTimeout(async () => {
        await interaction.channel?.send({ content: message });
      }, 3000);
    }

    if (recrutador.length != 0) {
      let message = "\n\n## **☘ RECRUTADORES ☘  **\n";
      recrutador.forEach((id) => (message += `╰┈➤<@${id}> \n`));
      setTimeout(async () => {
        await interaction.channel?.send({ content: message });
      }, 3000);
    }

    //message += novato.length != 0 ? "\n\n## **☘ NOVATOS ☘  **\n" : "";
    //novato.forEach((id) => (message += `╰┈➤<@${id}> \n`));
  } catch (error) {
    const msg = `Error executing ${interaction.commandName} command`;
    const user = interaction.user
    logger.error(msg, error, 3, __filename, interaction.guild!, user);

    await interaction.editReply({
      content: `Error executing ${interaction.commandName} command`,
    });
  }
}
