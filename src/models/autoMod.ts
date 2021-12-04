import { model, models, Schema } from "mongoose";
const autoModSchema = new Schema(
  {
    guildId: {
      type: String,
      required: true,
    },
    words: {
      type: Array,
      required: true,
    },
    enabled: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
export const autoModModel = models.automod || model("automod", autoModSchema);
