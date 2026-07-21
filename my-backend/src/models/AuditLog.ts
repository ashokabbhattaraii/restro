import mongoose, { Schema, Document } from 'mongoose'

export interface IAuditLog extends Document {
  action: string
  resource: string
  resourceId?: string
  summary: string
  details?: Record<string, unknown>
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  admin: string
  ip?: string
  userAgent?: string
  timestamp: Date
}

const AuditLogSchema = new Schema<IAuditLog>({
  action: { type: String, required: true, index: true },
  resource: { type: String, required: true, index: true },
  resourceId: { type: String, index: true },
  summary: { type: String, required: true },
  details: { type: Schema.Types.Mixed },
  before: { type: Schema.Types.Mixed },
  after: { type: Schema.Types.Mixed },
  admin: { type: String, required: true },
  ip: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true })

AuditLogSchema.index({ action: 1, resource: 1, timestamp: -1 })
AuditLogSchema.index({ admin: 1, timestamp: -1 })

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema)