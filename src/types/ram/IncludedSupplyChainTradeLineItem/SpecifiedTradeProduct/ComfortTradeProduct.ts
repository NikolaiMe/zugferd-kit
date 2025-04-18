import { z } from 'zod'

import { ZCodeType, ZCodeTypeXml } from '../../../CodeTypeConverter'
import { COUNTRY_ID_CODES, ISO6523_CODES } from '../../../codes'
import { ZIdType, ZIdTypeXml } from '../../../udt/IdTypeConverter'
import { ZIdTypeWithOptionalScheme } from '../../../udt/IdTypeWithOptionalSchemeConverter'
import { ZIdTypeWithRequiredSchemeXml } from '../../../udt/IdTypeWithRequiredlSchemeConverter'
import { ZTextType, ZTextTypeXml } from '../../../udt/TextTypeConverter'
import {
    ZComfortApplicableProductCharacteristicType,
    ZComfortApplicableProductCharacteristicTypeXml
} from './ApplicableProuctCharacteristic/ComfortApplicableProductCharacteristicType'
import {
    ZComfortDesignatedProductClassificationType,
    ZComfortDesignatedProductClassificationTypeXml
} from './DesignatedProductClassification/ComfortDesignatedProductClassificationType'

export const ZComfortTradeProductType = z.object({
    globalId: ZIdTypeWithOptionalScheme(ISO6523_CODES).optional(),
    sellerProductId: ZIdType.optional(),
    buyerProductId: ZIdType.optional(),
    name: ZTextType,
    description: ZTextType.optional(),
    productCharacteristic: ZComfortApplicableProductCharacteristicType.array().optional(),
    productClassification: ZComfortDesignatedProductClassificationType.array().optional(),
    originTradeCountry: ZCodeType(COUNTRY_ID_CODES).optional()
})

export type ComfortTradeProductType = z.infer<typeof ZComfortTradeProductType>

export const ZComfortTradeProductTypeXml = z.object({
    'ram:GlobalID': ZIdTypeWithRequiredSchemeXml.optional(),
    'ram:SellerAssignedID': ZIdTypeXml.optional(),
    'ram:BuyerAssignedID': ZIdTypeXml.optional(),
    'ram:Name': ZTextTypeXml,
    'ram:Description': ZTextTypeXml.optional(),
    'ram:ApplicableProductCharacteristic': z
        .union([ZComfortApplicableProductCharacteristicTypeXml.array(), ZComfortApplicableProductCharacteristicTypeXml])
        .optional(),
    'ram:DesignatedProductClassification': z
        .union([ZComfortDesignatedProductClassificationTypeXml.array(), ZComfortDesignatedProductClassificationTypeXml])
        .optional(),
    'ram:OriginTradeCountry': z
        .object({
            'ram:ID': ZCodeTypeXml
        })
        .optional()
})

export type ComfortTradeProductTypeXml = z.infer<typeof ZComfortTradeProductTypeXml>
