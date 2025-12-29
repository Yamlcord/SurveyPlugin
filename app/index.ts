import {
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  ContainerBuilder,
  GatewayIntentBits,
  Interaction,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { GrotCore } from "grot-core";
import { ActionTypes, Plugin } from "grot-core/app/types";
import path from "path";
import {
  createAddQuestionModal,
  createAddTargetsView,
  createNewSurveyPanel,
  createSurveyPanelContainer,
} from "./ui";

import { ISurveyDraft, SurveyDB } from "./types";
import { SurveyDraft } from "./DraftSurvey";

console.log("Welcome to Survey Plugin");

export class SurveyPlugin implements Plugin {
  name: string = "SurveyPlugin";
  dependencies?: string[] | undefined;
  requiredIntents?: GatewayIntentBits[] | undefined;
  migrationsPath: string = path.resolve("../migrations");
  initialize(core: GrotCore, serviceProvider: () => void): void {
    const database = core.getDatabase<SurveyDB>();

    core.registerInteraction({
      type: ActionTypes.SlashCommand,
      data: new SlashCommandBuilder()
        .setName("survey")
        .setDescription("Initializes survey panel")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
      execute: (interaction: ChatInputCommandInteraction) => {
        const surveyAdminPanel = createSurveyPanelContainer();

        interaction.reply({
          components: [surveyAdminPanel],
          flags: [MessageFlags.IsComponentsV2],
        });
      },
    });

    core.registerInteraction({
      type: ActionTypes.Button,
      name: "start_survey",
      view: (builder) => {
        return builder;
      },
      execute(interaction: ButtonInteraction) {
        interaction.reply({
          content:
            "Δεν υπάρχουν surveys στον server σου. Δοκιμασε να καταχωρήσεις ενα πατώντας το <<New Survey>> button",
          flags: [MessageFlags.Ephemeral],
        });
      },
    });

    core.registerInteraction({
      type: ActionTypes.Button,
      name: "create_survey",
      view: (builder) => {
        return builder;
      },

      async execute(interaction: ButtonInteraction) {
        const state: ISurveyDraft = new SurveyDraft();

        const newSurveyPanel = createNewSurveyPanel(state.questions);

        const messageInteractionCallback = await interaction.reply({
          components: [newSurveyPanel],
          flags: [MessageFlags.IsComponentsV2],
          withResponse: true,
        });

        if (!messageInteractionCallback?.resource?.message) return;
        const message = messageInteractionCallback.resource.message;
        const collector = message.createMessageComponentCollector({
          time: 10 * 60 * 1000,
          filter: (i: Interaction) => i.user.id === interaction.user.id,
        });

        collector.on("collect", async (i) => {
          if (i.customId === "add_question") {
            const addQuestionModal = createAddQuestionModal();

            await i.showModal(addQuestionModal);
            const modalSubmit = await i.awaitModalSubmit({
              time: 1000 * 60 * 10,
            });

            const type =
              modalSubmit.fields.getStringSelectValues("question_type");
            const question = modalSubmit.fields.getTextInputValue("question");
            draft.questions.push({
              id: "1234",
              question,
              type,
            });

            interaction.editReply({
              components: [createAddTargetsView(draft.targets)],
            });

            modalSubmit.deferUpdate();
          }

          if (i.customId === "updated_button") {
            i.reply("updated button works too");
          }

          if (i.customId === "save_survey") {
            // save logic
          }

          if (i.customId === "cancel_survey") {
            collector.stop("cancelled");
            await i.update({ content: "Survey cancelled", components: [] });
          }
        });

        collector.on("end", (_, reason) => {
          if (reason === "time") {
            interaction.editReply({
              content: "⏱️ Survey creation timed out",
              components: [],
            });
          }
        });
      },
    });
  }
}
