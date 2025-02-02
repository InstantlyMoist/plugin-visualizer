import { defineMongooseModel } from '#nuxt/mongoose'
import { v4 as uuidv4 } from 'uuid'

import { z } from "zod";

interface PluginPayload {
    _id: string | undefined;
    plugins: {
        [key: string]: {
            depend?: string[];
            softdepend?: string[];
        }
    },
    createdAt: Date;
}

const PluginPayloadSchema = z.object({
    plugins: z.record(
        z.object({
            depend: z.array(z.string())
                .optional(),
            softdepend: z.array(z.string())
                .optional()
        }
        ), {
            required_error: "Plugins are required!"
        })
})

export const PluginsSchema = defineMongooseModel<PluginPayload>({
    name: 'Plugins',
    schema: {
        _id: <any> { // Bypass _id type error
            type: String,
            default: uuidv4
        },
        plugins: {
            type: Object,
            required: true,
            default: {}
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    options: {
        timestamps: true
    },
    hooks(schema) {
        schema.pre('save', function (this, next) {
            if (!this._id) {
                this._id = uuidv4()
            }
            next()
        })
    }
})

export { PluginPayloadSchema };
export type { PluginPayload };