import { z } from 'zod'

import { UNTDID_7143 } from '../../../../codes'
import { ZTokenType } from '../../../../xs/TokenConverter'

export const ZComfortDesignatedProductClassificationType = z.object({
    productClass: z
        .object({
            code: z.string(),
            codeScheme: z.nativeEnum(UNTDID_7143),
            codeSchemeVersion: ZTokenType.optional()
        })
        .optional()
})

export type ComfortDesignatedProductClassificationType = z.infer<typeof ZComfortDesignatedProductClassificationType>

export const ZComfortDesignatedProductClassificationTypeXml = z.object({
    'ram:ClassCode': z
        .object({
            '#text': z.string(),
            '@listID': z.string(),
            '@listVersionID': ZTokenType.optional()
        })
        .optional()
})

export type ComfortDesignatedProductClassificationTypeXml = z.infer<
    typeof ZComfortDesignatedProductClassificationTypeXml
>
