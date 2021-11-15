import { model, models, Schema } from "mongoose";
const warningSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  warnings: {
    type: Array,
    required: true,
  },
});
export const warningModel = models.warning || model("warning", warningSchema);
