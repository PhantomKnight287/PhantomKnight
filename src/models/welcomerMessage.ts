import { Schema, models, model } from "mongoose";
const welcomerSchema = new Schema({
  welcomerMessage: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true
  },
  enable: {
    type: Boolean,
    required: false,
    default: true
  }
});
export const welcomerModel = models.welcomer || model("welcomer", welcomerSchema);
