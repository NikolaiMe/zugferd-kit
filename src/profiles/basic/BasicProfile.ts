import { z } from 'zod'

import { ZCodeType } from '../../types/CodeTypeConverter.js'
import { CURRENCY_CODES, DOCUMENT_TYPE_CODES, ISO6523_CODES } from '../../types/codes.js'
import { ZBasicTradeLineItem } from '../../types/ram/IncludedSupplyChainTradeLineItem/BasicTradeLineItem.js'
import { ZBasicDocumentLevelNoteType } from '../../types/ram/NoteType/BasicDocumentLevelNoteType.js'
import { ZReferencedDocumentType } from '../../types/ram/ReferencedDocumentConverter.js'
import { ZSpecifiedTaxRegistrationsForSellerType } from '../../types/ram/SpecifiedTaxRegistrationsForSellerTypeConverter.js'
import { ZSpecifiedTaxRegistrationsType } from '../../types/ram/SpecifiedTaxRegistrationsTypeConverter.js'
import { ZBasicDocumentLevelTradeAllowanceChargeType } from '../../types/ram/TradeAllowanceChargeType/BasicDocumentLevelAllowanceChargeType.js'
import { ZPaymentMeansType } from '../../types/ram/TradeSettlementPaymentMeansTypeConverter.js'
import { ZBasicDocumentLevelTradeTaxType } from '../../types/ram/TradeTaxType/BasicDocumentLevelTradeTaxType.js'
import { ZAmountType } from '../../types/udt/AmountTypeConverter.js'
import { ZAmountTypeWithRequiredCurrency } from '../../types/udt/AmountTypeWithRequiredCurrencyConverter.js'
import { ZDateTimeType } from '../../types/udt/DateTimeTypeConverter.js'
import { ZIdType } from '../../types/udt/IdTypeConverter.js'
import { ZIdTypeWithOptionalScheme } from '../../types/udt/IdTypeWithOptionalSchemeConverter.js'
import { ZIdTypeWithRequiredScheme } from '../../types/udt/IdTypeWithRequiredlSchemeConverter.js'
import { ZTextType } from '../../types/udt/TextTypeConverter.js'
import { ZTradePartyType } from '../basicwithoutlines/BasicWithoutLinesProfile.js'

export const ZBasicProfile = z.object({
    meta: z.object({
        businessProcessType: ZIdType.optional(),
        guidelineSpecifiedDocumentContextParameter: z.literal(
            'urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:basic'
        )
    }),
    document: z.object({
        id: ZIdType,
        type: ZCodeType(DOCUMENT_TYPE_CODES),
        dateOfIssue: ZDateTimeType,
        currency: ZCodeType(CURRENCY_CODES),
        notes: ZBasicDocumentLevelNoteType.array()
    }),
    seller: ZTradePartyType.extend({
        id: ZIdType.array().optional(),
        globalId: ZIdTypeWithRequiredScheme(ISO6523_CODES).array().optional(),
        specifiedLegalOrganization: z
            .object({
                id: ZIdTypeWithOptionalScheme(ISO6523_CODES).optional(),
                tradingBusinessName: ZTextType.optional()
            })
            .optional(),
        taxIdentification: ZSpecifiedTaxRegistrationsForSellerType.optional()
    }),
    buyer: ZTradePartyType.extend({
        reference: ZTextType.optional()
    }),
    sellerTaxRepresentative: ZTradePartyType.omit({
        id: true,
        globalId: true,
        specifiedLegalOrganization: true,
        universalCommunicationAddressURI: true
    })
        .extend({
            taxIdentification: ZSpecifiedTaxRegistrationsType
        })
        .optional(),
    invoiceLines: ZBasicTradeLineItem.array(),
    referencedDocuments: z
        .object({
            orderReference: ZIdType.optional(),
            contractReference: ZIdType.optional(),
            advanceShippingNotice: ZIdType.optional(),
            referencedInvoice: ZReferencedDocumentType.array().optional()
        })
        .optional(),
    delivery: z.object({
        recipient: ZTradePartyType.omit({
            specifiedLegalOrganization: true,
            universalCommunicationAddressURI: true,
            taxIdentification: true
        })
            .extend({ name: ZTextType.optional() })
            .optional(),
        deliveryDate: z.date()
    }),
    paymentInformation: z.object({
        creditorReference: ZIdType.optional(),
        paymentReference: ZTextType.optional(),
        payee: ZTradePartyType.pick({
            id: true,
            globalId: true,
            name: true,
            specifiedLegalOrganization: true
        }).optional(),
        paymentMeans: ZPaymentMeansType.array().optional(),
        billingPeriod: z
            .object({
                startDate: ZDateTimeType.optional(),
                endDate: ZDateTimeType.optional()
            })
            .optional(),
        paymentTerms: z
            .object({
                description: ZTextType.optional(),
                dueDate: ZDateTimeType.optional(),
                directDebitMandateID: ZIdType.optional()
            })
            .optional(),
        specifiedTradeAccountingAccount: ZIdType.optional()
    }),
    totals: z.object({
        sumWithoutAllowancesAndCharges: ZAmountType,
        documentLevelAllowancesAndCharges: ZBasicDocumentLevelTradeAllowanceChargeType.optional(),
        allowanceTotalAmount: ZAmountType.optional(),
        chargeTotalAmount: ZAmountType.optional(),
        netTotal: ZAmountType,
        taxBreakdown: ZBasicDocumentLevelTradeTaxType.array(),
        taxTotal: ZAmountTypeWithRequiredCurrency.array().max(2).optional(),
        taxCurrency: ZCodeType(CURRENCY_CODES).optional(),
        grossTotal: ZAmountType,
        prepaidAmount: ZAmountType.optional(),
        openAmount: ZAmountType
    })
})

export type BasicProfile = z.infer<typeof ZBasicProfile>

export function isBasicProfile(data: unknown): data is BasicProfile {
    return ZBasicProfile.safeParse(data).success
}
