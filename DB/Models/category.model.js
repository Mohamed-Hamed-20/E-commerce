import { Schema, model } from 'mongoose'

const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    Image: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false, // TODO: convert into true after creating usermodel
    },
    customId: String,
  },
  {
    toObject: { virtuals: true }, // for res.json()
    toJSON: { virtuals: true }, // for console.log()
    timestamps: true,
  },
)

//======================================== Vitruals ========================================
categorySchema.virtual('subCategories', {
  ref: 'subCategory',
  foreignField: 'categoryId',
  localField: '_id',
  // justOne: true,
})

export const categoryModel = model('Category', categorySchema)
