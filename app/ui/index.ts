import {
  ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  LabelBuilder,
  ModalBuilder,
  SeparatorSpacingSize,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export function createStartSurveyButton() {
  return new ButtonBuilder()
    .setCustomId("start_survey")
    .setLabel("Start Survey")
    .setStyle(ButtonStyle.Success);
}

export function createSurveyPanelActions(): ActionRowBuilder<ButtonBuilder> {
  const row = new ActionRowBuilder<ButtonBuilder>();
  row.addComponents(
    new ButtonBuilder()
      .setCustomId("create_survey")
      .setStyle(ButtonStyle.Primary)
      .setLabel("New Survey"),

    new ButtonBuilder()
      .setCustomId("view_surveys")
      .setStyle(ButtonStyle.Primary)
      .setLabel("View Surveys"),
  );
  return row;
}

export function createSurveyPanelContainer(): ContainerBuilder {
  const containerBuilder = new ContainerBuilder();

  containerBuilder
    .addSectionComponents((section) =>
      section
        .addTextDisplayComponents((text) =>
          text.setContent("# Survey Admin Panel"),
        )
        .addTextDisplayComponents((text) =>
          text.setContent(
            "Φτιαξε ερωτηματολογια για να μπορεις να καταγραφεις πιο αποτελεσματικά τις ανάγκες του κοινού σου",
          ),
        )
        .setButtonAccessory(createStartSurveyButton()),
    )
    .addSeparatorComponents((separator) =>
      separator.setSpacing(SeparatorSpacingSize.Large),
    )
    .addActionRowComponents(createSurveyPanelActions());

  return containerBuilder;
}

export function createNewSurveyPanel(questions: any[]) {
  const container = new ContainerBuilder();
  container.addTextDisplayComponents((text) =>
    text.setContent("# Create Survey"),
  );

  container.addTextDisplayComponents((text) => {
    if (questions.length === 0) {
      text.setContent(
        "Δεν έχετε καταχωρήσει καμία ερώτηση. Επίλεξε το κουμπί Add Question",
      );
    } else {
      const questionsDisplay = questions
        .map((question, index) => {
          return `${index}. ${question}`;
        })
        .join("\n");
      text.setContent(questionsDisplay);
    }
    return text;
  });

  container.addActionRowComponents<ButtonBuilder>((row) =>
    row.addComponents(
      new ButtonBuilder()
        .setCustomId("add_question")
        .setLabel("➕ Add Question")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("save_survey")
        .setLabel("💾 Save")
        .setStyle(ButtonStyle.Success)
        .setDisabled(questions.length === 0),

      new ButtonBuilder()
        .setCustomId("cancel_survey")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger),
    ),
  );

  return container;
}

export function createAddQuestionModal() {
  const modal = new ModalBuilder()
    .setCustomId("add_question_modal")
    .setTitle("Add Question")
    .addLabelComponents(
      new LabelBuilder()
        .setLabel("Question Type")
        .setStringSelectMenuComponent(
          new StringSelectMenuBuilder()
            .setCustomId("question_type")
            .addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel("Single Choice")
                .setValue("single_choice"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Scale(1-5)")
                .setValue("scale"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Text")
                .setValue("text"),
            )
            .setRequired(true),
        ),
    )
    .addLabelComponents(
      new LabelBuilder()
        .setLabel("Question")
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId("question")
            .setStyle(TextInputStyle.Short)
            .setRequired(true),
        ),
    );

  return modal;
}

export function createAddTargetsView(targets: any[]) {
  const container = new ContainerBuilder();

  container.addTextDisplayComponents((text) =>
    text.setContent("Προσθεσε επιλογές"),
  );

  container.addTextDisplayComponents((text) => {
    if (targets.length === 0) {
      text.setContent(
        "Δεν έχετε καταχωρήσει κανένα target. Επίλεξε το κουμπί Add Question",
      );
    } else {
      const targetsDisplay = targets
        .map((target, index) => {
          return `${index}. ${target}`;
        })
        .join("\n");
      text.setContent(targetsDisplay);
    }
    return text;
  });

  container.addActionRowComponents((row) =>
    row.addComponents(
      new ButtonBuilder()
        .setCustomId("add_target")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Add target"),
    ),
  );

  return container;
}
