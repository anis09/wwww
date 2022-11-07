import mongoose, { Document, Schema } from "mongoose";

export interface IMessage {
  room:string;
  message: string;
  author: string;
  time:String;
   
}
export interface ImessageModel extends IMessage, Document {}

const MessageSchema: Schema = new Schema({
   room: { type: String, required: true },
  message: { type: String, required: true },
  author: { type: String},
  time:{type:String,required:true,default:Date.now}
  
});

export default mongoose.model<ImessageModel>("Messages", MessageSchema);