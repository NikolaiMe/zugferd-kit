import { z } from 'zod'

import { ISO6523_CODES } from '../../../codes'
import { ZIdTypeWithOptionalScheme } from '../../../udt/IdTypeWithOptionalSchemeConverter'
import { ZIdTypeWithRequiredSchemeXml } from '../../../udt/IdTypeWithRequiredlSchemeConverter'
import { ZTextType, ZTextTypeXml } from '../../../udt/TextTypeConverter'

export const ZBasicTradeProductType = z.object({
    globalId: ZIdTypeWithOptionalScheme(ISO6523_CODES).optional(),
    name: ZTextType
})

export type BasicTradeProductType = z.infer<typeof ZBasicTradeProductType>

export const ZBasicTradeProductTypeXml = z.object({
    'ram:GlobalID': ZIdTypeWithRequiredSchemeXml.optional(),
    'ram:Name': ZTextTypeXml
})

export type BasicTradeProductTypeXml = z.infer<typeof ZBasicTradeProductTypeXml>
