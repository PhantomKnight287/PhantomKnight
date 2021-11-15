import {Schema,models,model} from 'mongoose'
const emojisSchema = new Schema({
  customName: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
})
export const emojiModel = models.emoji || model('emoji',emojisSchema)