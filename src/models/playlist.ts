import { model, models, Schema } from "mongoose";
const playlistSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    playList: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const playlistModel =
  models.playlist || model("playlist", playlistSchema);
